import { readFile } from 'node:fs/promises';

import { GitHubReleaseReader } from '../github/releases.js';
import {
  cliExecution,
  initializePublishingState,
  prepareRelease,
  publishPrepared,
  reconcileAttempt,
  reviseAttempt,
  type EntryResult,
  type PreparedRelease,
} from './application.js';

const MAX_OUTPUT_TEXT = 12_000;

export interface CliIo {
  stdout(value: string): void;
  stderr(value: string): void;
  env: NodeJS.ProcessEnv;
}

export interface CliServices {
  fetch?: typeof fetch;
}

interface ParsedArgs {
  command: string;
  values: Map<string, string>;
  flags: Set<string>;
}

function parseArgs(argv: readonly string[]): ParsedArgs {
  const [command, ...rest] = argv;
  if (!command || command.startsWith('-')) throw new Error('A command is required.');

  const values = new Map<string, string>();
  const flags = new Set<string>();

  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index];
    if (!item?.startsWith('--')) throw new Error(`Unexpected positional argument: ${item ?? ''}`);
    const key = item.slice(2);
    if (key === '') throw new Error('Empty option name.');

    const next = rest[index + 1];
    if (next !== undefined && !next.startsWith('--')) {
      if (values.has(key) || flags.has(key)) throw new Error(`Duplicate option --${key}.`);
      values.set(key, next);
      index += 1;
    } else {
      if (values.has(key) || flags.has(key)) throw new Error(`Duplicate option --${key}.`);
      flags.add(key);
    }
  }

  return { command, values, flags };
}

function required(args: ParsedArgs, name: string): string {
  const value = args.values.get(name);
  if (!value) throw new Error(`Missing required --${name}.`);
  return value;
}

function optional(args: ParsedArgs, name: string): string | undefined {
  return args.values.get(name);
}

function integer(value: string, name: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`--${name} must be a positive integer.`);
  return parsed;
}

function githubToken(io: CliIo): string {
  const token = io.env.GH_TOKEN;
  if (!token) throw new Error('GH_TOKEN is required for GitHub API operations.');
  return token;
}

async function readConfig(path: string): Promise<unknown> {
  const text = await readFile(path, 'utf8');
  if (text.length > 1_000_000) throw new Error('Configuration file is too large.');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Configuration file is not valid JSON.');
  }
}

function bounded(value: unknown): string {
  const serialized = JSON.stringify(value, null, 2);
  return serialized.length <= MAX_OUTPUT_TEXT
    ? serialized
    : JSON.stringify({ error: 'output_truncated', preview: serialized.slice(0, MAX_OUTPUT_TEXT) }, null, 2);
}

function previewOutput(prepared: PreparedRelease): unknown {
  if (prepared.status === 'skipped') {
    return { status: 'skipped', reason: prepared.skipReason };
  }
  return {
    status: 'ready',
    destinations: prepared.destinations.map((destination) => ({
      destination: destination.destination,
      account: destination.account,
      text: destination.text,
      digest: destination.digest,
      contentSource: destination.contentSource,
      diagnostics: destination.diagnostics,
      validation: destination.validation,
    })),
  };
}

function publicationOutput(result: EntryResult): unknown {
  return {
    aggregate: result.aggregate,
    preview: previewOutput(result.prepared),
    publications: result.publications?.map((item) => ({
      destination: item.destination,
      status: item.status,
      ...(item.postId === undefined ? {} : { postId: item.postId }),
      ...(item.postUrl === undefined ? {} : { postUrl: item.postUrl }),
      ...(item.attemptNumber === undefined ? {} : { attemptNumber: item.attemptNumber }),
      ...(item.attemptId === undefined ? {} : { attemptId: item.attemptId }),
      events: item.events,
    })),
  };
}

async function loadPrepared(args: ParsedArgs, io: CliIo, services: CliServices) {
  const repository = required(args, 'repository');
  const releaseId = integer(required(args, 'release-id'), 'release-id');
  const config = await readConfig(required(args, 'config'));
  const source = await new GitHubReleaseReader({
    token: githubToken(io),
    ...(services.fetch === undefined ? {} : { fetch: services.fetch }),
  }).read({
    repository,
    releaseId,
  });
  return { repository, source, config, prepared: prepareRelease(source, config) };
}

