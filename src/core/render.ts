import { createHash } from 'node:crypto';

import { parseReleaseSocialConfig } from './config.js';
import { validationError } from './errors.js';
import { renderGitHubReleaseNotesFallback } from './fallback.js';
import { inspectReleaseNotesContent, parseReleaseNotes } from './release-notes.js';
import { getSourceSkipReason, sourceIdentity, validateCanonicalSource } from './source.js';
import {
  DESTINATIONS,
  type CanonicalSourceIdentity,
  type Destination,
  type LinkedInAccountIdentity,
  type ProviderAccountIdentity,
  type ReleasePlanResult,
  type ReleaseSocialConfig,
  type RenderedDestinationPlan,
  type TextSource,
  type TextVariant,
  type XAccountIdentity,
} from './types.js';

const PROVIDER_DEFAULT: Readonly<Record<Destination, TextVariant>> = {
  x: 'short',
  linkedin: 'announcement',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactKeys(record: Record<string, unknown>, allowed: readonly string[], path: string): void {
  const expected = new Set(allowed);
  const unknown = Object.keys(record).filter((key) => !expected.has(key));
  const missing = allowed.filter((key) => !(key in record));
  if (unknown.length > 0 || missing.length > 0) {
    validationError(
      'invalid_plan_shape',
      path,
      `must contain exactly ${allowed.join(', ')}${unknown.length > 0 ? `; unsupported: ${unknown.join(', ')}` : ''}${missing.length > 0 ? `; missing: ${missing.join(', ')}` : ''}`,
    );
  }
}

function assertNoExternalLink(prose: string, path: string): void {
  if (/\b(?:https?:\/\/|www\.)/i.test(prose)) {
    validationError(
      'prose_contains_link',
      path,
      'must not contain links; the canonical GitHub release URL is appended by the renderer',
    );
  }
}

function accountIdentity(destination: Destination, config: ReleaseSocialConfig): ProviderAccountIdentity {
  if (destination === 'x') {
    const x = config.destinations.x;
    if (x === undefined) validationError('missing_destination_config', '$.destinations.x', 'is not configured');
    return { destination: 'x', accountId: x.accountId };
  }
  const linkedin = config.destinations.linkedin;
  if (linkedin === undefined) {
    validationError('missing_destination_config', '$.destinations.linkedin', 'is not configured');
  }
  return {
    destination: 'linkedin',
    author: linkedin.author,
    apiVersion: linkedin.apiVersion,
  };
}

function configuredVariant(destination: Destination, config: ReleaseSocialConfig): TextVariant | undefined {
  return destination === 'x' ? config.destinations.x?.text : config.destinations.linkedin?.text;
}

function selectText(
  destination: Destination,
  config: ReleaseSocialConfig,
  notes: ReturnType<typeof parseReleaseNotes>,
): { prose: string; textSource: TextSource } {
  const override = notes.overrides[destination];
  if (override !== undefined) return { prose: override, textSource: { kind: 'provider_override' } };

  const configured = configuredVariant(destination, config);
  if (configured !== undefined) {
    return {
      prose: configured === 'short' ? notes.short : notes.announcement,
      textSource: { kind: 'configured_variant', variant: configured },
    };
  }

  const fallback = PROVIDER_DEFAULT[destination];
  return {
    prose: fallback === 'short' ? notes.short : notes.announcement,
    textSource: { kind: 'provider_default', variant: fallback },
  };
}

function digestFor(plan: Omit<RenderedDestinationPlan, 'digest'>): string {
  const account =
    plan.account.destination === 'x'
      ? { destination: 'x', accountId: plan.account.accountId }
      : {
          destination: 'linkedin',
          author: plan.account.author,
          apiVersion: plan.account.apiVersion,
        };
  const canonical = {
    schema: 'release-social-plan:v1',
    version: plan.version,
    destination: plan.destination,
    account,
    textSource: plan.textSource,
    source: {
      repositoryId: plan.source.repositoryId,
      repository: plan.source.repository,
      releaseId: plan.source.releaseId,
      tag: plan.source.tag,
      releaseUrl: plan.source.releaseUrl,
    },
    text: plan.text,
  };
  return createHash('sha256').update(JSON.stringify(canonical), 'utf8').digest('hex');
}

function renderFallbackDestination(
  destination: Destination,
  config: ReleaseSocialConfig,
  source: ReturnType<typeof validateCanonicalSource>,
): RenderedDestinationPlan {
  const selection = renderGitHubReleaseNotesFallback(destination, source);
  const prose = selection.prose.replace(/\r\n?/g, '\n').trim();
  assertNoExternalLink(prose, `$.releaseNotes.fallback.${destination}`);
  const text = `${prose}\n\n${source.releaseUrl}`;

  const planWithoutDigest: Omit<RenderedDestinationPlan, 'digest'> = {
    version: 1,
    destination,
    account: accountIdentity(destination, config),
    textSource: selection.textSource,
    text,
    source: sourceIdentity(source),
  };
  return { ...planWithoutDigest, digest: digestFor(planWithoutDigest) };
}

function renderDestination(
  destination: Destination,
  config: ReleaseSocialConfig,
  notes: ReturnType<typeof parseReleaseNotes>,
  source: ReturnType<typeof validateCanonicalSource>,
): RenderedDestinationPlan {
  const selection = selectText(destination, config, notes);
  const prose = selection.prose.replace(/\r\n?/g, '\n').trim();
  assertNoExternalLink(prose, `$.releaseNotes.social.${destination}`);
  const text = `${prose}\n\n${source.releaseUrl}`;

  const planWithoutDigest: Omit<RenderedDestinationPlan, 'digest'> = {
    version: 1,
    destination,
    account: accountIdentity(destination, config),
    textSource: selection.textSource,
    text,
    source: sourceIdentity(source),
  };
  return { ...planWithoutDigest, digest: digestFor(planWithoutDigest) };
}

export function createReleasePlan(sourceInput: unknown, configInput: unknown): ReleasePlanResult {
  const config = parseReleaseSocialConfig(configInput);
  const source = validateCanonicalSource(sourceInput);
  const sourceSkip = getSourceSkipReason(source);
  if (sourceSkip !== undefined) return { status: 'skipped', reason: sourceSkip };

  const contentState = inspectReleaseNotesContent(source.body);
  if (contentState === 'skip') return { status: 'skipped', reason: 'announcement_opt_out' };

  if (contentState === 'missing') {
    const mode = config.content?.missingAuthored ?? 'github-release-notes';
    if (mode === 'error') {
      validationError(
        'authored_content_missing',
        '$.releaseNotes',
        'authored release-social sections are absent and content.missingAuthored is set to error',
      );
    }
    if (mode === 'skip') return { status: 'skipped', reason: 'authored_content_missing' };

    const fallbackPlans: RenderedDestinationPlan[] = [];
    for (const destination of DESTINATIONS) {
      if (config.destinations[destination] !== undefined) {
        fallbackPlans.push(renderFallbackDestination(destination, config, source));
      }
    }
    return { status: 'ready', plans: fallbackPlans };
  }

  const notes = parseReleaseNotes(source.body);
  if (notes.skip) return { status: 'skipped', reason: 'announcement_opt_out' };

  const plans: RenderedDestinationPlan[] = [];
  for (const destination of DESTINATIONS) {
    if (config.destinations[destination] !== undefined) {
      plans.push(renderDestination(destination, config, notes, source));
    }
  }
  return { status: 'ready', plans };
}

function parseIdentity(input: unknown): CanonicalSourceIdentity {
  if (!isRecord(input)) validationError('invalid_plan_source', '$.plan.source', 'must be an object');
  exactKeys(input, ['repositoryId', 'repository', 'releaseId', 'tag', 'releaseUrl'], '$.plan.source');
  const validated = validateCanonicalSource({
    repositoryId: input.repositoryId,
    repository: input.repository,
    releaseId: input.releaseId,
    tag: input.tag,
    releaseUrl: input.releaseUrl,
    body: '',
    draft: false,
    prerelease: false,
    visibility: 'public',
  });
  return sourceIdentity(validated);
}

function parseTextSource(input: unknown): TextSource {
  if (!isRecord(input) || typeof input.kind !== 'string') {
    validationError(
      'invalid_text_source',
      '$.plan.textSource',
      'must describe an authored or github_release_notes text source',
    );
  }
  if (input.kind === 'provider_override') {
    exactKeys(input, ['kind'], '$.plan.textSource');
    return { kind: 'provider_override' };
  }
  if (input.kind === 'configured_variant' || input.kind === 'provider_default') {
    exactKeys(input, ['kind', 'variant'], '$.plan.textSource');
    if (input.variant !== 'short' && input.variant !== 'announcement') {
      validationError('invalid_text_source', '$.plan.textSource.variant', 'must be short or announcement');
    }
    return { kind: input.kind, variant: input.variant };
  }
  if (input.kind === 'github_release_notes') {
    exactKeys(
      input,
      ['kind', 'contentDigest', 'includedEntries', 'omittedEntries', 'omissionReason'],
      '$.plan.textSource',
    );
    if (typeof input.contentDigest !== 'string' || !/^[0-9a-f]{64}$/.test(input.contentDigest)) {
      validationError('invalid_text_source', '$.plan.textSource.contentDigest', 'must be a lowercase SHA-256 digest');
    }
    if (
      typeof input.includedEntries !== 'number' ||
      !Number.isSafeInteger(input.includedEntries) ||
      input.includedEntries < 0 ||
      typeof input.omittedEntries !== 'number' ||
      !Number.isSafeInteger(input.omittedEntries) ||
      input.omittedEntries < 0
    ) {
      validationError('invalid_text_source', '$.plan.textSource', 'entry counts must be non-negative safe integers');
    }
    if (
      input.omissionReason !== 'none' &&
      input.omissionReason !== 'empty_body' &&
      input.omissionReason !== 'no_useful_content' &&
      input.omissionReason !== 'budget'
    ) {
      validationError('invalid_text_source', '$.plan.textSource.omissionReason', 'contains an unsupported reason');
    }
    return {
      kind: 'github_release_notes',
      contentDigest: input.contentDigest,
      includedEntries: input.includedEntries,
      omittedEntries: input.omittedEntries,
      omissionReason: input.omissionReason,
    };
  }
  validationError('invalid_text_source', '$.plan.textSource.kind', 'contains an unsupported text source');
}

function parseAccount(input: unknown, destination: Destination): ProviderAccountIdentity {
  if (!isRecord(input)) validationError('invalid_plan_account', '$.plan.account', 'must be an object');
  if (destination === 'x') {
    exactKeys(input, ['destination', 'accountId'], '$.plan.account');
    if (input.destination !== 'x' || typeof input.accountId !== 'string' || !/^\d+$/.test(input.accountId)) {
      validationError(
        'invalid_plan_account',
        '$.plan.account',
        'must contain destination=x and a numeric accountId string',
      );
    }
    const account: XAccountIdentity = { destination: 'x', accountId: input.accountId };
    return account;
  }

  exactKeys(input, ['destination', 'author', 'apiVersion'], '$.plan.account');
  if (
    input.destination !== 'linkedin' ||
    typeof input.author !== 'string' ||
    !/^urn:li:person:[^\s:]+$/.test(input.author) ||
    typeof input.apiVersion !== 'string' ||
    !/^\d{6}$/.test(input.apiVersion)
  ) {
    validationError(
      'invalid_plan_account',
      '$.plan.account',
      'must contain the validated LinkedIn author and apiVersion',
    );
  }
  const month = Number(input.apiVersion.slice(4));
  if (month < 1 || month > 12) {
    validationError('invalid_plan_account', '$.plan.account.apiVersion', 'contains an invalid month');
  }
  const account: LinkedInAccountIdentity = {
    destination: 'linkedin',
    author: input.author,
    apiVersion: input.apiVersion,
  };
  return account;
}

export function validateRenderedPlan(input: unknown): RenderedDestinationPlan {
  if (!isRecord(input)) validationError('invalid_plan', '$.plan', 'must be an object');
  exactKeys(input, ['version', 'destination', 'account', 'textSource', 'text', 'source', 'digest'], '$.plan');
  if (input.version !== 1) validationError('invalid_plan_version', '$.plan.version', 'must be 1');
  if (input.destination !== 'x' && input.destination !== 'linkedin') {
    validationError('invalid_plan_destination', '$.plan.destination', 'must be x or linkedin');
  }
  if (typeof input.text !== 'string') validationError('invalid_plan_text', '$.plan.text', 'must be a string');
  if (typeof input.digest !== 'string' || !/^[0-9a-f]{64}$/.test(input.digest)) {
    validationError('invalid_plan_digest', '$.plan.digest', 'must be a lowercase SHA-256 digest');
  }

  const destination = input.destination;
  const source = parseIdentity(input.source);
  const account = parseAccount(input.account, destination);
  const textSource = parseTextSource(input.textSource);
  const suffix = `\n\n${source.releaseUrl}`;
  if (!input.text.endsWith(suffix)) {
    validationError(
      'invalid_plan_text',
      '$.plan.text',
      'must end with exactly one canonical release URL separated by one blank line',
    );
  }
  const prose = input.text.slice(0, -suffix.length);
  if (prose === '' || prose.trim() !== prose) {
    validationError(
      'invalid_plan_text',
      '$.plan.text',
      'prose must be non-empty with boundary whitespace already trimmed',
    );
  }
  assertNoExternalLink(prose, '$.plan.text');
  if (input.text.split(source.releaseUrl).length !== 2) {
    validationError('invalid_plan_text', '$.plan.text', 'must contain the canonical release URL exactly once');
  }

  const planWithoutDigest: Omit<RenderedDestinationPlan, 'digest'> = {
    version: 1,
    destination,
    account,
    textSource,
    text: input.text,
    source,
  };
  const expected = digestFor(planWithoutDigest);
  if (input.digest !== expected) {
    validationError(
      'plan_digest_mismatch',
      '$.plan.digest',
      'does not match the canonical nonsecret plan inputs and final payload',
    );
  }
  return { ...planWithoutDigest, digest: input.digest };
}
