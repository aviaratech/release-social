import { spawn } from 'node:child_process';
import { access, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/run.js';
import type { CanonicalReleaseSource } from '../../src/index.js';

const FIXTURE_ROOT = 'examples/fictional-consumer';
const REPOSITORY = 'fictional/release-social-consumer';
const REPOSITORY_ID = 424242;
const RELEASE_ID = 515151;
const RELEASE_URL = 'https://github.com/fictional/release-social-consumer/releases/tag/v1.2.3';

function source(body: string, overrides: Partial<CanonicalReleaseSource> = {}): CanonicalReleaseSource {
  return {
    repositoryId: REPOSITORY_ID,
    repository: REPOSITORY,
    releaseId: RELEASE_ID,
    tag: 'v1.2.3',
    releaseUrl: RELEASE_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
    ...overrides,
  };
}

function githubReleaseFetch(release: CanonicalReleaseSource): typeof fetch {
  return async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url === 'https://api.github.com/repos/' + release.repository) {
      return Response.json({
        id: release.repositoryId,
        full_name: release.repository,
        private: release.visibility === 'private',
        visibility: release.visibility,
      });
    }
    if (url === 'https://api.github.com/repos/' + release.repository + '/releases/' + release.releaseId) {
      return Response.json({
        id: release.releaseId,
        tag_name: release.tag,
        html_url: release.releaseUrl,
        body: release.body,
        draft: release.draft,
        prerelease: release.prerelease,
      });
    }
    throw new Error('Unexpected mocked GitHub request: ' + url);
  };
}

function cliIo() {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    io: {
      stdout: (message: string) => stdout.push(message),
      stderr: (message: string) => stderr.push(message),
      env: { GH_TOKEN: 'synthetic-github-token' },
    },
    stdout,
    stderr,
  };
}

async function runFixture(
  releasePath: string,
  configPath: string,
  command: 'validate' | 'preview' = 'validate',
): Promise<{ exit: number; stdout: string; stderr: string }> {
  const body = await readFile(join(FIXTURE_ROOT, 'releases', releasePath), 'utf8');
  const output = cliIo();
  const exit = await runCli(
    [
      command,
      '--repository',
      REPOSITORY,
      '--release-id',
      String(RELEASE_ID),
      '--config',
      join(FIXTURE_ROOT, 'config', configPath),
    ],
    output.io,
    { fetch: githubReleaseFetch(source(body)) },
  );
  return { exit, stdout: output.stdout.join('\n'), stderr: output.stderr.join('\n') };
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

async function builtCliExists(): Promise<boolean> {
  try {
    await access('dist/cli/bin.js');
    return true;
  } catch {
    return false;
  }
}

async function createFetchPreload(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'release-social-docs-preload-'));
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
    "  throw new Error('Unexpected packaged CLI request: ' + url);",
    '};',
    '',
  ].join('\n');
  await writeFile(path, moduleText, 'utf8');
  return path;
}

async function runBuiltFixture(
  preload: string,
  releasePath: string,
  configPath: string,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const body = await readFile(join(FIXTURE_ROOT, 'releases', releasePath), 'utf8');
  return await runNode(
    [
      '--import',
      preload,
      'dist/cli/bin.js',
      'validate',
      '--repository',
      REPOSITORY,
      '--release-id',
      String(RELEASE_ID),
      '--config',
      join(FIXTURE_ROOT, 'config', configPath),
    ],
    {
      ...process.env,
      GH_TOKEN: 'synthetic-github-token',
      MOCK_REPOSITORY: REPOSITORY,
      MOCK_RELEASE_ID: String(RELEASE_ID),
      MOCK_RELEASE_BODY_B64: Buffer.from(body, 'utf8').toString('base64'),
    },
  );
}

describe('documented consumer fixtures', () => {
  it('validates X-only, LinkedIn-only, both, and corrected configs with authored and generated notes', async () => {
    const validPairs = [
      ['authored-final.md', 'x.json'],
      ['authored-final.md', 'linkedin.json'],
      ['authored-final.md', 'both.json'],
      ['authored-final.md', 'missing-error.json'],
      ['authored-final.md', 'missing-skip.json'],
      ['authored-final.md', 'corrected-linkedin.json'],
      ['generated.md', 'x.json'],
      ['generated.md', 'linkedin.json'],
      ['generated.md', 'both.json'],
      ['empty.md', 'both.json'],
      ['opted-out-generated.md', 'both.json'],
    ] as const;

    for (const [releasePath, configPath] of validPairs) {
      const result = await runFixture(releasePath, configPath);
      expect(result.exit, releasePath + ' + ' + configPath + ': ' + result.stderr).toBe(0);
    }
  });

  it('exercises all missing-authored modes and the malformed-vs-absent distinction', async () => {
    const fallback = await runFixture('generated.md', 'both.json', 'preview');
    expect(fallback.exit).toBe(0);
    expect(fallback.stdout).toContain('"contentSource": "github-release-notes"');

    const strict = await runFixture('generated.md', 'missing-error.json');
    expect(strict.exit).toBe(1);
    expect(strict.stderr).toContain('authored release-social sections are absent');

    const skipped = await runFixture('generated.md', 'missing-skip.json', 'preview');
    expect(skipped.exit).toBe(0);
    expect(skipped.stdout).toContain('"reason": "authored_content_missing"');

    const malformed = await runFixture('malformed-authored.md', 'both.json');
    expect(malformed.exit).toBe(1);
    expect(malformed.stderr).toContain('must contain exactly one announcement:start and announcement:end marker');
  });

  it('keeps invalid documented configuration invalid with the expected diagnostic', async () => {
    const result = await runFixture('generated.md', 'invalid-provider.json');
    expect(result.exit).toBe(1);
    expect(result.stderr).toContain('unsupported field(s): threads');
  });

  it('validates every documented fixture through the built packaged CLI after build', async () => {
    if (!(await builtCliExists())) return;

    const preload = await createFetchPreload();
    const validPairs = [
      ['authored-final.md', 'x.json'],
      ['authored-final.md', 'linkedin.json'],
      ['authored-final.md', 'both.json'],
      ['authored-final.md', 'missing-error.json'],
      ['authored-final.md', 'missing-skip.json'],
      ['authored-final.md', 'corrected-linkedin.json'],
      ['generated.md', 'x.json'],
      ['generated.md', 'linkedin.json'],
      ['generated.md', 'both.json'],
      ['empty.md', 'both.json'],
      ['opted-out-generated.md', 'both.json'],
      ['generated.md', 'missing-skip.json'],
    ] as const;

    for (const [releasePath, configPath] of validPairs) {
      const result = await runBuiltFixture(preload, releasePath, configPath);
      expect(result.code, releasePath + ' + ' + configPath + ': ' + result.stderr).toBe(0);
    }

    const strict = await runBuiltFixture(preload, 'generated.md', 'missing-error.json');
    expect(strict.code).toBe(1);
    expect(strict.stderr).toContain('authored release-social sections are absent');

    const malformed = await runBuiltFixture(preload, 'malformed-authored.md', 'both.json');
    expect(malformed.code).toBe(1);
    expect(malformed.stderr).toContain('must contain exactly one announcement:start and announcement:end marker');

    const invalid = await runBuiltFixture(preload, 'generated.md', 'invalid-provider.json');
    expect(invalid.code).toBe(1);
    expect(invalid.stderr).toContain('unsupported field(s): threads');
  });
});
