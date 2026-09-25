import { validationError } from './errors.js';
import type {
  LinkedInDestinationConfig,
  MissingAuthoredMode,
  ReleaseContentConfig,
  ReleaseSocialConfig,
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

function parseX(value: unknown): XDestinationConfig {
  const record = assertRecord(value, '$.destinations.x');
  assertExactKeys(record, ['accountId', 'text'], '$.destinations.x');

  if (typeof record.accountId !== 'string' || !/^\d+$/.test(record.accountId)) {
    validationError(
      'invalid_x_account_id',
      '$.destinations.x.accountId',
      'must be a numeric user ID encoded as a string',
    );
  }

  const text = parseTextVariant(record.text, '$.destinations.x.text');
  return text === undefined ? { accountId: record.accountId } : { accountId: record.accountId, text };
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

function parseLinkedIn(value: unknown): LinkedInDestinationConfig {
  const record = assertRecord(value, '$.destinations.linkedin');
  assertExactKeys(record, ['author', 'apiVersion', 'text'], '$.destinations.linkedin');

  if (typeof record.author !== 'string' || !/^urn:li:person:[^\s:]+$/.test(record.author)) {
    validationError('invalid_linkedin_author', '$.destinations.linkedin.author', 'must match urn:li:person:...');
  }

  const apiVersion = parseApiVersion(record.apiVersion);
  const text = parseTextVariant(record.text, '$.destinations.linkedin.text');
  return text === undefined ? { author: record.author, apiVersion } : { author: record.author, apiVersion, text };
}

export function parseReleaseSocialConfig(input: unknown): ReleaseSocialConfig {
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
  if ('x' in destinations) parsed.x = parseX(destinations.x);
  if ('linkedin' in destinations) parsed.linkedin = parseLinkedIn(destinations.linkedin);

  const content = root.content === undefined ? undefined : parseContent(root.content);
  return content === undefined ? { version: 1, destinations: parsed } : { version: 1, content, destinations: parsed };
}
