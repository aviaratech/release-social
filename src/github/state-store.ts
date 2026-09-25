import { createHash } from 'node:crypto';

import { PublishingError } from '../publishing/errors.js';
import { appendTransition, canonicalJson, createEmptyLedger, validateLedger } from '../publishing/ledger.js';
import {
  STATE_BRANCH,
  STATE_PATH,
  type ExecutionQuiescenceVerifier,
  type PublicExecutionIdentity,
  type PublishingLedgerV1,
  type PublishingStateRepository,
  type StateMutation,
  type StateTransitionMetadata,
} from '../publishing/types.js';

const API_ORIGIN = 'https://api.github.com';
const API_VERSION = '2026-03-10';
const MAX_CONFLICT_RETRIES = 4;
const MAX_ANCESTRY_DEPTH = 128;

export interface GitHubStateStoreOptions {
  repository: string;
  token: string;
  fetch?: typeof fetch;
  maxConflictRetries?: number;
}

interface StateSnapshot {
  ledger: PublishingLedgerV1;
  headSha: string;
  treeSha: string;
}

interface GitReference {
  sha: string;
}

interface GitCommit {
  sha: string;
  treeSha: string;
  parents: string[];
}

interface GitTreeEntry {
  path: string;
  mode: string;
  type: string;
  sha: string;
}

class GitHubHttpError extends Error {
  readonly status: number;

  constructor(status: number, operation: string) {
    super(`GitHub ${operation} failed with HTTP ${status}.`);
    this.name = 'GitHubHttpError';
    this.status = status;
  }
}

class GitHubTransportError extends Error {
  constructor(operation: string) {
    super(`GitHub ${operation} transport failed.`);
    this.name = 'GitHubTransportError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, operation: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new PublishingError('state_corrupt', `GitHub returned malformed ${operation} metadata.`);
  }
  return value;
}

function requireSha(value: unknown, operation: string): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/i.test(value)) {
    throw new PublishingError('state_corrupt', `GitHub returned an invalid SHA for ${operation}.`);
  }
  return value.toLowerCase();
}

function parseReference(value: unknown): GitReference {
  const root = requireRecord(value, 'reference');
  const object = requireRecord(root.object, 'reference object');
  return { sha: requireSha(object.sha, 'reference') };
}

function parseCommit(value: unknown): GitCommit {
  const root = requireRecord(value, 'commit');
  const sha = requireSha(root.sha, 'commit');
  const tree = requireRecord(root.tree, 'commit tree');
  const treeSha = requireSha(tree.sha, 'commit tree');

  if (!Array.isArray(root.parents)) {
    throw new PublishingError('state_corrupt', 'GitHub commit parents are malformed.');
  }
  const parents = root.parents.map((parent, index) => {
    const item = requireRecord(parent, `commit parent ${index}`);
    return requireSha(item.sha, `commit parent ${index}`);
  });
  if (parents.length > 1) {
    throw new PublishingError('state_corrupt', 'Publishing state history must be linear.');
  }
  return { sha, treeSha, parents };
}

function parseTree(value: unknown): { sha: string; entries: GitTreeEntry[] } {
  const root = requireRecord(value, 'tree');
  const sha = requireSha(root.sha, 'tree');
  if (root.truncated === true) {
    throw new PublishingError('state_corrupt', 'Publishing state tree response was truncated.');
  }
  if (!Array.isArray(root.tree)) {
    throw new PublishingError('state_corrupt', 'Publishing state tree entries are malformed.');
  }
  const entries = root.tree.map((entry, index) => {
    const item = requireRecord(entry, `tree entry ${index}`);
    if (typeof item.path !== 'string' || typeof item.mode !== 'string' || typeof item.type !== 'string') {
      throw new PublishingError('state_corrupt', 'Publishing state tree entry metadata is malformed.');
    }
    return {
      path: item.path,
      mode: item.mode,
      type: item.type,
      sha: requireSha(item.sha, `tree entry ${index}`),
    };
  });
  return { sha, entries };
}

function parseBlob(value: unknown, expectedSha: string): string {
  const root = requireRecord(value, 'blob');
  const sha = requireSha(root.sha, 'blob');
  if (sha !== expectedSha) {
    throw new PublishingError('state_corrupt', 'Publishing state blob SHA does not match its tree entry.');
  }
  if (root.encoding !== 'base64' || typeof root.content !== 'string') {
    throw new PublishingError('state_corrupt', 'Publishing state blob encoding is unsupported.');
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(root.content.replace(/\s/g, ''), 'base64');
  } catch {
    throw new PublishingError('state_corrupt', 'Publishing state blob is not valid base64.');
  }

  const gitSha = createHash('sha1')
    .update(Buffer.from(`blob ${bytes.length}\0`, 'utf8'))
    .update(bytes)
    .digest('hex');
  if (gitSha !== expectedSha) {
    throw new PublishingError('state_corrupt', 'Publishing state blob checksum does not match Git metadata.');
  }

  return bytes.toString('utf8');
}

