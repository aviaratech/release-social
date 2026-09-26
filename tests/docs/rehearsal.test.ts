import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { cliExecution, prepareRelease, publishPrepared, reconcileAttempt } from '../../src/cli/application.js';
import { recordKeyForPlan } from '../../src/publishing/ledger.js';
import type { CanonicalReleaseSource } from '../../src/index.js';
import { FakeProvider, FakeQuiescenceVerifier, MemoryStateRepository } from '../publishing/helpers.js';

const ROOT = 'examples/fictional-consumer';
const REPOSITORY = 'fictional/release-social-consumer';
const RELEASE_ID = 515151;
const RELEASE_URL = 'https://github.com/fictional/release-social-consumer/releases/tag/v1.2.3';

function source(body: string): CanonicalReleaseSource {
  return {
    repositoryId: 424242,
    repository: REPOSITORY,
    releaseId: RELEASE_ID,
    tag: 'v1.2.3',
    releaseUrl: RELEASE_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
  };
}

function runNode(
  args: readonly string[],
  env: NodeJS.ProcessEnv,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [...args], { env, stdio: ['ignore', 'pipe', 'pipe'] });
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
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function createFetchPreload(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'release-social-docs-action-preload-'));
  const path = join(directory, 'mock-fetch.mjs');
  const moduleText = [
    'const repository = process.env.MOCK_REPOSITORY;',
    'const releaseId = Number(process.env.MOCK_RELEASE_ID);',
    "const body = Buffer.from(process.env.MOCK_RELEASE_BODY_B64 || '', 'base64').toString('utf8');",
    'globalThis.fetch = async (input) => {',
    "  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;",
    "  if (url === 'https://api.github.com/repos/' + repository) {",
    "    return Response.json({ id: 424242, full_name: repository, private: false, visibility: 'public' });",
    '  }',
    "  if (url === 'https://api.github.com/repos/' + repository + '/releases/' + releaseId) {",
    '    return Response.json({',
    '      id: releaseId,',
    "      tag_name: 'v1.2.3',",
    "      html_url: 'https://github.com/' + repository + '/releases/tag/v1.2.3',",
    '      body,',
    '      draft: false,',
    '      prerelease: false,',
    '    });',
    '  }',
    "  throw new Error('Unexpected bundled Action request: ' + url);",
    '};',
    '',
  ].join('\n');
  await writeFile(path, moduleText, 'utf8');
  return path;
}

