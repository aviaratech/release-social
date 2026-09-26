import { validationError } from './errors.js';
import type {
  LinkedInDestinationConfig,
  MissingAuthoredMode,
  ReleaseContentConfig,
  ReleaseSocialConfig,
  RuntimeProviderIdentities,
  TextVariant,
  XDestinationConfig,
} from './types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) {
    validationError('invalid_object', path, 'must be an object');
  }
  return value;
}

function assertExactKeys(value: Record<string, unknown>, allowed: readonly string[], path: string): void {
  const allowedSet = new Set(allowed);
  const unknown = Object.keys(value).filter((key) => !allowedSet.has(key));
  if (unknown.length > 0) {
    validationError('unknown_field', path, `contains unsupported field(s): ${unknown.join(', ')}`);
  }
}

function parseTextVariant(value: unknown, path: string): TextVariant | undefined {
  if (value === undefined) return undefined;
  if (value !== 'short' && value !== 'announcement') {
    validationError('invalid_text_variant', path, 'must be "short" or "announcement"');
  }
  return value;
}

function parseMissingAuthored(value: unknown): MissingAuthoredMode | undefined {
  if (value === undefined) return undefined;
  if (value !== 'github-release-notes' && value !== 'error' && value !== 'skip') {
    validationError(
      'invalid_missing_authored_mode',
      '$.content.missingAuthored',
      'must be "github-release-notes", "error", or "skip"',
    );
  }
  return value;
}

function parseContent(value: unknown): ReleaseContentConfig {
  const record = assertRecord(value, '$.content');
  assertExactKeys(record, ['missingAuthored'], '$.content');
  const missingAuthored = parseMissingAuthored(record.missingAuthored);
  return missingAuthored === undefined ? {} : { missingAuthored };
}

function normalizeRuntimeIdentity(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized === '' ? undefined : normalized;
}

function resolveXAccountId(configured: unknown, runtime: string | undefined): string {
  if (configured !== undefined && (typeof configured !== 'string' || !/^\d+$/.test(configured))) {
    validationError(
      'invalid_x_account_id',
      '$.destinations.x.accountId',
      'must be a numeric user ID encoded as a string',
    );
  }

  const runtimeAccountId = normalizeRuntimeIdentity(runtime);
  if (runtimeAccountId !== undefined && !/^\d+$/.test(runtimeAccountId)) {
    validationError(
      'invalid_x_account_id',
      '$.runtime.X_ACCOUNT_ID',
      'must be a numeric user ID encoded as a string',
    );
  }

  if (typeof configured === 'string' && runtimeAccountId !== undefined && configured !== runtimeAccountId) {
    validationError(
      'conflicting_x_account_id',
      '$.destinations.x.accountId',
      'does not match runtime X_ACCOUNT_ID',
    );
  }

  const accountId = typeof configured === 'string' ? configured : runtimeAccountId;
  if (accountId === undefined) {
    validationError(
      'missing_x_account_id',
      '$.destinations.x.accountId',
      'must be configured directly or supplied through X_ACCOUNT_ID',
    );
  }
  return accountId;
}

function parseX(value: unknown, runtimeAccountId?: string): XDestinationConfig {
  const record = assertRecord(value, '$.destinations.x');
  assertExactKeys(record, ['accountId', 'text'], '$.destinations.x');

  const accountId = resolveXAccountId(record.accountId, runtimeAccountId);
  const text = parseTextVariant(record.text, '$.destinations.x.text');
  return text === undefined ? { accountId } : { accountId, text };
}

function parseApiVersion(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{6}$/.test(value)) {
    validationError('invalid_linkedin_api_version', '$.destinations.linkedin.apiVersion', 'must use YYYYMM');
  }
  const month = Number(value.slice(4));
  if (month < 1 || month > 12) {
    validationError('invalid_linkedin_api_version', '$.destinations.linkedin.apiVersion', 'contains an invalid month');
  }
  return value;
}

function resolveLinkedInAuthor(configured: unknown, runtime: string | undefined): string {
  if (
    configured !== undefined &&
    (typeof configured !== 'string' || !/^urn:li:person:[^\s:]+$/.test(configured))
  ) {
    validationError('invalid_linkedin_author', '$.destinations.linkedin.author', 'must match urn:li:person:...');
  }

  const runtimeAuthor = normalizeRuntimeIdentity(runtime);
  if (runtimeAuthor !== undefined && !/^urn:li:person:[^\s:]+$/.test(runtimeAuthor)) {
    validationError('invalid_linkedin_author', '$.runtime.LINKEDIN_AUTHOR', 'must match urn:li:person:...');
  }

  if (typeof configured === 'string' && runtimeAuthor !== undefined && configured !== runtimeAuthor) {
    validationError(
      'conflicting_linkedin_author',
      '$.destinations.linkedin.author',
      'does not match runtime LINKEDIN_AUTHOR',
    );
  }

  const author = typeof configured === 'string' ? configured : runtimeAuthor;
  if (author === undefined) {
    validationError(
      'missing_linkedin_author',
      '$.destinations.linkedin.author',
      'must be configured directly or supplied through LINKEDIN_AUTHOR',
    );
  }
  return author;
}

function parseLinkedIn(value: unknown, runtimeAuthor?: string): LinkedInDestinationConfig {
  const record = assertRecord(value, '$.destinations.linkedin');
  assertExactKeys(record, ['author', 'apiVersion', 'text'], '$.destinations.linkedin');

  const author = resolveLinkedInAuthor(record.author, runtimeAuthor);
  const apiVersion = parseApiVersion(record.apiVersion);
  const text = parseTextVariant(record.text, '$.destinations.linkedin.text');
  return text === undefined ? { author, apiVersion } : { author, apiVersion, text };
}

export function parseReleaseSocialConfig(
  input: unknown,
  identities: RuntimeProviderIdentities = {},
): ReleaseSocialConfig {
  const root = assertRecord(input, '$');
  assertExactKeys(root, ['version', 'content', 'destinations'], '$');

  if (root.version !== 1) {
    validationError('unsupported_config_version', '$.version', 'must be 1');
  }

  const destinations = assertRecord(root.destinations, '$.destinations');
  assertExactKeys(destinations, ['x', 'linkedin'], '$.destinations');

  if (Object.keys(destinations).length === 0) {
    validationError('empty_destinations', '$.destinations', 'must configure x and/or linkedin');
  }

  const parsed: ReleaseSocialConfig['destinations'] = {};
  if ('x' in destinations) parsed.x = parseX(destinations.x, identities.xAccountId);
  if ('linkedin' in destinations) parsed.linkedin = parseLinkedIn(destinations.linkedin, identities.linkedinAuthor);

  const content = root.content === undefined ? undefined : parseContent(root.content);
  return content === undefined ? { version: 1, destinations: parsed } : { version: 1, content, destinations: parsed };
}
