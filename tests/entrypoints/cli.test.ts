import { access, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/run.js';
import { ENTRY_RELEASE_ID, ENTRY_REPOSITORY, entrySource, generatedBody, githubReleaseFetch, xConfig } from './helpers.js';

function io(env: NodeJS.ProcessEnv = { GH_TOKEN: 'synthetic-github-token' }) {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    value: {
      stdout: (message: string) => stdout.push(message),
      stderr: (message: string) => stderr.push(message),
      env,
    },
    stdout,
    stderr,
  };
}

describe('CLI entrypoint', () => {
  it('exposes validate/preview/publish/state/reconcile/revise commands through help', async () => {
    const output = io({});
    expect(await runCli(['--help'], output.value)).toBe(0);
    const text = output.stdout.join('\n');
    for (const command of ['validate', 'preview', 'publish', 'state-init', 'reconcile', 'revise']) {
      expect(text).toContain(command);
    }
  });

  it('previews exact final text without social secrets or provider calls', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'release-social-cli-'));
    const configPath = join(directory, 'release-social.json');
    await writeFile(configPath, JSON.stringify(xConfig()), 'utf8');

    const source = entrySource(generatedBody('safe'));
    const output = io({ GH_TOKEN: 'synthetic-github-token' });
    const exit = await runCli(
      [
        'preview',
        '--repository',
        ENTRY_REPOSITORY,
        '--release-id',
        String(ENTRY_RELEASE_ID),
        '--config',
        configPath,
      ],
      output.value,
      { fetch: githubReleaseFetch(source) },
    );

    expect(exit).toBe(0);
    const result = JSON.parse(output.stdout.at(-1) ?? '{}') as {
      status?: string;
      destinations?: Array<{ text: string; account: string; contentSource: string }>;
    };
    expect(result.status).toBe('ready');
    expect(result.destinations?.[0]?.text.endsWith('\n\n' + source.releaseUrl)).toBe(true);
    expect(result.destinations?.[0]?.account).toBe('123456789012345678');
    expect(result.destinations?.[0]?.contentSource).toBe('github-release-notes');
    expect(output.stderr).toEqual([]);
  });

  it('rejects invalid provider selection instead of silently skipping it', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'release-social-cli-invalid-'));
    const configPath = join(directory, 'release-social.json');
    await writeFile(
      configPath,
      JSON.stringify({ version: 1, destinations: { threads: { account: 'fictional' } } }),
      'utf8',
    );
    const output = io({ GH_TOKEN: 'synthetic-github-token' });
    const exit = await runCli(
      [
        'preview',
        '--repository',
        ENTRY_REPOSITORY,
        '--release-id',
        String(ENTRY_RELEASE_ID),
        '--config',
        configPath,
      ],
      output.value,
      { fetch: githubReleaseFetch(entrySource(generatedBody())) },
    );

    expect(exit).toBe(1);
    expect(output.stderr.join('\n')).toContain('unsupported field');
  });

  it('treats malicious release/config text as inert data and never executes shell syntax', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'release-social-cli-shell-'));
    const marker = join(directory, 'SHOULD_NOT_EXIST');
    const payload = `$(touch ${marker}) ; echo $GH_TOKEN`;
    const configPath = join(directory, 'release-social.json');
    await writeFile(configPath, JSON.stringify(xConfig()), 'utf8');

    const output = io({ GH_TOKEN: 'synthetic-github-token', X_API_SECRET: 'MUST_NOT_LEAK' });
    const exit = await runCli(
      [
        'preview',
        '--repository',
        ENTRY_REPOSITORY,
        '--release-id',
        String(ENTRY_RELEASE_ID),
        '--config',
        configPath,
      ],
      output.value,
      { fetch: githubReleaseFetch(entrySource(generatedBody(payload))) },
    );

    expect(exit).toBe(0);
    await expect(access(marker)).rejects.toThrow();
    expect(output.stdout.join('\n')).not.toContain('MUST_NOT_LEAK');
    expect(output.stderr.join('\n')).not.toContain('MUST_NOT_LEAK');
  });
});
