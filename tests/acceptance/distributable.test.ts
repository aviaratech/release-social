import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

import { describe, expect, it } from 'vitest';

const REPOSITORY = 'fictional/release-social-acceptance';
const REPOSITORY_ID = 424242;
const RELEASE_ID = 515151;
const RELEASE_TAG = 'v1.2.3';
const RELEASE_URL = `https://github.com/${REPOSITORY}/releases/tag/${RELEASE_TAG}`;
const X_ACCOUNT_ID = '123456789012345678';
const X_POST_ID = '987654321098765432';
const LINKEDIN_AUTHOR = 'urn:li:person:FictionalMember123';
const LINKEDIN_POST_URN = 'urn:li:share:987654321098765433';
const LINKEDIN_VERSION = '202609';

const GH_TOKEN = 'synthetic-github-token';
const X_API_KEY = 'synthetic-x-api-key';
const X_API_SECRET = 'synthetic-x-api-secret';
const X_ACCESS_TOKEN = 'synthetic-x-access-token';
const X_ACCESS_TOKEN_SECRET = 'synthetic-x-access-token-secret';
const LINKEDIN_ACCESS_TOKEN = 'synthetic-linkedin-access-token';

const RELEASE_BODY = [
  '<!-- release-social:v1 -->',
  '',
  '<!-- announcement:start -->',
  'Fictional #1 release (stable).',
  '<!-- announcement:end -->',
  '',
  '## Highlights',
  '- Proves distributable-level social publishing with synthetic APIs.',
  '',
  '## Upgrade notes',
  'No breaking changes.',
  '',
  '<!-- social:short',
  'Fictional release is ready.',
  '-->',
  '',
].join('\n');

const EXPECTED_X_TEXT = `Fictional release is ready.\n\n${RELEASE_URL}`;
const EXPECTED_LINKEDIN_TEXT = `Fictional \\#1 release \\(stable\\).\n\n${RELEASE_URL}`;

type Selection = 'x' | 'linkedin' | 'both';
interface Control {
  release: {
    repository: string;
    repositoryId: number;
    releaseId: number;
    tag: string;
    url: string;
    body: string;
  };
  x: {
    mode: 'success' | 'rate_limit' | 'reject' | 'ambiguous_503';
    accountId: string;
    postId: string;
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };
  linkedin: {
    mode: 'success' | 'rate_limit' | 'reject' | 'ambiguous_503';
    postUrn: string;
    accessToken: string;
  };
}

interface LoggedRequest {
  url: string;
  method: string;
  redirect: string;
  contentType: string | null;
  linkedinVersion: string | null;
  restliVersion: string | null;
  authorization: {
    scheme: string;
    xOAuth?: {
      hasConsumerKey: boolean;
      hasAccessToken: boolean;
      hasHmacSha1: boolean;
      hasSignature: boolean;
      leaksApiSecret: boolean;
      leaksTokenSecret: boolean;
    };
    linkedInBearerMatches: boolean;
  };
  body: string | null;
}

interface MockGitState {
  refs: Record<string, string>;
  blobs: Record<string, string>;
  trees: Record<string, { entries: Array<{ path: string; sha: string }> }>;
  commits: Record<string, { tree: string }>;
}

interface Sandbox {
  directory: string;
  controlPath: string;
  statePath: string;
  logPath: string;
  workspace: string;
  configPath: string;
  outputPath: string;
}

const PRELOAD = resolve('test-fixtures/acceptance/mock-runtime.mjs');
const BUILT_CLI = resolve('dist/cli/bin.js');
const ACTION_BUNDLE = resolve('action-dist/index.cjs');

function config(selection: Selection): object {
  return {
    version: 1,
    destinations: {
      ...(selection === 'linkedin' ? {} : { x: { accountId: X_ACCOUNT_ID } }),
      ...(selection === 'x' ? {} : { linkedin: { author: LINKEDIN_AUTHOR, apiVersion: LINKEDIN_VERSION } }),
    },
  };
}