const HELP = `release-social commands:
  validate --repository OWNER/REPO --release-id ID --config FILE
  preview --repository OWNER/REPO --release-id ID --config FILE
  publish --repository OWNER/REPO --release-id ID --config FILE
  state-init --repository OWNER/REPO
  reconcile --repository OWNER/REPO --record-key KEY --attempt-number N --attempt-id UUID --resolution published|non-creation [--provider-id ID --url URL] [--cli-settled]
  revise --repository OWNER/REPO --release-id ID --config FILE --destination x|linkedin --record-key KEY --attempt-number N --attempt-id UUID --old-digest SHA256
`;

export async function runCli(
  argv: readonly string[],
  io: CliIo = {
    stdout: (value) => process.stdout.write(value + '\n'),
    stderr: (value) => process.stderr.write(value + '\n'),
    env: process.env,
  },
  services: CliServices = {},
): Promise<number> {
  try {
    if (argv.length === 0 || argv.includes('--help') || argv[0] === 'help') {
      io.stdout(HELP.trimEnd());
      return 0;
    }

    const args = parseArgs(argv);

    if (args.command === 'validate' || args.command === 'preview') {
      const loaded = await loadPrepared(args, io, services);
      const output = previewOutput(loaded.prepared);
      io.stdout(bounded(output));
      if (loaded.prepared.status === 'skipped') return 0;
      return loaded.prepared.destinations.every((destination) => destination.validation.ok) ? 0 : 1;
    }

    if (args.command === 'publish') {
      const loaded = await loadPrepared(args, io, services);
      const result = await publishPrepared({
        source: loaded.source,
        config: loaded.config,
        repository: loaded.repository,
        githubToken: githubToken(io),
        execution: cliExecution(),
        env: io.env,
        ...(services.fetch === undefined ? {} : { fetch: services.fetch }),
      });
      io.stdout(bounded(publicationOutput(result)));
      return result.aggregate === 'success' || result.aggregate === 'skipped' ? 0 : 1;
    }

    if (args.command === 'state-init') {
      await initializePublishingState(required(args, 'repository'), githubToken(io), services.fetch);
      io.stdout(bounded({ status: 'initialized' }));
      return 0;
    }

    if (args.command === 'reconcile') {
      const resolution = required(args, 'resolution');
      if (resolution !== 'published' && resolution !== 'non-creation') {
        throw new Error('--resolution must be published or non-creation.');
      }
      await reconcileAttempt({
        repository: required(args, 'repository'),
        githubToken: githubToken(io),
        recordKey: required(args, 'record-key'),
        attemptNumber: integer(required(args, 'attempt-number'), 'attempt-number'),
        attemptId: required(args, 'attempt-id'),
        resolution,
        ...(optional(args, 'provider-id') === undefined ? {} : { providerId: required(args, 'provider-id') }),
        ...(optional(args, 'url') === undefined ? {} : { url: required(args, 'url') }),
        cliSettled: args.flags.has('cli-settled'),
        ...(services.fetch === undefined ? {} : { fetch: services.fetch }),
      });
      io.stdout(bounded({ status: 'reconciled', resolution }));
      return 0;
    }

    if (args.command === 'revise') {
      const loaded = await loadPrepared(args, io, services);
      if (loaded.prepared.status !== 'ready') throw new Error('A skipped release cannot be used for plan revision.');
      const destination = required(args, 'destination');
      if (destination !== 'x' && destination !== 'linkedin') throw new Error('--destination must be x or linkedin.');
      const plan = loaded.prepared.plans.find((item) => item.destination === destination);
      if (!plan) throw new Error(`Configured destination ${destination} is not present in the new plan.`);

      await reviseAttempt({
        repository: loaded.repository,
        githubToken: githubToken(io),
        recordKey: required(args, 'record-key'),
        attemptNumber: integer(required(args, 'attempt-number'), 'attempt-number'),
        attemptId: required(args, 'attempt-id'),
        oldDigest: required(args, 'old-digest'),
        newPlan: plan,
        execution: cliExecution(),
        ...(services.fetch === undefined ? {} : { fetch: services.fetch }),
      });
      io.stdout(bounded({ status: 'revised', destination, digest: plan.digest }));
      return 0;
    }

    throw new Error(`Unknown command: ${args.command}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown failure.';
    io.stderr(bounded({ error: message.slice(0, 1000) }));
    return 1;
  }
}