function parseCreatedSha(value: unknown, operation: string): string {
  return requireSha(requireRecord(value, operation).sha, operation);
}

function repositoryParts(repository: string): { owner: string; name: string } {
  const match = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(repository);
  if (!match?.[1] || !match[2]) {
    throw new Error('GitHub repository must use owner/name.');
  }
  return { owner: match[1], name: match[2] };
}

export class GitHubStateStore implements PublishingStateRepository {
  private readonly token: string;
  private readonly fetcher: typeof fetch;
  private readonly maxConflictRetries: number;
  private readonly owner: string;
  private readonly name: string;

  constructor(options: GitHubStateStoreOptions) {
    const { owner, name } = repositoryParts(options.repository);
    if (options.token.trim() === '') throw new Error('GitHub state-store token must not be empty.');
    this.owner = owner;
    this.name = name;
    this.token = options.token;
    this.fetcher = options.fetch ?? fetch;
    this.maxConflictRetries = options.maxConflictRetries ?? MAX_CONFLICT_RETRIES;
  }

  async initialize(): Promise<void> {
    const existing = await this.getReference(true);
    if (existing !== undefined) {
      throw new PublishingError(
        'state_branch_exists',
        'release-social-state already exists; initialization will not overwrite existing history.',
      );
    }

    const ledger = createEmptyLedger();
    const blobSha = await this.createBlob(canonicalJson(ledger) + '\n');
    const treeSha = await this.createTree(undefined, blobSha);
    const commitSha = await this.createCommit(treeSha, [], 'Initialize release-social publishing state');

    try {
      const response = await this.request(
        `/repos/${this.owner}/${this.name}/git/refs`,
        {
          method: 'POST',
          body: JSON.stringify({
            ref: `refs/heads/${STATE_BRANCH}`,
            sha: commitSha,
          }),
        },
        'create state reference',
      );
      if (response.status !== 201) {
        throw new GitHubHttpError(response.status, 'create state reference');
      }
    } catch (error: unknown) {
      const located = await this.locateInitializedState(commitSha);
      if (located) return;
      if (error instanceof GitHubHttpError && (error.status === 409 || error.status === 422)) {
        throw new PublishingError(
          'state_branch_exists',
          'State initialization lost a race to an existing release-social-state branch.',
        );
      }
      throw new PublishingError(
        'state_uncertain',
        'State-branch initialization could not be proven; do not recreate or overwrite it.',
      );
    }

    if (!(await this.locateInitializedState(commitSha))) {
      throw new PublishingError(
        'state_uncertain',
        'State initialization response succeeded but the exact initialized branch could not be read back.',
      );
    }
  }

  async read(): Promise<PublishingLedgerV1> {
    return (await this.readSnapshot()).ledger;
  }