describe('fictional consumer rehearsal', () => {
  it('publishes authored content through mocked providers, preserves partial success, and retries only the failed destination', async () => {
    const body = await readFile(join(ROOT, 'releases/authored-final.md'), 'utf8');
    const config = JSON.parse(await readFile(join(ROOT, 'config/both.json'), 'utf8')) as unknown;
    const state = new MemoryStateRepository();

    const firstX = new FakeProvider({ destination: 'x' });
    const firstLinkedIn = new FakeProvider({
      destination: 'linkedin',
      publications: [{ status: 'rejected', reason: 'synthetic rejection', retryClassification: 'retryable' }],
    });

    const first = await publishPrepared({
      source: source(body),
      config,
      repository: REPOSITORY,
      githubToken: 'synthetic-github-token',
      execution: cliExecution('71000000-0000-4000-8000-000000000001'),
      state,
      bindings: [firstX, firstLinkedIn],
    });

    expect(first.aggregate).toBe('partial');
    expect(first.publications?.map((item) => item.status)).toEqual(['published', 'rejected']);

    const retryX = new FakeProvider({ destination: 'x' });
    const retryLinkedIn = new FakeProvider({ destination: 'linkedin' });
    const retry = await publishPrepared({
      source: source(body),
      config,
      repository: REPOSITORY,
      githubToken: 'synthetic-github-token',
      execution: cliExecution('71000000-0000-4000-8000-000000000002'),
      state,
      bindings: [retryX, retryLinkedIn],
    });

    expect(retry.aggregate).toBe('success');
    expect(retry.publications?.map((item) => item.status)).toEqual(['already_published', 'published']);
    expect(retryX.publishCount).toBe(0);
    expect(retryLinkedIn.publishCount).toBe(1);
  });

  it('stops an ambiguous generated-note attempt and requires exact quiescent reconciliation', async () => {
    const body = await readFile(join(ROOT, 'releases/generated.md'), 'utf8');
    const config = JSON.parse(await readFile(join(ROOT, 'config/x.json'), 'utf8')) as unknown;
    const prepared = prepareRelease(source(body), config);
    expect(prepared.status).toBe('ready');
    const plan = prepared.plans[0];
    if (plan === undefined) throw new Error('Missing fictional X plan.');

    const state = new MemoryStateRepository();
    const result = await publishPrepared({
      source: source(body),
      config,
      repository: REPOSITORY,
      githubToken: 'synthetic-github-token',
      execution: cliExecution('72000000-0000-4000-8000-000000000001'),
      state,
      bindings: [new FakeProvider({ destination: 'x', publications: [new Error('synthetic ambiguous transport')] })],
    });

    expect(result.aggregate).toBe('unknown');

    const record = (await state.read()).records[recordKeyForPlan(plan)];
    const attempt = record?.attempts[0];
    if (record === undefined || attempt === undefined) throw new Error('Missing fictional uncertain attempt.');

    const verifier = new FakeQuiescenceVerifier();
    await expect(
      reconcileAttempt({
        repository: REPOSITORY,
        githubToken: 'synthetic-github-token',
        recordKey: record.key,
        attemptNumber: attempt.attemptNumber,
        attemptId: attempt.attemptId,
        resolution: 'non-creation',
        cliSettled: false,
        state,
        verifier,
      }),
    ).rejects.toMatchObject({ code: 'execution_not_quiescent' });

    await reconcileAttempt({
      repository: REPOSITORY,
      githubToken: 'synthetic-github-token',
      recordKey: record.key,
      attemptNumber: attempt.attemptNumber,
      attemptId: attempt.attemptId,
      resolution: 'non-creation',
      cliSettled: true,
      state,
      verifier,
    });

    expect((await state.read()).records[record.key]?.attempts[0]?.state).toBe('rejected');
  });

  it('runs the committed bundled Action in default preview mode against the fictional generated-note fixture', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'release-social-docs-action-'));
    const config = await readFile(join(ROOT, 'config/both.json'), 'utf8');
    const body = await readFile(join(ROOT, 'releases/generated.md'), 'utf8');
    await writeFile(join(workspace, 'release-social.json'), config, 'utf8');
    const preload = await createFetchPreload();

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      GITHUB_WORKSPACE: workspace,
      INPUT_REPOSITORY: REPOSITORY,
      INPUT_RELEASE_ID: String(RELEASE_ID),
      INPUT_CONFIG_PATH: 'release-social.json',
      INPUT_TOKEN: 'synthetic-github-token',
      MOCK_REPOSITORY: REPOSITORY,
      MOCK_RELEASE_ID: String(RELEASE_ID),
      MOCK_RELEASE_BODY_B64: Buffer.from(body, 'utf8').toString('base64'),
    };
    delete env.INPUT_MODE;
    delete env.X_API_KEY;
    delete env.X_API_SECRET;
    delete env.X_ACCESS_TOKEN;
    delete env.X_ACCESS_TOKEN_SECRET;
    delete env.LINKEDIN_ACCESS_TOKEN;

    const action = await runNode(['--import', preload, 'action-dist/index.cjs'], env);
    expect(action.code, action.stderr).toBe(0);
    expect(action.stdout).toContain('github-release-notes');
    expect(action.stdout).toContain('123456789012345678');
    expect(action.stdout).toContain('urn:li:person:FictionalMember123');
    expect(action.stdout).not.toContain('synthetic-github-token');
  });
});
