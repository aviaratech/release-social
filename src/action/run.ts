import { appendFile, readFile, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';

import { GitHubReleaseReader } from '../github/releases.js';
import { actionExecution, prepareRelease, publishPrepared } from '../cli/application.js';

const MAX_OUTPUT = 12_000;

function input(name: string, required = false): string {
  const envName = `INPUT_${name.replaceAll('-', '_').toUpperCase()}`;
  const value = process.env[envName]?.trim() ?? '';
  if (required && value === '') throw new Error(`Action input ${name} is required.`);
  return value;
}

function positiveInteger(value: string, name: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`Action input ${name} must be a positive integer.`);
  return parsed;
}

async function trustedConfigPath(configPath: string): Promise<string> {
  const workspace = process.env.GITHUB_WORKSPACE;
  if (!workspace) throw new Error('GITHUB_WORKSPACE is required.');
  if (isAbsolute(configPath)) throw new Error('config-path must be repository-relative.');

  const workspaceReal = await realpath(workspace);
  const candidate = resolve(workspaceReal, configPath);
  const candidateReal = await realpath(candidate);
  const rel = relative(workspaceReal, candidateReal);
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error('config-path must resolve to a file inside GITHUB_WORKSPACE.');
  }
  return candidateReal;
}

async function readConfig(configPath: string): Promise<unknown> {
  const path = await trustedConfigPath(configPath);
  const text = await readFile(path, 'utf8');
  if (text.length > 1_000_000) throw new Error('Configuration file is too large.');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Configuration file is not valid JSON.');
  }
}

function bounded(value: unknown): string {
  const json = JSON.stringify(value);
  if (json.length <= MAX_OUTPUT) return json;
  return JSON.stringify({ error: 'output_truncated', preview: json.slice(0, MAX_OUTPUT) });
}

async function setOutput(name: string, value: unknown): Promise<void> {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  await appendFile(outputPath, `${name}=${bounded(value)}\n`, 'utf8');
}

function previewValue(prepared: ReturnType<typeof prepareRelease>): unknown {
  if (prepared.status === 'skipped') return { status: 'skipped', reason: prepared.skipReason };
  return {
    status: 'ready',
    destinations: prepared.destinations.map((item) => ({
      destination: item.destination,
      account: item.account,
      text: item.text,
      digest: item.digest,
      contentSource: item.contentSource,
      diagnostics: item.diagnostics,
      validation: item.validation,
    })),
  };
}

export async function runAction(): Promise<number> {
  try {
    const mode = input('mode') || 'preview';
    if (mode !== 'preview' && mode !== 'publish') throw new Error('mode must be preview or publish.');

    const repository = input('repository', true);
    const releaseId = positiveInteger(input('release-id', true), 'release-id');
    const configPath = input('config-path', true);
    const token = input('token', true);
    const config = await readConfig(configPath);
    const source = await new GitHubReleaseReader({ token }).read({ repository, releaseId });
    const prepared = prepareRelease(source, config);

    if (mode === 'preview') {
      const result = previewValue(prepared);
      await setOutput('result', result);
      await setOutput('aggregate', prepared.status === 'skipped' ? 'skipped' : 'success');
      process.stdout.write(bounded(result) + '\n');
      return prepared.status === 'ready' && prepared.destinations.some((item) => !item.validation.ok) ? 1 : 0;
    }

    const runId = positiveInteger(process.env.GITHUB_RUN_ID ?? '', 'GITHUB_RUN_ID');
    const result = await publishPrepared({
      source,
      config,
      repository,
      githubToken: token,
      execution: actionExecution(repository, runId),
      env: process.env,
    });
    const output = {
      aggregate: result.aggregate,
      destinations: result.publications ?? [],
    };
    await setOutput('result', output);
    await setOutput('aggregate', result.aggregate);
    process.stdout.write(bounded(output) + '\n');
    return result.aggregate === 'success' || result.aggregate === 'skipped' ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown action failure.';
    const output = { error: message.slice(0, 1000) };
    await setOutput('result', output);
    await setOutput('aggregate', 'failed');
    process.stderr.write(bounded(output) + '\n');
    return 1;
  }
}