  async transition<T>(
    metadata: StateTransitionMetadata,
    apply: (current: PublishingLedgerV1) => StateMutation<T>,
  ): Promise<T> {
    for (let retry = 0; retry <= this.maxConflictRetries; retry += 1) {
      const snapshot = await this.readSnapshot();
      const mutation = apply(snapshot.ledger);
      validateLedger(mutation.next);
      const next = appendTransition(mutation.next, metadata);
      validateLedger(next);

      const blobSha = await this.createBlob(canonicalJson(next) + '\n');
      const treeSha = await this.createTree(snapshot.treeSha, blobSha);
      const commitSha = await this.createCommit(
        treeSha,
        [snapshot.headSha],
        `release-social state: ${metadata.kind.slice(0, 64)}`,
      );

      let response: Response;
      try {
        response = await this.request(
          `/repos/${this.owner}/${this.name}/git/refs/heads/${STATE_BRANCH}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ sha: commitSha, force: false }),
          },
          'update state reference',
        );
      } catch {
        if (await this.verifyCommittedTransition(commitSha, metadata.id)) return mutation.value;
        throw new PublishingError(
          'state_uncertain',
          'GitHub state ref update had an uncertain transport outcome and the exact transition could not be proven.',
        );
      }

      if (response.status === 200) {
        if (await this.verifyCommittedTransition(commitSha, metadata.id)) return mutation.value;
        throw new PublishingError(
          'state_uncertain',
          'GitHub accepted the state ref update but the exact transition could not be read back.',
        );
      }

      if (response.status === 409 || response.status === 422) {
        const current = await this.getReference(false);
        if (current.sha !== snapshot.headSha) {
          continue;
        }
        throw new PublishingError(
          'state_conflict',
          'GitHub rejected a state ref update without a competing successor; transition was not applied.',
        );
      }

      throw new PublishingError(
        'state_conflict',
        `GitHub rejected the state transition with HTTP ${response.status}; transition was not applied.`,
      );
    }

    throw new PublishingError(
      'state_conflict',
      'Publishing state changed repeatedly during the transition; retry in a new explicit operation.',
    );
  }

  private async locateInitializedState(commitSha: string): Promise<boolean> {
    try {
      const ref = await this.getReference(true);
      if (ref?.sha !== commitSha) return false;
      const snapshot = await this.readSnapshot();
      return (
        snapshot.headSha === commitSha &&
        Object.keys(snapshot.ledger.records).length === 0 &&
        snapshot.ledger.transitions.length === 0
      );
    } catch {
      return false;
    }
  }

  private async verifyCommittedTransition(commitSha: string, transitionId: string): Promise<boolean> {
    try {
      const snapshot = await this.readSnapshot();
      if (!snapshot.ledger.transitions.some((transition) => transition.id === transitionId)) return false;
      return await this.isAncestor(snapshot.headSha, commitSha);
    } catch {
      return false;
    }
  }

  private async isAncestor(headSha: string, targetSha: string): Promise<boolean> {
    let current = headSha;
    for (let depth = 0; depth < MAX_ANCESTRY_DEPTH; depth += 1) {
      if (current === targetSha) return true;
      const commit = await this.getCommit(current);
      const parent = commit.parents[0];
      if (parent === undefined) return false;
      current = parent;
    }
    return false;
  }

  private async readSnapshot(): Promise<StateSnapshot> {
    const ref = await this.getReference(false);
    const commit = await this.getCommit(ref.sha);
    if (commit.sha !== ref.sha) {
      throw new PublishingError('state_corrupt', 'State reference does not resolve to the requested commit.');
    }

    const treeResponse = await this.request(
      `/repos/${this.owner}/${this.name}/git/trees/${commit.treeSha}?recursive=1`,
      { method: 'GET' },
      'read state tree',
    );
    if (treeResponse.status !== 200) throw new GitHubHttpError(treeResponse.status, 'read state tree');
    const tree = parseTree(await this.responseJson(treeResponse, 'state tree'));
    if (tree.sha !== commit.treeSha) {
      throw new PublishingError('state_corrupt', 'State commit tree SHA does not match the fetched tree.');
    }
    if (
      tree.entries.length !== 1 ||
      tree.entries[0]?.path !== STATE_PATH ||
      tree.entries[0]?.type !== 'blob' ||
      tree.entries[0]?.mode !== '100644'
    ) {
      throw new PublishingError(
        'state_corrupt',
        'release-social-state must remain data-only and contain exactly the expected state JSON file.',
      );
    }

    const blobEntry = tree.entries[0];
    const blobResponse = await this.request(
      `/repos/${this.owner}/${this.name}/git/blobs/${blobEntry.sha}`,
      { method: 'GET' },
      'read state blob',
    );
    if (blobResponse.status !== 200) throw new GitHubHttpError(blobResponse.status, 'read state blob');
    const stateText = parseBlob(await this.responseJson(blobResponse, 'state blob'), blobEntry.sha);

    let parsed: unknown;
    try {
      parsed = JSON.parse(stateText);
    } catch {
      throw new PublishingError('state_corrupt', 'Publishing state JSON is malformed.');
    }

    return {
      ledger: validateLedger(parsed),
      headSha: ref.sha,
      treeSha: commit.treeSha,
    };
  }

  private async getReference(allowMissing: true): Promise<GitReference | undefined>;
  private async getReference(allowMissing: false): Promise<GitReference>;
  private async getReference(allowMissing: boolean): Promise<GitReference | undefined> {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/ref/heads/${STATE_BRANCH}`,
      { method: 'GET' },
      'read state reference',
    );
    if (response.status === 404) {
      if (allowMissing) return undefined;
      throw new PublishingError(
        'state_branch_missing',
        'release-social-state is missing. Initialize it explicitly before publishing.',
      );
    }
    if (response.status !== 200) throw new GitHubHttpError(response.status, 'read state reference');
    return parseReference(await this.responseJson(response, 'state reference'));
  }

  private async getCommit(sha: string): Promise<GitCommit> {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/commits/${sha}`,
      { method: 'GET' },
      'read state commit',
    );
    if (response.status !== 200) throw new GitHubHttpError(response.status, 'read state commit');
    return parseCommit(await this.responseJson(response, 'state commit'));
  }

  private async createBlob(content: string): Promise<string> {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/blobs`,
      {
        method: 'POST',
        body: JSON.stringify({ content, encoding: 'utf-8' }),
      },
      'create state blob',
    );
    if (response.status !== 201) throw new GitHubHttpError(response.status, 'create state blob');
    return parseCreatedSha(await this.responseJson(response, 'created blob'), 'created blob');
  }

  private async createTree(baseTree: string | undefined, blobSha: string): Promise<string> {
    const body: {
      tree: Array<{ path: string; mode: string; type: string; sha: string }>;
      base_tree?: string;
    } = {
      tree: [{ path: STATE_PATH, mode: '100644', type: 'blob', sha: blobSha }],
    };
    if (baseTree !== undefined) body.base_tree = baseTree;

    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/trees`,
      { method: 'POST', body: JSON.stringify(body) },
      'create state tree',
    );
    if (response.status !== 201) throw new GitHubHttpError(response.status, 'create state tree');
    return parseCreatedSha(await this.responseJson(response, 'created tree'), 'created tree');
  }

  private async createCommit(treeSha: string, parents: string[], message: string): Promise<string> {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/commits`,
      {
        method: 'POST',
        body: JSON.stringify({ message, tree: treeSha, parents }),
      },
      'create state commit',
    );
    if (response.status !== 201) throw new GitHubHttpError(response.status, 'create state commit');
    return parseCreatedSha(await this.responseJson(response, 'created commit'), 'created commit');
  }