function defaultControl(): Control {
  return {
    release: {
      repository: REPOSITORY,
      repositoryId: REPOSITORY_ID,
      releaseId: RELEASE_ID,
      tag: RELEASE_TAG,
      url: RELEASE_URL,
      body: RELEASE_BODY,
    },
    x: {
      mode: 'success',
      accountId: X_ACCOUNT_ID,
      postId: X_POST_ID,
      apiKey: X_API_KEY,
      apiSecret: X_API_SECRET,
      accessToken: X_ACCESS_TOKEN,
      accessTokenSecret: X_ACCESS_TOKEN_SECRET,
    },
    linkedin: {
      mode: 'success',
      postUrn: LINKEDIN_POST_URN,
      accessToken: LINKEDIN_ACCESS_TOKEN,
    },
  };
}

async function sandbox(selection: Selection): Promise<Sandbox> {
  const directory = await mkdtemp(join(tmpdir(), 'release-social-acceptance-'));
  const workspace = join(directory, 'workspace');
  const configPath = join(workspace, 'release-social.json');
  const controlPath = join(directory, 'control.json');
  const statePath = join(directory, 'git-state.json');
  const logPath = join(directory, 'requests.ndjson');
  const outputPath = join(directory, 'github-output.txt');

  await import('node:fs/promises').then(({ mkdir }) => mkdir(workspace, { recursive: true }));
  await writeFile(configPath, JSON.stringify(config(selection)), 'utf8');
  await writeFile(controlPath, JSON.stringify(defaultControl()), 'utf8');
  await writeFile(logPath, '', 'utf8');
  await writeFile(outputPath, '', 'utf8');

  return { directory, controlPath, statePath, logPath, workspace, configPath, outputPath };
}

async function updateControl(box: Sandbox, mutate: (value: Control) => void): Promise<void> {
  const value = JSON.parse(await readFile(box.controlPath, 'utf8')) as Control;
  mutate(value);
  await writeFile(box.controlPath, JSON.stringify(value), 'utf8');
}

function baseEnv(box: Sandbox): NodeJS.ProcessEnv {
  return {
    ...process.env,
    RELEASE_SOCIAL_ACCEPTANCE_CONTROL: box.controlPath,
    RELEASE_SOCIAL_ACCEPTANCE_STATE: box.statePath,
    RELEASE_SOCIAL_ACCEPTANCE_LOG: box.logPath,
    GH_TOKEN,
    X_API_KEY,
    X_API_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_TOKEN_SECRET,
    LINKEDIN_ACCESS_TOKEN,
  };
}

function runNode(
  args: readonly string[],
  env: NodeJS.ProcessEnv,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, [...args], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', rejectRun);
    child.on('close', (code) => resolveRun({ code, stdout, stderr }));
  });
}

async function initializeState(box: Sandbox): Promise<void> {
  const result = await runNode(
    ['--import', PRELOAD, BUILT_CLI, 'state-init', '--repository', REPOSITORY],
    baseEnv(box),
  );
  expect(result.code, result.stderr).toBe(0);
  await writeFile(box.logPath, '', 'utf8');
}

async function publishCli(box: Sandbox): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return await runNode(
    [
      '--import',
      PRELOAD,
      BUILT_CLI,
      'publish',
      '--repository',
      REPOSITORY,
      '--release-id',
      String(RELEASE_ID),
      '--config',
      box.configPath,
    ],
    baseEnv(box),
  );
}

async function publishAction(box: Sandbox): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return await runNode(['--import', PRELOAD, ACTION_BUNDLE], {
    ...baseEnv(box),
    GITHUB_WORKSPACE: box.workspace,
    GITHUB_OUTPUT: box.outputPath,
    GITHUB_RUN_ID: '7001',
    INPUT_MODE: 'publish',
    INPUT_REPOSITORY: REPOSITORY,
    'INPUT_RELEASE-ID': String(RELEASE_ID),
    'INPUT_CONFIG-PATH': 'release-social.json',
    INPUT_TOKEN: GH_TOKEN,
  });
}

