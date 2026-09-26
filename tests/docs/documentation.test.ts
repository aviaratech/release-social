import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/run.js';

function cliHelp(): Promise<string> {
  const stdout: string[] = [];
  return runCli(
    ['--help'],
    {
      stdout: (value) => stdout.push(value),
      stderr: () => undefined,
      env: {},
    },
  ).then((exit) => {
    if (exit !== 0) throw new Error('CLI help failed.');
    return stdout.join('\n');
  });
}

describe('documentation contract', () => {
  it('keeps the README status, tracking, and outstanding-live-evidence boundary explicit', async () => {
    const readme = await readFile('README.md', 'utf8');
    expect(readme).toContain('X');
    expect(readme).toContain('personal LinkedIn profiles');
    expect(readme).toContain('https://github.com/aviaratech/release-social/issues/1');
    expect(readme).toContain('https://github.com/aviaratech/release-social/milestone/1');
    expect(readme).toContain('Live validation still outstanding');
    expect(readme).toContain('does **not** publish npm');
  });

  it('shows the exact checked-in authored template and canonical agent evidence rules', async () => {
    const template = (await readFile('templates/release-notes.md', 'utf8')).trim();
    const authoring = await readFile('docs/release-authoring.md', 'utf8');
    expect(authoring).toContain(template);
    expect(authoring).toContain('Make no claim that is not supported by that evidence.');
    expect(authoring).toContain('Do not regenerate or rewrite the Release body during social publication.');
    expect(authoring).toContain('social:x');
    expect(authoring).toContain('social:linkedin');
    expect(authoring).toContain('social:skip');
  });

  it('keeps documented CLI setup and recovery commands aligned with actual help', async () => {
    const help = await cliHelp();
    const entrypoints = await readFile('docs/entrypoints.md', 'utf8');
    const adoption = await readFile('docs/adoption.md', 'utf8');

    for (const command of ['validate', 'preview', 'publish', 'state-init', 'reconcile', 'revise']) {
      expect(help).toContain(command);
      expect(entrypoints).toContain(command);
      expect(adoption).toContain(command);
    }

    for (const option of [
      '--repository',
      '--release-id',
      '--config',
      '--record-key',
      '--attempt-number',
      '--attempt-id',
      '--resolution',
      '--provider-id',
      '--url',
      '--cli-settled',
      '--destination',
      '--old-digest',
    ]) {
      if (help.includes(option)) {
        expect(adoption).toContain(option);
      }
    }

    expect(adoption).toContain('--resolution published');
    expect(adoption).toContain('--resolution non-creation');
    expect(adoption).toContain('--destination linkedin');
  });

  it('keeps Action inputs, runtime, permissions, and fictional workflow guidance aligned', async () => {
    const action = await readFile('action.yml', 'utf8');
    const entrypoints = await readFile('docs/entrypoints.md', 'utf8');
    const adoption = await readFile('docs/adoption.md', 'utf8');
    const workflow = await readFile('examples/fictional-consumer/release-and-social.yml', 'utf8');
    const fixtureReadme = await readFile('examples/fictional-consumer/README.md', 'utf8');

    expect(action).toContain('using: node24');
    for (const input of ['mode:', 'repository:', 'release-id:', 'config-path:', 'token:']) {
      expect(action).toContain(input);
    }
    for (const input of ['mode', 'repository', 'release-id', 'config-path', 'token']) {
      expect(entrypoints).toContain(input);
    }

    expect(workflow).toContain('FICTIONAL');
    expect(workflow).toContain('fictional/release-social-consumer');
    expect(workflow).toContain('cancel-in-progress: false');
    expect(workflow).toContain('contents: write');
    expect(workflow).toContain('actions: read');
    expect(workflow).toContain('REPLACE_WITH_REVIEWED_FULL_40_CHAR_COMMIT_SHA');
    expect(workflow).not.toContain('pull_request_target');
    expect(fixtureReadme).toContain('Everything under this directory is fictional.');
    expect(fixtureReadme).toContain('force:false');
    expect(fixtureReadme).toContain('immutable');
    expect(adoption).toContain('contents:read');
    expect(adoption).toContain('contents:write');
    expect(adoption).toContain('actions:read');
  });

  it('documents provider-owned credentials and current setup boundaries without claiming live proof', async () => {
    const x = await readFile('docs/providers/x.md', 'utf8');
    const linkedin = await readFile('docs/providers/linkedin.md', 'utf8');
    const adoption = await readFile('docs/adoption.md', 'utf8');
    const live = await readFile('docs/live-acceptance.md', 'utf8');

    for (const name of ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET']) {
      expect(x).toContain(name);
      expect(adoption).toContain(name);
    }
    expect(x).toContain('https://docs.x.com/x-api/getting-started/pricing');

    expect(linkedin).toContain('LINKEDIN_ACCESS_TOKEN');
    expect(linkedin).toContain('w_member_social');
    expect(linkedin).toContain('self-service');
    expect(linkedin).toContain('60-day');
    expect(linkedin).toContain('Programmatic refresh tokens are **not assumed**');
    expect(linkedin).toContain(
      'https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin',
    );

    expect(live).toContain('Exact X account ID');
    expect(live).toContain('Exact X text including final release URL');
    expect(live).toContain('Exact LinkedIn author URN');
    expect(live).toContain('Exact LinkedIn text including final release URL');
    expect(live).toContain('not performed by repository CI');
  });

  it('records the initial release checklist without performing release mutations', async () => {
    const checklist = await readFile('docs/release-checklist.md', 'utf8');
    expect(checklist).toContain('must not publish npm');
    expect(checklist).toContain('npm run check:action-bundle');
    expect(checklist).toContain('npm pack --dry-run');
    expect(checklist).toContain('full 40-character commit SHA');
    expect(checklist).toContain('credential-free');
    expect(checklist).toContain('non-force fast-forward');
  });
});