  private async responseJson(response: Response, operation: string): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      throw new PublishingError('state_corrupt', `GitHub returned malformed JSON for ${operation}.`);
    }
  }

  private async request(path: string, init: RequestInit, operation: string): Promise<Response> {
    const url = new URL(path, API_ORIGIN);
    if (url.origin !== API_ORIGIN) throw new Error('GitHub state-store request escaped the official API host.');

    const headers = new Headers(init.headers);
    headers.set('accept', 'application/vnd.github+json');
    headers.set('authorization', `Bearer ${this.token}`);
    headers.set('content-type', 'application/json');
    headers.set('x-github-api-version', API_VERSION);

    let response: Response;
    try {
      response = await this.fetcher(url, {
        ...init,
        headers,
        redirect: 'manual',
      });
    } catch {
      throw new GitHubTransportError(operation);
    }

    if (response.status >= 300 && response.status < 400) {
      throw new GitHubHttpError(response.status, `${operation} redirect`);
    }
    return response;
  }
}

export interface GitHubExecutionVerifierOptions {
  token: string;
  fetch?: typeof fetch;
}

export class GitHubExecutionQuiescenceVerifier implements ExecutionQuiescenceVerifier {
  private readonly token: string;
  private readonly fetcher: typeof fetch;

  constructor(options: GitHubExecutionVerifierOptions) {
    if (options.token.trim() === '') throw new Error('GitHub execution-verifier token must not be empty.');
    this.token = options.token;
    this.fetcher = options.fetch ?? fetch;
  }

  async verify(
    execution: PublicExecutionIdentity,
    cliAttestation?: { processStoppedAndRequestsSettled: true },
  ): Promise<void> {
    if (execution.kind === 'cli') {
      if (cliAttestation?.processStoppedAndRequestsSettled !== true) {
        throw new PublishingError(
          'execution_not_quiescent',
          'CLI reconciliation requires explicit attestation that the originating process stopped and requests settled.',
        );
      }
      return;
    }

    const { owner, name } = repositoryParts(execution.repository);
    const url = new URL(`/repos/${owner}/${name}/actions/runs/${execution.runId}`, API_ORIGIN);
    const headers = new Headers();
    headers.set('accept', 'application/vnd.github+json');
    headers.set('authorization', `Bearer ${this.token}`);
    headers.set('x-github-api-version', API_VERSION);

    let response: Response;
    try {
      response = await this.fetcher(url, { method: 'GET', headers, redirect: 'manual' });
    } catch {
      throw new PublishingError(
        'execution_not_quiescent',
        'GitHub run quiescence could not be verified after a transport failure.',
      );
    }

    if (response.status !== 200) {
      throw new PublishingError(
        'execution_not_quiescent',
        `GitHub run quiescence could not be verified (HTTP ${response.status}).`,
      );
    }

    let parsed: unknown;
    try {
      parsed = await response.json();
    } catch {
      throw new PublishingError('execution_not_quiescent', 'GitHub run status response was malformed.');
    }
    const root = requireRecord(parsed, 'workflow run');
    if (root.id !== execution.runId || root.status !== 'completed') {
      throw new PublishingError(
        'execution_not_quiescent',
        'The originating GitHub run is still active or does not match the recorded execution.',
      );
    }
  }
}
