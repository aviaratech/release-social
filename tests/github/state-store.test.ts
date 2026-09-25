import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { GitHubExecutionQuiescenceVerifier, GitHubStateStore } from '../../src/github/state-store.js';
import {
  appendPendingAttempt,
  appendTransition,
  canonicalJson,
  createAttemptId,
  createCliExecutionIdentity,
  createEmptyLedger,
  createTransitionId,
  recordKeyForPlan,
  sealLedger,
  validateLedger,
} from '../../src/publishing/ledger.js';
import { STATE_BRANCH, STATE_PATH, type PublishingLedgerV1 } from '../../src/publishing/types.js';
import { createPlans, fixedClock } from '../publishing/helpers.js';

interface FakeTreeEntry {
  path: string;
  mode: string;
  type: string;
  sha: string;
}

interface FakeTree {
  sha: string;
  entries: FakeTreeEntry[];
}

interface FakeCommit {
  sha: string;
  tree: string;
  parents: string[];
}

type PatchMode = 'normal' | 'apply_then_throw' | 'throw_before_apply';

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(Buffer.from(`blob ${bytes.length}\0`, 'utf8'))
    .update(bytes)
    .digest('hex');
}

function response(status: number, body?: unknown): Response {
  return new Response(body === undefined ? '' : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

class FakeGitHubGitApi {
  readonly repository = 'fictional/release-consumer';
  readonly blobs = new Map<string, string>();
  readonly trees = new Map<string, FakeTree>();
  readonly commits = new Map<string, FakeCommit>();
  readonly refs = new Map<string, string>();
  readonly requests: Array<{ method: string; url: string; authorization: string | null }> = [];
  readonly runStatuses = new Map<number, 'queued' | 'in_progress' | 'completed'>();

  patchMode: PatchMode = 'normal';
  beforeNextPatch: (() => void) | undefined;
  nextRefReadSha: string | undefined;
  extraTreeEntry: FakeTreeEntry | undefined;
  private counter = 1;

  readonly fetch: typeof fetch = async (input, init) => {
    const url = input instanceof Request ? new URL(input.url) : new URL(String(input));
    const method = init?.method ?? (input instanceof Request ? input.method : 'GET');
    const headers = new Headers(init?.headers);
    this.requests.push({
      method,
      url: url.href,
      authorization: headers.get('authorization'),
    });

    if (url.origin !== 'https://api.github.com') throw new Error('Unexpected GitHub host.');

    const prefix = '/repos/fictional/release-consumer';
    if (!url.pathname.startsWith(prefix)) return response(404);
    const path = url.pathname.slice(prefix.length);

    if (method === 'GET' && path === `/git/ref/heads/${STATE_BRANCH}`) {
      const stored = this.refs.get(STATE_BRANCH);
      const sha = this.nextRefReadSha ?? stored;
      this.nextRefReadSha = undefined;
      if (sha === undefined) return response(404);
      return response(200, {
        ref: `refs/heads/${STATE_BRANCH}`,
        object: { type: 'commit', sha },
      });
    }

    if (method === 'POST' && path === '/git/blobs') {
      const body = this.parseBody(init);
      if (typeof body.content !== 'string') return response(422);
      const sha = gitBlobSha(body.content);
      this.blobs.set(sha, body.content);
      return response(201, { sha });
    }

    if (method === 'POST' && path === '/git/trees') {
      const body = this.parseBody(init);
      const entries = new Map<string, FakeTreeEntry>();
      if (typeof body.base_tree === 'string') {
        for (const entry of this.trees.get(body.base_tree)?.entries ?? []) {
          entries.set(entry.path, { ...entry });
        }
      }
      if (!Array.isArray(body.tree)) return response(422);
      for (const raw of body.tree) {
        if (
          typeof raw !== 'object' ||
          raw === null ||
          !('path' in raw) ||
          !('mode' in raw) ||
          !('type' in raw) ||
          !('sha' in raw)
        ) {
          return response(422);
        }
        const item = raw as { path: unknown; mode: unknown; type: unknown; sha: unknown };
        if (
          typeof item.path !== 'string' ||
          typeof item.mode !== 'string' ||
          typeof item.type !== 'string' ||
          typeof item.sha !== 'string'
        ) {
          return response(422);
        }
        entries.set(item.path, {
          path: item.path,
          mode: item.mode,
          type: item.type,
          sha: item.sha,
        });
      }
      if (this.extraTreeEntry !== undefined) entries.set(this.extraTreeEntry.path, this.extraTreeEntry);
      const sha = this.fakeSha();
      const tree = { sha, entries: [...entries.values()] };
      this.trees.set(sha, tree);
      return response(201, { sha, tree: tree.entries, truncated: false });
    }

    if (method === 'POST' && path === '/git/commits') {
      const body = this.parseBody(init);
      if (typeof body.tree !== 'string' || !Array.isArray(body.parents)) return response(422);
      const parents = body.parents.filter((item): item is string => typeof item === 'string');
      const sha = this.fakeSha();
      this.commits.set(sha, { sha, tree: body.tree, parents });
      return response(201, { sha });
    }

    if (method === 'POST' && path === '/git/refs') {
      const body = this.parseBody(init);
      if (body.ref !== `refs/heads/${STATE_BRANCH}` || typeof body.sha !== 'string') return response(422);
      if (this.refs.has(STATE_BRANCH)) return response(422);
      this.refs.set(STATE_BRANCH, body.sha);
      return response(201, { ref: body.ref, object: { sha: body.sha } });
    }

    if (method === 'PATCH' && path === `/git/refs/heads/${STATE_BRANCH}`) {
      const callback = this.beforeNextPatch;
      this.beforeNextPatch = undefined;
      callback?.();

      if (this.patchMode === 'throw_before_apply') {
        this.patchMode = 'normal';
        throw new Error('synthetic patch timeout before apply');
      }

      const body = this.parseBody(init);
      if (typeof body.sha !== 'string' || body.force !== false) return response(422);
      const commit = this.commits.get(body.sha);
      const current = this.refs.get(STATE_BRANCH);
      if (commit === undefined || current === undefined || commit.parents[0] !== current) {
        return response(422);
      }
      this.refs.set(STATE_BRANCH, body.sha);

      if (this.patchMode === 'apply_then_throw') {
        this.patchMode = 'normal';
        throw new Error('synthetic patch timeout after apply');
      }
      return response(200, { ref: `refs/heads/${STATE_BRANCH}`, object: { sha: body.sha } });
    }

    const commitMatch = /^\/git\/commits\/([0-9a-f]{40})$/.exec(path);
    if (method === 'GET' && commitMatch?.[1]) {
      const commit = this.commits.get(commitMatch[1]);
      if (commit === undefined) return response(404);
      return response(200, {
        sha: commit.sha,
        tree: { sha: commit.tree },
        parents: commit.parents.map((sha) => ({ sha })),
      });
    }

    const treeMatch = /^\/git\/trees\/([0-9a-f]{40})$/.exec(path);
    if (method === 'GET' && treeMatch?.[1]) {
      const tree = this.trees.get(treeMatch[1]);
      if (tree === undefined) return response(404);
      return response(200, {
        sha: tree.sha,
        truncated: false,
        tree: tree.entries,
      });
    }

    const blobMatch = /^\/git\/blobs\/([0-9a-f]{40})$/.exec(path);
    if (method === 'GET' && blobMatch?.[1]) {
      const content = this.blobs.get(blobMatch[1]);
      if (content === undefined) return response(404);
      return response(200, {
        sha: blobMatch[1],
        encoding: 'base64',
        content: Buffer.from(content, 'utf8').toString('base64'),
      });
    }

    const runMatch = /^\/actions\/runs\/(\d+)$/.exec(path);
    if (method === 'GET' && runMatch?.[1]) {
      const runId = Number(runMatch[1]);
      const status = this.runStatuses.get(runId);
      if (status === undefined) return response(404);
      return response(200, { id: runId, status });
    }

    return response(404);
  };

  currentHead(): string | undefined {
    return this.refs.get(STATE_BRANCH);
  }

  deleteStateBranch(): void {
    this.refs.delete(STATE_BRANCH);
  }

  currentLedger(): PublishingLedgerV1 {
    const head = this.refs.get(STATE_BRANCH);
    if (head === undefined) throw new Error('No state branch.');
    const commit = this.commits.get(head);
    const tree = commit ? this.trees.get(commit.tree) : undefined;
    const blob = tree?.entries.find((entry) => entry.path === STATE_PATH);
    const text = blob ? this.blobs.get(blob.sha) : undefined;
    if (text === undefined) throw new Error('No state blob.');
    return validateLedger(JSON.parse(text));
  }

  advanceLedger(ledger: PublishingLedgerV1): string {
    const current = this.refs.get(STATE_BRANCH);
    if (current === undefined) throw new Error('No state branch.');
    const parent = this.commits.get(current);
    if (parent === undefined) throw new Error('Missing parent commit.');

    const text = canonicalJson(ledger) + '\n';
    const blobSha = gitBlobSha(text);
    this.blobs.set(blobSha, text);
    const treeSha = this.fakeSha();
    this.trees.set(treeSha, {
      sha: treeSha,
      entries: [{ path: STATE_PATH, mode: '100644', type: 'blob', sha: blobSha }],
    });
    const commitSha = this.fakeSha();
    this.commits.set(commitSha, {
      sha: commitSha,
      tree: treeSha,
      parents: [current],
    });
    this.refs.set(STATE_BRANCH, commitSha);
    return commitSha;
  }

  rewriteStateText(text: string): void {
    const current = this.refs.get(STATE_BRANCH);
    if (current === undefined) throw new Error('No state branch.');
    const blobSha = gitBlobSha(text);
    this.blobs.set(blobSha, text);
    const treeSha = this.fakeSha();
    this.trees.set(treeSha, {
      sha: treeSha,
      entries: [{ path: STATE_PATH, mode: '100644', type: 'blob', sha: blobSha }],
    });
    const commitSha = this.fakeSha();
    this.commits.set(commitSha, { sha: commitSha, tree: treeSha, parents: [current] });
    this.refs.set(STATE_BRANCH, commitSha);
  }

  private parseBody(init: RequestInit | undefined): Record<string, unknown> {
    if (typeof init?.body !== 'string') return {};
    const parsed: unknown = JSON.parse(init.body);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  }

  private fakeSha(): string {
    const sha = this.counter.toString(16).padStart(40, '0');
    this.counter += 1;
    return sha;
  }
}

function store(api: FakeGitHubGitApi, token = 'synthetic-github-token'): GitHubStateStore {
  return new GitHubStateStore({
    repository: api.repository,
    token,
    fetch: api.fetch,
  });
}

async function appendXAttempt(state: GitHubStateStore, executionId: string): Promise<void> {
  const [plan] = createPlans({ includeLinkedIn: false });
  if (plan === undefined) throw new Error('Missing X plan.');
  const attemptId = createAttemptId();
  await state.transition(
    {
      id: createTransitionId(),
      kind: 'append_pending',
      at: fixedClock().now(),
      recordKey: recordKeyForPlan(plan),
      attemptId,
    },
    (current) => {
      const appended = appendPendingAttempt(
        current,
        plan,
        createCliExecutionIdentity(executionId),
        attemptId,
        fixedClock().now(),
      );
      return { next: appended.ledger, value: undefined };
    },
  );
}

describe('GitHubStateStore', () => {
  it('requires explicit initialization, creates a data-only root, and refuses reinitialization', async () => {
    const api = new FakeGitHubGitApi();
    const state = store(api);

    await expect(state.read()).rejects.toMatchObject({ code: 'state_branch_missing' });
    await state.initialize();

    expect(api.currentHead()).toBeDefined();
    expect(await state.read()).toEqual(createEmptyLedger());
    await expect(state.initialize()).rejects.toMatchObject({ code: 'state_branch_exists' });

    const head = api.currentHead();
    const commit = head ? api.commits.get(head) : undefined;
    expect(commit?.parents).toEqual([]);
    const tree = commit ? api.trees.get(commit.tree) : undefined;
    expect(tree?.entries.map((entry) => entry.path)).toEqual([STATE_PATH]);
  });

  it('proves an uncertain ref response when the exact transition was committed', async () => {
    const api = new FakeGitHubGitApi();
    const state = store(api);
    await state.initialize();

    api.patchMode = 'apply_then_throw';
    await expect(appendXAttempt(state, '40000000-0000-4000-8000-000000000001')).resolves.toBeUndefined();

    const ledger = await state.read();
    expect(Object.keys(ledger.records)).toHaveLength(1);
    expect(ledger.transitions.some((transition) => transition.kind === 'append_pending')).toBe(true);
  });

  it('fails closed when an uncertain ref response cannot be proven', async () => {
    const api = new FakeGitHubGitApi();
    const state = store(api);
    await state.initialize();

    api.patchMode = 'throw_before_apply';
    await expect(appendXAttempt(state, '40000000-0000-4000-8000-000000000002')).rejects.toMatchObject({
      code: 'state_uncertain',
    });

    expect(Object.keys((await state.read()).records)).toHaveLength(0);
  });

  it('re-reads after a concurrent sibling commit and preserves the unrelated record', async () => {
    const api = new FakeGitHubGitApi();
    const state = store(api);
    await state.initialize();

    const plans = createPlans();
    const xPlan = plans.find((plan) => plan.destination === 'x');
    const linkedInPlan = plans.find((plan) => plan.destination === 'linkedin');
    if (xPlan === undefined || linkedInPlan === undefined) throw new Error('Missing plans.');

    api.beforeNextPatch = () => {
      const current = api.currentLedger();
      const attemptId = '40000000-0000-4000-8000-000000000003';
      const appended = appendPendingAttempt(
        current,
        linkedInPlan,
        createCliExecutionIdentity('40000000-0000-4000-8000-000000000004'),
        attemptId,
        fixedClock().now(),
      );
      const withTransition = appendTransition(appended.ledger, {
        id: '40000000-0000-4000-8000-000000000005',
        kind: 'append_pending',
        at: fixedClock().now(),
        recordKey: recordKeyForPlan(linkedInPlan),
        attemptId,
      });
      api.advanceLedger(withTransition);
    };

    const xAttemptId = '40000000-0000-4000-8000-000000000006';
    await state.transition(
      {
        id: '40000000-0000-4000-8000-000000000007',
        kind: 'append_pending',
        at: fixedClock().now(),
        recordKey: recordKeyForPlan(xPlan),
        attemptId: xAttemptId,
      },
      (current) => {
        const appended = appendPendingAttempt(
          current,
          xPlan,
          createCliExecutionIdentity('40000000-0000-4000-8000-000000000008'),
          xAttemptId,
          fixedClock().now(),
        );
        return { next: appended.ledger, value: undefined };
      },
    );

    const final = await state.read();
    expect(final.records[recordKeyForPlan(xPlan)]).toBeDefined();
    expect(final.records[recordKeyForPlan(linkedInPlan)]).toBeDefined();
  });

  it('recovers from a stale ref read through fast-forward conflict revalidation', async () => {
    const api = new FakeGitHubGitApi();
    const state = store(api);
    await state.initialize();
    const staleHead = api.currentHead();
    if (staleHead === undefined) throw new Error('Missing state head.');

    const competitor = createEmptyLedger();
    const [linkedInPlan] = createPlans({ includeX: false });
    if (linkedInPlan === undefined) throw new Error('Missing LinkedIn plan.');
    const attemptId = '40000000-0000-4000-8000-000000000009';
    const appended = appendPendingAttempt(
      competitor,
      linkedInPlan,
      createCliExecutionIdentity('40000000-0000-4000-8000-00000000000a'),
      attemptId,
      fixedClock().now(),
    );
    api.advanceLedger(
      appendTransition(appended.ledger, {
        id: '40000000-0000-4000-8000-00000000000b',
        kind: 'append_pending',
        at: fixedClock().now(),
        recordKey: recordKeyForPlan(linkedInPlan),
        attemptId,
      }),
    );

    api.nextRefReadSha = staleHead;
    await appendXAttempt(state, '40000000-0000-4000-8000-00000000000c');

    expect(Object.keys((await state.read()).records)).toHaveLength(2);
  });

  it('fails closed on a missing branch, checksum corruption, unsupported implementation, or extra paths', async () => {
    const api = new FakeGitHubGitApi();
    const state = store(api);
    await state.initialize();

    const corrupted = { ...createEmptyLedger(), checksum: '0'.repeat(64) };
    api.rewriteStateText(JSON.stringify(corrupted));
    await expect(state.read()).rejects.toMatchObject({ code: 'state_corrupt' });

    const api2 = new FakeGitHubGitApi();
    const state2 = store(api2);
    await state2.initialize();
    const unsupported = sealLedger({
      ...createEmptyLedger(),
      implementationId: 'future/incompatible:v9',
    });
    api2.rewriteStateText(canonicalJson(unsupported));
    await expect(state2.read()).rejects.toMatchObject({ code: 'state_unsupported' });

    const api3 = new FakeGitHubGitApi();
    const state3 = store(api3);
    await state3.initialize();
    const extraContent = '{}';
    const extraSha = gitBlobSha(extraContent);
    api3.blobs.set(extraSha, extraContent);
    api3.extraTreeEntry = { path: 'unexpected.txt', mode: '100644', type: 'blob', sha: extraSha };
    await expect(appendXAttempt(state3, '40000000-0000-4000-8000-00000000000d')).rejects.toMatchObject({
      code: 'state_uncertain',
    });
    await expect(state3.read()).rejects.toMatchObject({ code: 'state_corrupt' });

    const api4 = new FakeGitHubGitApi();
    const state4 = store(api4);
    await state4.initialize();
    api4.deleteStateBranch();
    await expect(state4.read()).rejects.toMatchObject({ code: 'state_branch_missing' });
  });

  it('never stores the GitHub token or provider secrets in state data or diagnostics', async () => {
    const api = new FakeGitHubGitApi();
    const secret = 'SUPER_SECRET_GITHUB_TOKEN';
    const state = store(api, secret);
    await state.initialize();
    await appendXAttempt(state, '40000000-0000-4000-8000-00000000000e');

    const stateText = canonicalJson(await state.read());
    expect(stateText).not.toContain(secret);
    expect(stateText).not.toContain('X_API_SECRET');
    expect(api.requests.every((request) => request.url.startsWith('https://api.github.com/'))).toBe(true);

    api.deleteStateBranch();
    let error: unknown;
    try {
      await state.read();
    } catch (caught: unknown) {
      error = caught;
    }
    expect(String(error)).not.toContain(secret);
  });
});

describe('GitHubExecutionQuiescenceVerifier', () => {
  it('requires completed GitHub runs and explicit settled CLI attestation', async () => {
    const api = new FakeGitHubGitApi();
    api.runStatuses.set(123, 'in_progress');
    const verifier = new GitHubExecutionQuiescenceVerifier({
      token: 'synthetic-token',
      fetch: api.fetch,
    });
    const run = {
      kind: 'github_run' as const,
      repository: api.repository,
      runId: 123,
      url: 'https://github.com/fictional/release-consumer/actions/runs/123',
    };

    await expect(verifier.verify(run)).rejects.toMatchObject({ code: 'execution_not_quiescent' });
    api.runStatuses.set(123, 'completed');
    await expect(verifier.verify(run)).resolves.toBeUndefined();

    const cli = createCliExecutionIdentity('40000000-0000-4000-8000-00000000000f');
    await expect(verifier.verify(cli)).rejects.toMatchObject({ code: 'execution_not_quiescent' });
    await expect(verifier.verify(cli, { processStoppedAndRequestsSettled: true })).resolves.toBeUndefined();
  });
});
