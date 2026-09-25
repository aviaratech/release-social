import { access, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

import { describe, expect, it } from 'vitest';

function runNode(
  args: readonly string[],
  env: NodeJS.ProcessEnv = process.env,
): Promise<{
  code: number | null;
  stdout: string;
  stderr: string;
}> {
  return new Promise((resolve, reject) => {
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
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

describe('packaged entrypoints', () => {
  it('packages the CLI bin and committed Node 24 Action bundle', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      bin?: Record<string, string>;
      files?: string[];
    };
    expect(packageJson.bin?.['release-social']).toBe('./dist/cli/bin.js');
    expect(packageJson.files).toContain('action-dist');
    expect(packageJson.files).toContain('action.yml');
    await expect(access('action-dist/index.cjs')).resolves.toBeUndefined();
  });

  it('runs the built CLI when dist is present and always executes the committed Action bundle', async () => {
    let built = true;
    try {
      await access('dist/cli/bin.js');
    } catch {
      built = false;
    }

    if (built) {
      const cli = await runNode(['dist/cli/bin.js', '--help']);
      expect(cli.code).toBe(0);
      expect(cli.stdout).toContain('release-social commands:');
      expect(cli.stdout).toContain('publish');
    }

    const action = await runNode(['action-dist/index.cjs'], {
      ...process.env,
      INPUT_MODE: 'invalid',
    });
    expect(action.code).toBe(1);
    expect(action.stderr).toContain('mode must be preview or publish');
  });
});
