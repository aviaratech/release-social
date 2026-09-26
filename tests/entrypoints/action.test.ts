import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runAction } from '../../src/action/run.js';
import {
  ENTRY_RELEASE_ID,
  ENTRY_REPOSITORY,
  entrySource,
  generatedBody,
  githubReleaseFetch,
  xConfig,
} from './helpers.js';

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = globalThis.fetch;

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  globalThis.fetch = ORIGINAL_FETCH;
});

describe('GitHub Action entrypoint', () => {
  it('defaults to preview, reads only trusted checked-out config, and needs no provider secrets', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'release-social-action-'));
    const configPath = join(workspace, 'release-social.json');
    const outputPath = join(workspace, 'github-output.txt');
    await writeFile(configPath, JSON.stringify(xConfig()), 'utf8');
    await writeFile(outputPath, '', 'utf8');

    const source = entrySource(generatedBody('Action preview.'));
    globalThis.fetch = githubReleaseFetch(source);
    process.env = {
      ...ORIGINAL_ENV,
      GITHUB_WORKSPACE: workspace,
      GITHUB_OUTPUT: outputPath,
      INPUT_REPOSITORY: ENTRY_REPOSITORY,
      'INPUT_RELEASE-ID': String(ENTRY_RELEASE_ID),
      'INPUT_CONFIG-PATH': 'release-social.json',
      INPUT_TOKEN: 'synthetic-github-token',
      GITHUB_RUN_ID: '123',
    };
    delete process.env.INPUT_MODE;
    delete process.env.X_API_KEY;
    delete process.env.X_API_SECRET;
    delete process.env.X_ACCESS_TOKEN;
    delete process.env.X_ACCESS_TOKEN_SECRET;

    expect(await runAction()).toBe(0);

    const output = await readFile(outputPath, 'utf8');
    expect(output).toContain('aggregate=success');
    expect(output).toContain('github-release-notes');
    expect(output).toContain('123456789012345678');
    expect(output).not.toContain('synthetic-github-token');
  });

  it('resolves centralized X and LinkedIn identities during preview without provider secrets', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'release-social-action-identities-'));
    const configPath = join(workspace, 'release-social.json');
    const outputPath = join(workspace, 'github-output.txt');
    await writeFile(
      configPath,
      JSON.stringify({
        version: 1,
        destinations: {
          x: {},
          linkedin: { apiVersion: '202609' },
        },
      }),
      'utf8',
    );
    await writeFile(outputPath, '', 'utf8');

    globalThis.fetch = githubReleaseFetch(entrySource(generatedBody('central identities')));
    process.env = {
      ...ORIGINAL_ENV,
      GITHUB_WORKSPACE: workspace,
      GITHUB_OUTPUT: outputPath,
      INPUT_REPOSITORY: ENTRY_REPOSITORY,
      'INPUT_RELEASE-ID': String(ENTRY_RELEASE_ID),
      'INPUT_CONFIG-PATH': 'release-social.json',
      INPUT_TOKEN: 'synthetic-github-token',
      GITHUB_RUN_ID: '123',
      X_ACCOUNT_ID: '123456789012345678',
      LINKEDIN_AUTHOR: 'urn:li:person:FictionalPerson123',
    };
    delete process.env.INPUT_MODE;
    delete process.env.X_API_KEY;
    delete process.env.X_API_SECRET;
    delete process.env.X_ACCESS_TOKEN;
    delete process.env.X_ACCESS_TOKEN_SECRET;
    delete process.env.LINKEDIN_ACCESS_TOKEN;

    expect(await runAction()).toBe(0);

    const output = await readFile(outputPath, 'utf8');
    expect(output).toContain('123456789012345678');
    expect(output).toContain('urn:li:person:FictionalPerson123');
    expect(output).not.toContain('synthetic-github-token');
  });

  it('rejects config paths that escape the checked-out trusted workspace', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'release-social-action-path-'));
    process.env = {
      ...ORIGINAL_ENV,
      GITHUB_WORKSPACE: workspace,
      INPUT_REPOSITORY: ENTRY_REPOSITORY,
      'INPUT_RELEASE-ID': String(ENTRY_RELEASE_ID),
      'INPUT_CONFIG-PATH': '../untrusted.json',
      INPUT_TOKEN: 'synthetic-github-token',
    };
    globalThis.fetch = githubReleaseFetch(entrySource(generatedBody()));

    expect(await runAction()).toBe(1);
  });

  it('skips an ineligible release without provider credentials or state writes', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'release-social-action-skip-'));
    const configPath = join(workspace, 'release-social.json');
    const outputPath = join(workspace, 'github-output.txt');
    await writeFile(configPath, JSON.stringify(xConfig()), 'utf8');
    await writeFile(outputPath, '', 'utf8');

    const source = entrySource(generatedBody(), { prerelease: true });
    globalThis.fetch = githubReleaseFetch(source);
    process.env = {
      ...ORIGINAL_ENV,
      GITHUB_WORKSPACE: workspace,
      GITHUB_OUTPUT: outputPath,
      INPUT_REPOSITORY: ENTRY_REPOSITORY,
      'INPUT_RELEASE-ID': String(ENTRY_RELEASE_ID),
      'INPUT_CONFIG-PATH': 'release-social.json',
      INPUT_TOKEN: 'synthetic-github-token',
      INPUT_MODE: 'preview',
    };

    expect(await runAction()).toBe(0);
    expect(await readFile(outputPath, 'utf8')).toContain('prerelease_release');
  });

  it('refuses implicit live mode and requires publish to be explicit', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'release-social-action-mode-'));
    await writeFile(join(workspace, 'release-social.json'), JSON.stringify(xConfig()), 'utf8');
    process.env = {
      ...ORIGINAL_ENV,
      GITHUB_WORKSPACE: workspace,
      INPUT_REPOSITORY: ENTRY_REPOSITORY,
      'INPUT_RELEASE-ID': String(ENTRY_RELEASE_ID),
      'INPUT_CONFIG-PATH': 'release-social.json',
      INPUT_TOKEN: 'synthetic-github-token',
      INPUT_MODE: 'live',
    };
    globalThis.fetch = githubReleaseFetch(entrySource(generatedBody()));

    expect(await runAction()).toBe(1);
  });
});