async function requests(box: Sandbox): Promise<LoggedRequest[]> {
  const text = await readFile(box.logPath, 'utf8');
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as LoggedRequest);
}

function xIdentityCalls(log: readonly LoggedRequest[]): LoggedRequest[] {
  return log.filter((item) => item.url === 'https://api.x.com/2/users/me' && item.method === 'GET');
}

function xCreateCalls(log: readonly LoggedRequest[]): LoggedRequest[] {
  return log.filter((item) => item.url === 'https://api.x.com/2/tweets' && item.method === 'POST');
}

function linkedInCreateCalls(log: readonly LoggedRequest[]): LoggedRequest[] {
  return log.filter((item) => item.url === 'https://api.linkedin.com/rest/posts' && item.method === 'POST');
}

function assertXCall(call: LoggedRequest): void {
  expect(call.redirect).toBe('manual');
  expect(call.contentType).toBe('application/json');
  expect(call.authorization.scheme).toBe('OAuth');
  expect(call.authorization.xOAuth).toEqual({
    hasConsumerKey: true,
    hasAccessToken: true,
    hasHmacSha1: true,
    hasSignature: true,
    leaksApiSecret: false,
    leaksTokenSecret: false,
  });
  expect(call.authorization.linkedInBearerMatches).toBe(false);
  expect(call.body).toBe(JSON.stringify({ text: EXPECTED_X_TEXT }));
}

function assertLinkedInCall(call: LoggedRequest): void {
  expect(call.redirect).toBe('manual');
  expect(call.contentType).toBe('application/json');
  expect(call.authorization.scheme).toBe('Bearer');
  expect(call.authorization.linkedInBearerMatches).toBe(true);
  expect(call.linkedinVersion).toBe(LINKEDIN_VERSION);
  expect(call.restliVersion).toBe('2.0.0');

  const body = JSON.parse(call.body ?? '{}') as {
    author?: string;
    commentary?: string;
    visibility?: string;
    distribution?: {
      feedDistribution?: string;
      targetEntities?: unknown[];
      thirdPartyDistributionChannels?: unknown[];
    };
    lifecycleState?: string;
  };
  expect(body).toEqual({
    author: LINKEDIN_AUTHOR,
    commentary: EXPECTED_LINKEDIN_TEXT,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
  });
}

async function ledger(box: Sandbox): Promise<{
  records: Record<string, { attempts: Array<{ state: string; terminal?: { url?: string; providerId?: string } }> }>;
}> {
  const state = JSON.parse(await readFile(box.statePath, 'utf8')) as MockGitState;
  const head = state.refs['release-social-state'];
  if (!head) throw new Error('Synthetic state branch is missing.');
  const commit = state.commits[head];
  if (!commit) throw new Error('Synthetic state head commit is missing.');
  const tree = state.trees[commit.tree];
  if (!tree) throw new Error('Synthetic state tree is missing.');
  const entry = tree.entries.find((item) => item.path === 'release-social-state-v1.json');
  if (!entry) throw new Error('Synthetic state blob entry is missing.');
  const text = state.blobs[entry.sha];
  if (text === undefined) throw new Error('Synthetic state blob is missing.');
  return JSON.parse(text) as {
    records: Record<string, { attempts: Array<{ state: string; terminal?: { url?: string; providerId?: string } }> }>;
  };
}

function assertConfirmedState(value: Awaited<ReturnType<typeof ledger>>, selection: Selection): void {
  const records = Object.values(value.records);
  expect(records).toHaveLength(selection === 'both' ? 2 : 1);
  expect(records.every((record) => record.attempts.at(-1)?.state === 'published')).toBe(true);
  const urls = records.map((record) => record.attempts.at(-1)?.terminal?.url);
  if (selection !== 'linkedin') expect(urls).toContain(`https://x.com/i/web/status/${X_POST_ID}`);
  if (selection !== 'x') expect(urls).toContain(`https://www.linkedin.com/feed/update/${LINKEDIN_POST_URN}`);
}

function parseAggregate(stdout: string): string | undefined {
  try {
    const parsed = JSON.parse(stdout) as { aggregate?: string };
    return parsed.aggregate;
  } catch {
    return undefined;
  }
}

