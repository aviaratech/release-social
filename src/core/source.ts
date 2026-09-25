import { validationError } from './errors.js';
import type { CanonicalReleaseSource, CanonicalSourceIdentity, SkipReason, SourceVisibility } from './types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) validationError('invalid_source', '$.source', 'must be an object');
  return value;
}

function assertExactKeys(value: Record<string, unknown>): void {
  const allowed = new Set([
    'repositoryId',
    'repository',
    'releaseId',
    'tag',
    'releaseUrl',
    'body',
    'draft',
    'prerelease',
    'visibility',
  ]);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    validationError('unknown_source_field', '$.source', `contains unsupported field(s): ${unknown.join(', ')}`);
  }
}

function parsePositiveSafeInteger(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    validationError('invalid_numeric_id', path, 'must be a positive safe integer');
  }
  return value;
}

function parseVisibility(value: unknown): SourceVisibility {
  if (value !== 'public' && value !== 'private' && value !== 'internal') {
    validationError('invalid_visibility', '$.source.visibility', 'must be public, private, or internal');
  }
  return value;
}

function validateReleaseUrl(repository: string, tag: string, value: unknown): string {
  if (typeof value !== 'string') {
    validationError('invalid_release_url', '$.source.releaseUrl', 'must be a canonical public GitHub release URL');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    validationError('invalid_release_url', '$.source.releaseUrl', 'must be a valid URL');
  }

  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'github.com' ||
    url.username !== '' ||
    url.password !== '' ||
    url.search !== '' ||
    url.hash !== ''
  ) {
    validationError(
      'invalid_release_url',
      '$.source.releaseUrl',
      'must be an https://github.com release URL without credentials, query, or fragment',
    );
  }

  const prefix = `/${repository}/releases/tag/`;
  if (!url.pathname.startsWith(prefix)) {
    validationError(
      'release_url_mismatch',
      '$.source.releaseUrl',
      'must belong to the source repository and use /releases/tag/<tag>',
    );
  }

  const encodedTag = url.pathname.slice(prefix.length);
  let decodedTag: string;
  try {
    decodedTag = decodeURIComponent(encodedTag);
  } catch {
    validationError('invalid_release_url', '$.source.releaseUrl', 'contains an invalid encoded tag');
  }

  if (decodedTag !== tag) {
    validationError('release_url_mismatch', '$.source.releaseUrl', 'tag does not match the canonical source tag');
  }

  return value;
}

export function validateCanonicalSource(input: unknown): CanonicalReleaseSource {
  const record = requireRecord(input);
  assertExactKeys(record);

  const repositoryId = parsePositiveSafeInteger(record.repositoryId, '$.source.repositoryId');
  const releaseId = parsePositiveSafeInteger(record.releaseId, '$.source.releaseId');

  if (typeof record.repository !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(record.repository)) {
    validationError('invalid_repository', '$.source.repository', 'must use owner/name');
  }
  if (typeof record.tag !== 'string' || record.tag.trim() === '') {
    validationError('invalid_tag', '$.source.tag', 'must be a non-empty string');
  }
  if (typeof record.body !== 'string') {
    validationError('invalid_body', '$.source.body', 'must be a string');
  }
  if (typeof record.draft !== 'boolean') {
    validationError('invalid_draft_flag', '$.source.draft', 'must be boolean');
  }
  if (typeof record.prerelease !== 'boolean') {
    validationError('invalid_prerelease_flag', '$.source.prerelease', 'must be boolean');
  }

  const visibility = parseVisibility(record.visibility);
  const releaseUrl = validateReleaseUrl(record.repository, record.tag, record.releaseUrl);

  return {
    repositoryId,
    repository: record.repository,
    releaseId,
    tag: record.tag,
    releaseUrl,
    body: record.body,
    draft: record.draft,
    prerelease: record.prerelease,
    visibility,
  };
}

export function getSourceSkipReason(source: CanonicalReleaseSource): SkipReason | undefined {
  if (source.draft) return 'draft_release';
  if (source.prerelease) return 'prerelease_release';
  if (source.visibility !== 'public') return 'source_not_public';
  return undefined;
}

export function sourceIdentity(source: CanonicalReleaseSource): CanonicalSourceIdentity {
  return {
    repositoryId: source.repositoryId,
    repository: source.repository,
    releaseId: source.releaseId,
    tag: source.tag,
    releaseUrl: source.releaseUrl,
  };
}
