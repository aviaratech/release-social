import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const controlPath = process.env.RELEASE_SOCIAL_ACCEPTANCE_CONTROL;
const statePath = process.env.RELEASE_SOCIAL_ACCEPTANCE_STATE;
const logPath = process.env.RELEASE_SOCIAL_ACCEPTANCE_LOG;

if (!controlPath || !statePath || !logPath) {
  throw new Error('Acceptance preload requires control, state, and log paths.');
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function control() {
  return readJson(controlPath);
}

function initialState() {
  return {
    counter: 1,
    refs: {},
    blobs: {},
    trees: {},
    commits: {},
  };
}

function loadState() {
  return existsSync(statePath) ? readJson(statePath) : initialState();
}

function saveState(state) {
  writeFileSync(statePath, JSON.stringify(state), 'utf8');
}

function fakeSha(state) {
  const value = state.counter.toString(16).padStart(40, '0');
  state.counter += 1;
  return value;
}

function gitBlobSha(content) {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(Buffer.from(`blob ${bytes.length}\0`, 'utf8'))
    .update(bytes)
    .digest('hex');
}

function response(status, body = undefined, headers = {}) {
  const responseHeaders = new Headers(headers);
  if (body !== undefined && !responseHeaders.has('content-type')) {
    responseHeaders.set('content-type', 'application/json');
  }
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

function parseBody(init) {
  if (typeof init?.body !== 'string') return {};
  try {
    const parsed = JSON.parse(init.body);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function authorizationFacts(headers, current) {
  const authorization = headers.get('authorization') ?? '';
  return {
    scheme: authorization.split(/\s+/, 1)[0] ?? '',
    xOAuth: authorization.startsWith('OAuth ')
      ? {
          hasConsumerKey: authorization.includes(`oauth_consumer_key="${current.x.apiKey}"`),
          hasAccessToken: authorization.includes(`oauth_token="${current.x.accessToken}"`),
          hasHmacSha1: authorization.includes('oauth_signature_method="HMAC-SHA1"'),
          hasSignature: authorization.includes('oauth_signature='),
          leaksApiSecret: authorization.includes(current.x.apiSecret),
          leaksTokenSecret: authorization.includes(current.x.accessTokenSecret),
        }
      : undefined,
    linkedInBearerMatches: authorization === `Bearer ${current.linkedin.accessToken}`,
  };
}

function logRequest(url, init, current) {
  const headers = new Headers(init?.headers);
  const record = {
    url,
    method: init?.method ?? 'GET',
    redirect: init?.redirect ?? 'follow',
    contentType: headers.get('content-type'),
    linkedinVersion: headers.get('linkedin-version'),
    restliVersion: headers.get('x-restli-protocol-version'),
    authorization: authorizationFacts(headers, current),
    body: typeof init?.body === 'string' ? init.body : null,
  };
  appendFileSync(logPath, JSON.stringify(record) + '\n', 'utf8');
}

function githubPath(url, current) {
  const prefix = `/repos/${current.release.repository}`;
  return url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) || '/' : undefined;
}

function handleGitHub(url, init, current) {
  const state = loadState();
  const method = init?.method ?? 'GET';
  const path = githubPath(url, current);
  if (path === undefined) return response(404);

  if (method === 'GET' && path === '/') {
    return response(200, {
      id: current.release.repositoryId,
      full_name: current.release.repository,
      private: false,
      visibility: 'public',
    });
  }

  if (method === 'GET' && path === `/releases/${current.release.releaseId}`) {
    return response(200, {
      id: current.release.releaseId,
      tag_name: current.release.tag,
      html_url: current.release.url,
      body: current.release.body,
      draft: false,
      prerelease: false,
    });
  }

  if (method === 'GET' && path === '/git/ref/heads/release-social-state') {
    const sha = state.refs['release-social-state'];
    return sha === undefined ? response(404) : response(200, { object: { sha } });
  }

  if (method === 'POST' && path === '/git/blobs') {
    const body = parseBody(init);
    if (typeof body.content !== 'string' || body.encoding !== 'utf-8') return response(422);
    const sha = gitBlobSha(body.content);
    state.blobs[sha] = body.content;
    saveState(state);
    return response(201, { sha });
  }

  if (method === 'POST' && path === '/git/trees') {
    const body = parseBody(init);
    if (!Array.isArray(body.tree)) return response(422);
    const entries = new Map();
    if (typeof body.base_tree === 'string') {
      for (const entry of state.trees[body.base_tree]?.entries ?? []) {
        entries.set(entry.path, { ...entry });
      }
    }
    for (const raw of body.tree) {
      if (
        typeof raw !== 'object' ||
        raw === null ||
        typeof raw.path !== 'string' ||
        typeof raw.mode !== 'string' ||
        typeof raw.type !== 'string' ||
        typeof raw.sha !== 'string'
      ) {
        return response(422);
      }
      entries.set(raw.path, {
        path: raw.path,
        mode: raw.mode,
        type: raw.type,
        sha: raw.sha,
      });
    }
    const sha = fakeSha(state);
    state.trees[sha] = { sha, entries: [...entries.values()] };
    saveState(state);
    return response(201, { sha });
  }

  if (method === 'POST' && path === '/git/commits') {
    const body = parseBody(init);
    if (typeof body.tree !== 'string' || !Array.isArray(body.parents)) return response(422);
    const parents = body.parents.filter((item) => typeof item === 'string');
    const sha = fakeSha(state);
    state.commits[sha] = { sha, tree: body.tree, parents };
    saveState(state);
    return response(201, { sha });
  }

  if (method === 'POST' && path === '/git/refs') {
    const body = parseBody(init);
    if (body.ref !== 'refs/heads/release-social-state' || typeof body.sha !== 'string') return response(422);
    if (state.refs['release-social-state'] !== undefined) return response(422);
    state.refs['release-social-state'] = body.sha;
    saveState(state);
    return response(201, { ref: body.ref, object: { sha: body.sha } });
  }

  if (method === 'PATCH' && path === '/git/refs/heads/release-social-state') {
    const body = parseBody(init);
    if (typeof body.sha !== 'string' || body.force !== false) return response(422);
    const commit = state.commits[body.sha];
    const currentHead = state.refs['release-social-state'];
    if (!commit || currentHead === undefined || commit.parents[0] !== currentHead) {
      return response(422);
    }
    state.refs['release-social-state'] = body.sha;
    saveState(state);
    return response(200, { ref: 'refs/heads/release-social-state', object: { sha: body.sha } });
  }

  const commitMatch = /^\/git\/commits\/([0-9a-f]{40})$/.exec(path);
  if (method === 'GET' && commitMatch?.[1]) {
    const commit = state.commits[commitMatch[1]];
    if (!commit) return response(404);
    return response(200, {
      sha: commit.sha,
      tree: { sha: commit.tree },
      parents: commit.parents.map((sha) => ({ sha })),
    });
  }

  const treeMatch = /^\/git\/trees\/([0-9a-f]{40})$/.exec(path);
  if (method === 'GET' && treeMatch?.[1]) {
    const tree = state.trees[treeMatch[1]];
    if (!tree) return response(404);
    return response(200, {
      sha: tree.sha,
      truncated: false,
      tree: tree.entries,
    });
  }

  const blobMatch = /^\/git\/blobs\/([0-9a-f]{40})$/.exec(path);
  if (method === 'GET' && blobMatch?.[1]) {
    const blob = state.blobs[blobMatch[1]];
    if (blob === undefined) return response(404);
    return response(200, {
      sha: blobMatch[1],
      encoding: 'base64',
      content: Buffer.from(blob, 'utf8').toString('base64'),
    });
  }

  const runMatch = /^\/actions\/runs\/(\d+)$/.exec(path);
  if (method === 'GET' && runMatch?.[1]) {
    return response(200, { id: Number(runMatch[1]), status: 'completed' });
  }

  return response(404);
}

function handleX(url, init, current) {
  const method = init?.method ?? 'GET';

  if (method === 'GET' && url.pathname === '/2/users/me') {
    return response(200, { data: { id: current.x.accountId, username: 'fictional_release_account' } });
  }

  if (method === 'POST' && url.pathname === '/2/tweets') {
    if (current.x.mode === 'success') {
      return response(201, { data: { id: current.x.postId, text: 'ignored' } });
    }
    if (current.x.mode === 'rate_limit') {
      return response(429, { title: 'Synthetic rate limit' }, { 'retry-after': '1' });
    }
    if (current.x.mode === 'reject') {
      return response(403, { title: 'Synthetic rejection' });
    }
    if (current.x.mode === 'ambiguous_503') {
      return response(503, { title: 'Synthetic ambiguous failure' });
    }
    throw new Error('Unsupported synthetic X mode: ' + current.x.mode);
  }

  return response(404);
}

function handleLinkedIn(url, init, current) {
  const method = init?.method ?? 'GET';
  if (method === 'POST' && url.pathname === '/rest/posts') {
    if (current.linkedin.mode === 'success') {
      return response(201, undefined, { 'x-restli-id': current.linkedin.postUrn });
    }
    if (current.linkedin.mode === 'rate_limit') {
      return response(429, undefined, { 'retry-after': '1' });
    }
    if (current.linkedin.mode === 'reject') {
      return response(403);
    }
    if (current.linkedin.mode === 'ambiguous_503') {
      return response(503);
    }
    throw new Error('Unsupported synthetic LinkedIn mode: ' + current.linkedin.mode);
  }
  return response(404);
}

globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
  const current = control();
  logRequest(url.href, init, current);

  if (url.origin === 'https://api.github.com') return handleGitHub(url, init, current);
  if (url.origin === 'https://api.x.com') return handleX(url, init, current);
  if (url.origin === 'https://api.linkedin.com') return handleLinkedIn(url, init, current);

  throw new Error('Acceptance harness blocked unexpected network request: ' + url.href);
};