describe.skipIf(!existsSync(BUILT_CLI))('distributable social publish acceptance', () => {
  for (const target of ['cli', 'action'] as const) {
    for (const selection of ['x', 'linkedin', 'both'] as const) {
      it(`${target} publishes ${selection} through the real provider implementations`, async () => {
        const box = await sandbox(selection);
        await initializeState(box);

        const result = target === 'cli' ? await publishCli(box) : await publishAction(box);
        expect(result.code, result.stderr).toBe(0);
        expect(parseAggregate(result.stdout)).toBe('success');

        const log = await requests(box);
        const xGets = xIdentityCalls(log);
        const xPosts = xCreateCalls(log);
        const linkedInPosts = linkedInCreateCalls(log);

        expect(xGets).toHaveLength(selection === 'linkedin' ? 0 : 1);
        expect(xPosts).toHaveLength(selection === 'linkedin' ? 0 : 1);
        expect(linkedInPosts).toHaveLength(selection === 'x' ? 0 : 1);

        if (xPosts[0]) assertXCall(xPosts[0]);
        if (linkedInPosts[0]) assertLinkedInCall(linkedInPosts[0]);

        if (selection === 'both') {
          const xPreflightIndex = log.findIndex(
            (item) => item.url === 'https://api.x.com/2/users/me' && item.method === 'GET',
          );
          const firstCreateIndex = log.findIndex(
            (item) =>
              (item.url === 'https://api.x.com/2/tweets' || item.url === 'https://api.linkedin.com/rest/posts') &&
              item.method === 'POST',
          );
          expect(xPreflightIndex).toBeGreaterThanOrEqual(0);
          expect(firstCreateIndex).toBeGreaterThan(xPreflightIndex);
        }

        assertConfirmedState(await ledger(box), selection);
      });
    }
  }

  it('preserves a confirmed X success across a LinkedIn rejection and cross-process retry', async () => {
    const box = await sandbox('both');
    await initializeState(box);
    await updateControl(box, (value) => {
      value.linkedin.mode = 'rate_limit';
    });

    const first = await publishCli(box);
    expect(first.code).toBe(1);
    expect(parseAggregate(first.stdout)).toBe('partial');

    const firstLog = await requests(box);
    expect(xCreateCalls(firstLog)).toHaveLength(1);
    expect(linkedInCreateCalls(firstLog)).toHaveLength(1);
    assertXCall(xCreateCalls(firstLog)[0]!);

    await updateControl(box, (value) => {
      value.linkedin.mode = 'success';
    });
    const second = await publishCli(box);
    expect(second.code, second.stderr).toBe(0);
    expect(parseAggregate(second.stdout)).toBe('success');

    const combinedLog = await requests(box);
    expect(xCreateCalls(combinedLog)).toHaveLength(1);
    expect(linkedInCreateCalls(combinedLog)).toHaveLength(2);
    assertConfirmedState(await ledger(box), 'both');
  });

  it('does not repost an ambiguous X create across a separate-process rerun before reconciliation', async () => {
    const box = await sandbox('x');
    await initializeState(box);
    await updateControl(box, (value) => {
      value.x.mode = 'ambiguous_503';
    });

    const first = await publishCli(box);
    expect(first.code).toBe(1);
    expect(parseAggregate(first.stdout)).toBe('unknown');
    expect(xCreateCalls(await requests(box))).toHaveLength(1);

    await updateControl(box, (value) => {
      value.x.mode = 'success';
    });
    const second = await publishCli(box);
    expect(second.code).toBe(1);
    expect(parseAggregate(second.stdout)).toBe('unknown');

    const combinedLog = await requests(box);
    expect(xCreateCalls(combinedLog)).toHaveLength(1);

    const currentLedger = await ledger(box);
    const records = Object.values(currentLedger.records);
    expect(records).toHaveLength(1);
    expect(records[0]?.attempts).toHaveLength(1);
    expect(records[0]?.attempts[0]?.state).toBe('pending');
  });
});
