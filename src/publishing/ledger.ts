import { createHash, randomUUID } from 'node:crypto';

import { validateRenderedPlan } from '../core/render.js';
import type { Destination, RenderedDestinationPlan } from '../core/types.js';
import { PublishingError } from './errors.js';
import {
  PUBLISHING_IMPLEMENTATION_ID,
  PUBLISHING_SCHEMA_VERSION,
  type DestinationRecord,
  type LedgerTransition,
  type PlanRevision,
  type PublicExecutionIdentity,
  type PublishingAttempt,
  type PublishingLedgerV1,
  type StateTransitionMetadata,
  type TerminalState,
} from './types.js';

const DIGEST_PATTERN = /^[0-9a-f]{64}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const MAX_TRANSITIONS = 100_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new PublishingError('state_corrupt', message);
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) fail(`${path} must be an object.`);
  return value;
}

function requireString(value: unknown, path: string, maxLength = 1024): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > maxLength) {
    fail(`${path} must be a non-empty bounded string.`);
  }
  return value;
}

function requireInteger(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    fail(`${path} must be a positive safe integer.`);
  }
  return value;
}

function requireExactKeys(record: Record<string, unknown>, keys: readonly string[], path: string): void {
  const allowed = new Set(keys);
  const unknown = Object.keys(record).filter((key) => !allowed.has(key));
  const missing = keys.filter((key) => !(key in record));
  if (unknown.length > 0 || missing.length > 0) {
    fail(
      `${path} has an invalid shape${unknown.length > 0 ? `; unsupported: ${unknown.join(', ')}` : ''}${missing.length > 0 ? `; missing: ${missing.join(', ')}` : ''}.`,
    );
  }
}

function requireTimestamp(value: unknown, path: string): string {
  const timestamp = requireString(value, path, 64);
  if (!Number.isFinite(Date.parse(timestamp))) fail(`${path} must be an ISO-compatible timestamp.`);
  return timestamp;
}

function requireDigest(value: unknown, path: string): string {
  const digest = requireString(value, path, 64);
  if (!DIGEST_PATTERN.test(digest)) fail(`${path} must be a lowercase SHA-256 digest.`);
  return digest;
}

function validateExecution(value: unknown, path: string): PublicExecutionIdentity {
  const record = requireRecord(value, path);
  const kind = requireString(record.kind, `${path}.kind`, 32);

  if (kind === 'github_run') {
    requireExactKeys(record, ['kind', 'repository', 'runId', 'url'], path);
    const repository = requireString(record.repository, `${path}.repository`, 256);
    if (!REPOSITORY_PATTERN.test(repository)) fail(`${path}.repository must use owner/name.`);
    const runId = requireInteger(record.runId, `${path}.runId`);
    const url = requireString(record.url, `${path}.url`, 512);
    if (url !== `https://github.com/${repository}/actions/runs/${runId}`) {
      fail(`${path}.url must be the canonical public GitHub Actions run URL.`);
    }
    return { kind: 'github_run', repository, runId, url };
  }

  if (kind === 'cli') {
    requireExactKeys(record, ['kind', 'invocationId'], path);
    const invocationId = requireString(record.invocationId, `${path}.invocationId`, 128);
    if (!UUID_PATTERN.test(invocationId)) fail(`${path}.invocationId must be a UUID.`);
    return { kind: 'cli', invocationId };
  }

  fail(`${path}.kind is unsupported.`);
}

function validateTerminal(
  value: unknown,
  state: PublishingAttempt['state'],
  destination: Destination,
  path: string,
): TerminalState | undefined {
  if (state === 'pending') {
    if (value !== undefined) fail(`${path} must be absent for a pending attempt.`);
    return undefined;
  }

  const record = requireRecord(value, path);
  const kind = requireString(record.kind, `${path}.kind`, 32);

  if (state === 'published') {
    requireExactKeys(record, ['kind', 'providerId', 'url', 'recordedAt', 'resolution'], path);
    if (kind !== 'published') fail(`${path}.kind must be published.`);
    const providerId = requireString(record.providerId, `${path}.providerId`, 256);
    const url = requireString(record.url, `${path}.url`, 1024);
    validatePublicPost(destination, providerId, url);
    const recordedAt = requireTimestamp(record.recordedAt, `${path}.recordedAt`);
    if (record.resolution !== 'provider' && record.resolution !== 'operator_public_post') {
      fail(`${path}.resolution is unsupported.`);
    }
    return {
      kind: 'published',
      providerId,
      url,
      recordedAt,
      resolution: record.resolution,
    };
  }

  requireExactKeys(record, ['kind', 'retryEligible', 'recordedAt', 'resolution'], path);
  if (kind !== 'rejected') fail(`${path}.kind must be rejected.`);
  if (typeof record.retryEligible !== 'boolean') fail(`${path}.retryEligible must be boolean.`);
  const recordedAt = requireTimestamp(record.recordedAt, `${path}.recordedAt`);
  if (record.resolution !== 'provider' && record.resolution !== 'operator_non_creation') {
    fail(`${path}.resolution is unsupported.`);
  }
  return {
    kind: 'rejected',
    retryEligible: record.retryEligible,
    recordedAt,
    resolution: record.resolution,
  };
}

function validateAttempt(
  value: unknown,
  destination: Destination,
  expectedNumber: number,
  path: string,
): PublishingAttempt {
  const record = requireRecord(value, path);
  const allowed = [
    'attemptNumber',
    'attemptId',
    'payloadDigest',
    'schemaVersion',
    'implementationId',
    'execution',
    'startedAt',
    'state',
  ];
  if ('terminal' in record) allowed.push('terminal');
  requireExactKeys(record, allowed, path);

  const attemptNumber = requireInteger(record.attemptNumber, `${path}.attemptNumber`);
  if (attemptNumber !== expectedNumber) fail(`${path}.attemptNumber must be monotonic and contiguous.`);

  const attemptId = requireString(record.attemptId, `${path}.attemptId`, 64);
  if (!UUID_PATTERN.test(attemptId)) fail(`${path}.attemptId must be a UUID.`);
  const payloadDigest = requireDigest(record.payloadDigest, `${path}.payloadDigest`);
  if (record.schemaVersion !== PUBLISHING_SCHEMA_VERSION) {
    throw new PublishingError('state_unsupported', `${path}.schemaVersion is unsupported.`);
  }
  if (record.implementationId !== PUBLISHING_IMPLEMENTATION_ID) {
    throw new PublishingError('state_unsupported', `${path}.implementationId is incompatible.`);
  }

  const execution = validateExecution(record.execution, `${path}.execution`);
  const startedAt = requireTimestamp(record.startedAt, `${path}.startedAt`);
  if (record.state !== 'pending' && record.state !== 'published' && record.state !== 'rejected') {
    fail(`${path}.state is unsupported.`);
  }
  const terminal = validateTerminal(record.terminal, record.state, destination, `${path}.terminal`);

  return terminal === undefined
    ? {
        attemptNumber,
        attemptId,
        payloadDigest,
        schemaVersion: 1,
        implementationId: PUBLISHING_IMPLEMENTATION_ID,
        execution,
        startedAt,
        state: record.state,
      }
    : {
        attemptNumber,
        attemptId,
        payloadDigest,
        schemaVersion: 1,
        implementationId: PUBLISHING_IMPLEMENTATION_ID,
        execution,
        startedAt,
        state: record.state,
        terminal,
      };
}

function validateRevision(
  value: unknown,
  record: DestinationRecord,
  expectedNumber: number,
  path: string,
): PlanRevision {
  const revision = requireRecord(value, path);
  requireExactKeys(
    revision,
    ['revisionNumber', 'fromAttemptNumber', 'fromDigest', 'toDigest', 'createdAt', 'execution'],
    path,
  );
  const revisionNumber = requireInteger(revision.revisionNumber, `${path}.revisionNumber`);
  if (revisionNumber !== expectedNumber) fail(`${path}.revisionNumber must be monotonic and contiguous.`);
  const fromAttemptNumber = requireInteger(revision.fromAttemptNumber, `${path}.fromAttemptNumber`);
  const fromAttempt = record.attempts[fromAttemptNumber - 1];
  if (fromAttempt === undefined || fromAttempt.state !== 'rejected') {
    fail(`${path}.fromAttemptNumber must identify a rejected attempt.`);
  }
  const fromDigest = requireDigest(revision.fromDigest, `${path}.fromDigest`);
  if (fromDigest !== fromAttempt.payloadDigest) fail(`${path}.fromDigest must match the originating attempt.`);
  const toDigest = requireDigest(revision.toDigest, `${path}.toDigest`);
  if (toDigest === fromDigest) fail(`${path}.toDigest must differ from fromDigest.`);
  const createdAt = requireTimestamp(revision.createdAt, `${path}.createdAt`);
  const execution = validateExecution(revision.execution, `${path}.execution`);
  return { revisionNumber, fromAttemptNumber, fromDigest, toDigest, createdAt, execution };
}

function validateRecord(value: unknown, expectedKey: string, path: string): DestinationRecord {
  const record = requireRecord(value, path);
  requireExactKeys(
    record,
    ['key', 'repositoryId', 'releaseId', 'repository', 'destination', 'accountIdentity', 'attempts', 'revisions'],
    path,
  );
  const key = requireString(record.key, `${path}.key`, 64);
  if (key !== expectedKey || !DIGEST_PATTERN.test(key)) fail(`${path}.key is invalid.`);
  const repositoryId = requireInteger(record.repositoryId, `${path}.repositoryId`);
  const releaseId = requireInteger(record.releaseId, `${path}.releaseId`);
  const repository = requireString(record.repository, `${path}.repository`, 256);
  if (!REPOSITORY_PATTERN.test(repository)) fail(`${path}.repository must use owner/name.`);
  if (record.destination !== 'x' && record.destination !== 'linkedin') fail(`${path}.destination is unsupported.`);
  const destination = record.destination;
  const accountIdentity = requireString(record.accountIdentity, `${path}.accountIdentity`, 512);

  const calculatedKey = recordKey(repositoryId, releaseId, destination, accountIdentity);
  if (calculatedKey !== key) fail(`${path}.key does not match its stable identity.`);

  if (!Array.isArray(record.attempts) || record.attempts.length === 0) {
    fail(`${path}.attempts must contain at least one attempt.`);
  }
  const attempts = record.attempts.map((attempt, index) =>
    validateAttempt(attempt, destination, index + 1, `${path}.attempts[${index}]`),
  );

  const publishedIndex = attempts.findIndex((attempt) => attempt.state === 'published');
  if (publishedIndex >= 0 && publishedIndex !== attempts.length - 1) {
    fail(`${path}.attempts cannot continue after a published attempt.`);
  }

  const baseRecord: DestinationRecord = {
    key,
    repositoryId,
    releaseId,
    repository,
    destination,
    accountIdentity,
    attempts,
    revisions: [],
  };

  if (!Array.isArray(record.revisions)) fail(`${path}.revisions must be an array.`);
  const revisions = record.revisions.map((revision, index) =>
    validateRevision(revision, baseRecord, index + 1, `${path}.revisions[${index}]`),
  );

  const revisedAttempts = new Set<number>();
  for (const revision of revisions) {
    if (revisedAttempts.has(revision.fromAttemptNumber)) {
      fail(`${path}.revisions may revise a rejected attempt only once.`);
    }
    revisedAttempts.add(revision.fromAttemptNumber);
  }

  return { ...baseRecord, revisions };
}

function validateTransition(value: unknown, index: number): LedgerTransition {
  const path = `$.transitions[${index}]`;
  const record = requireRecord(value, path);
  const keys = ['id', 'kind', 'at'];
  if ('recordKey' in record) keys.push('recordKey');
  if ('attemptId' in record) keys.push('attemptId');
  requireExactKeys(record, keys, path);

  const id = requireString(record.id, `${path}.id`, 128);
  if (!UUID_PATTERN.test(id)) fail(`${path}.id must be a UUID.`);
  const kind = requireString(record.kind, `${path}.kind`, 64);
  const at = requireTimestamp(record.at, `${path}.at`);
  const transition: LedgerTransition = { id, kind, at };

  if (record.recordKey !== undefined) {
    const recordKeyValue = requireDigest(record.recordKey, `${path}.recordKey`);
    transition.recordKey = recordKeyValue;
  }
  if (record.attemptId !== undefined) {
    const attemptId = requireString(record.attemptId, `${path}.attemptId`, 64);
    if (!UUID_PATTERN.test(attemptId)) fail(`${path}.attemptId must be a UUID.`);
    transition.attemptId = attemptId;
  }
  return transition;
}

function sortCanonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => sortCanonical(item));
  if (!isRecord(value)) return value;

  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    const child = value[key];
    if (child !== undefined) sorted[key] = sortCanonical(child);
  }
  return sorted;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortCanonical(value));
}

function checksumFor(ledger: Omit<PublishingLedgerV1, 'checksum'>): string {
  return createHash('sha256').update(canonicalJson(ledger), 'utf8').digest('hex');
}

export function sealLedger(ledger: Omit<PublishingLedgerV1, 'checksum'> | PublishingLedgerV1): PublishingLedgerV1 {
  const withoutChecksum: Omit<PublishingLedgerV1, 'checksum'> = {
    schemaVersion: ledger.schemaVersion,
    implementationId: ledger.implementationId,
    records: ledger.records,
    transitions: ledger.transitions,
  };
  return { ...withoutChecksum, checksum: checksumFor(withoutChecksum) };
}

export function createEmptyLedger(): PublishingLedgerV1 {
  return sealLedger({
    schemaVersion: PUBLISHING_SCHEMA_VERSION,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    records: {},
    transitions: [],
  });
}

export function validateLedger(value: unknown): PublishingLedgerV1 {
  const root = requireRecord(value, '$');
  requireExactKeys(root, ['schemaVersion', 'implementationId', 'records', 'transitions', 'checksum'], '$');

  if (root.schemaVersion !== PUBLISHING_SCHEMA_VERSION) {
    throw new PublishingError('state_unsupported', 'Publishing state schema version is unsupported.');
  }
  if (root.implementationId !== PUBLISHING_IMPLEMENTATION_ID) {
    throw new PublishingError('state_unsupported', 'Publishing implementation identity is incompatible.');
  }

  const recordsValue = requireRecord(root.records, '$.records');
  const records: Record<string, DestinationRecord> = {};
  for (const [key, record] of Object.entries(recordsValue)) {
    records[key] = validateRecord(record, key, `$.records.${key}`);
  }

  if (!Array.isArray(root.transitions) || root.transitions.length > MAX_TRANSITIONS) {
    fail('$.transitions must be a bounded array.');
  }
  const transitions = root.transitions.map((transition, index) => validateTransition(transition, index));
  const transitionIds = new Set<string>();
  for (const transition of transitions) {
    if (transitionIds.has(transition.id)) fail('$.transitions contains a duplicate transition id.');
    transitionIds.add(transition.id);
  }

  const checksum = requireDigest(root.checksum, '$.checksum');
  const ledger = {
    schemaVersion: 1 as const,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    records,
    transitions,
    checksum,
  };
  const expected = sealLedger(ledger).checksum;
  if (checksum !== expected) fail('Publishing state checksum does not match the document contents.');
  return ledger;
}

export function cloneLedger(ledger: PublishingLedgerV1): PublishingLedgerV1 {
  return structuredClone(ledger);
}

export function appendTransition(ledger: PublishingLedgerV1, metadata: StateTransitionMetadata): PublishingLedgerV1 {
  const next = cloneLedger(ledger);
  if (next.transitions.some((transition) => transition.id === metadata.id)) {
    return next;
  }
  const transition: LedgerTransition = {
    id: metadata.id,
    kind: metadata.kind.slice(0, 64),
    at: metadata.at,
  };
  if (metadata.recordKey !== undefined) transition.recordKey = metadata.recordKey;
  if (metadata.attemptId !== undefined) transition.attemptId = metadata.attemptId;
  next.transitions.push(transition);
  return sealLedger(next);
}

export function createTransitionId(): string {
  return randomUUID();
}

export function createAttemptId(): string {
  return randomUUID();
}

export function createCliExecutionIdentity(invocationId: string = randomUUID()): PublicExecutionIdentity {
  return { kind: 'cli', invocationId };
}

export function createGitHubRunExecutionIdentity(repository: string, runId: number): PublicExecutionIdentity {
  return {
    kind: 'github_run',
    repository,
    runId,
    url: `https://github.com/${repository}/actions/runs/${runId}`,
  };
}

export function accountIdentityForPlan(planInput: RenderedDestinationPlan): string {
  const plan = validateRenderedPlan(planInput);
  return plan.account.destination === 'x' ? plan.account.accountId : plan.account.author;
}

export function recordKey(
  repositoryId: number,
  releaseId: number,
  destination: Destination,
  accountIdentity: string,
): string {
  return createHash('sha256')
    .update(String(repositoryId))
    .update('\0')
    .update(String(releaseId))
    .update('\0')
    .update(destination)
    .update('\0')
    .update(accountIdentity)
    .digest('hex');
}

export function recordKeyForPlan(planInput: RenderedDestinationPlan): string {
  const plan = validateRenderedPlan(planInput);
  return recordKey(plan.source.repositoryId, plan.source.releaseId, plan.destination, accountIdentityForPlan(plan));
}

export function findRecordForPlan(
  ledger: PublishingLedgerV1,
  planInput: RenderedDestinationPlan,
): DestinationRecord | undefined {
  const plan = validateRenderedPlan(planInput);
  assertNoAccountConflict(ledger, plan);
  return ledger.records[recordKeyForPlan(plan)];
}

export function assertNoAccountConflict(ledger: PublishingLedgerV1, planInput: RenderedDestinationPlan): void {
  const plan = validateRenderedPlan(planInput);
  const accountIdentity = accountIdentityForPlan(plan);
  for (const record of Object.values(ledger.records)) {
    if (
      record.repositoryId === plan.source.repositoryId &&
      record.releaseId === plan.source.releaseId &&
      record.destination === plan.destination &&
      record.accountIdentity !== accountIdentity
    ) {
      throw new PublishingError(
        'record_identity_conflict',
        'A publishing record already exists for this release and destination under a different account identity.',
      );
    }
  }
}

export type PlanDisposition =
  | { kind: 'new' }
  | { kind: 'retry' }
  | { kind: 'already_published'; providerId: string; url: string }
  | { kind: 'unknown'; attempt: PublishingAttempt };

export function inspectPlanDisposition(
  ledger: PublishingLedgerV1,
  planInput: RenderedDestinationPlan,
): PlanDisposition {
  const plan = validateRenderedPlan(planInput);
  const record = findRecordForPlan(ledger, plan);
  if (record === undefined) return { kind: 'new' };

  const latest = record.attempts.at(-1);
  if (latest === undefined) fail('Publishing record unexpectedly contains no attempts.');

  if (latest.state === 'pending') return { kind: 'unknown', attempt: latest };

  if (latest.state === 'published') {
    if (latest.payloadDigest !== plan.digest) {
      throw new PublishingError(
        'published_plan_changed',
        'The release was already published for this destination with a different payload digest.',
      );
    }
    const terminal = latest.terminal;
    if (terminal?.kind !== 'published') fail('Published attempt lacks published terminal state.');
    return { kind: 'already_published', providerId: terminal.providerId, url: terminal.url };
  }

  const terminal = latest.terminal;
  if (terminal?.kind !== 'rejected') fail('Rejected attempt lacks rejected terminal state.');

  if (latest.payloadDigest === plan.digest) {
    if (terminal.retryEligible) return { kind: 'retry' };
    throw new PublishingError(
      'plan_revision_required',
      'The latest definitive rejection is not retryable with the same payload; an explicit plan revision is required.',
    );
  }

  const revision = record.revisions.find((item) => item.fromAttemptNumber === latest.attemptNumber);
  if (revision?.toDigest === plan.digest) return { kind: 'retry' };

  throw new PublishingError(
    'plan_revision_required',
    'The current payload digest differs from the latest rejected attempt and has not been explicitly revised.',
  );
}

function sameExecution(left: PublicExecutionIdentity, right: PublicExecutionIdentity): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function mutableRecord(
  ledger: PublishingLedgerV1,
  key: string,
): { next: PublishingLedgerV1; record: DestinationRecord } {
  const next = cloneLedger(ledger);
  const record = next.records[key];
  if (record === undefined) throw new PublishingError('attempt_not_found', 'Publishing record was not found.');
  return { next, record };
}

export function appendPendingAttempt(
  ledger: PublishingLedgerV1,
  planInput: RenderedDestinationPlan,
  execution: PublicExecutionIdentity,
  attemptId: string,
  startedAt: string,
): { ledger: PublishingLedgerV1; attempt: PublishingAttempt } {
  const plan = validateRenderedPlan(planInput);
  validateExecution(execution, '$.execution');
  if (!UUID_PATTERN.test(attemptId)) fail('attemptId must be a UUID.');
  requireTimestamp(startedAt, '$.startedAt');

  const disposition = inspectPlanDisposition(ledger, plan);
  if (disposition.kind === 'already_published') {
    throw new PublishingError('attempt_already_terminal', 'This destination is already published.');
  }
  if (disposition.kind === 'unknown') {
    throw new PublishingError('attempt_unknown', 'A pending attempt already exists and is uncertain.');
  }

  const key = recordKeyForPlan(plan);
  const next = cloneLedger(ledger);
  let record = next.records[key];
  if (record === undefined) {
    record = {
      key,
      repositoryId: plan.source.repositoryId,
      releaseId: plan.source.releaseId,
      repository: plan.source.repository,
      destination: plan.destination,
      accountIdentity: accountIdentityForPlan(plan),
      attempts: [],
      revisions: [],
    };
    next.records[key] = record;
  }

  const attempt: PublishingAttempt = {
    attemptNumber: record.attempts.length + 1,
    attemptId,
    payloadDigest: plan.digest,
    schemaVersion: 1,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    execution,
    startedAt,
    state: 'pending',
  };
  record.attempts.push(attempt);
  return { ledger: sealLedger(next), attempt };
}

export function requireOwnedPendingAttempt(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
  execution: PublicExecutionIdentity,
): PublishingAttempt {
  const record = ledger.records[recordKeyValue];
  if (record === undefined) {
    throw new PublishingError('attempt_not_found', 'The publishing record was not found.');
  }
  const attempt = record.attempts[attemptNumber - 1];
  if (attempt === undefined || attempt.attemptId !== attemptId) {
    throw new PublishingError('attempt_not_found', 'The exact publishing attempt was not found.');
  }
  if (attempt.state !== 'pending') {
    throw new PublishingError('attempt_already_terminal', 'The publishing attempt is no longer pending.');
  }
  if (record.attempts.at(-1)?.attemptId !== attemptId) {
    throw new PublishingError('attempt_not_owned', 'The publishing attempt is no longer the active attempt.');
  }
  if (!sameExecution(attempt.execution, execution)) {
    throw new PublishingError('attempt_not_owned', 'The publishing attempt belongs to another execution.');
  }
  return attempt;
}

function terminalizeAttempt(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
  execution: PublicExecutionIdentity | undefined,
  terminal: TerminalState,
): PublishingLedgerV1 {
  const { next, record } = mutableRecord(ledger, recordKeyValue);
  const attempt = record.attempts[attemptNumber - 1];
  if (attempt === undefined || attempt.attemptId !== attemptId) {
    throw new PublishingError('attempt_not_found', 'The exact publishing attempt was not found.');
  }
  if (attempt.state !== 'pending') {
    if (attempt.terminal !== undefined && canonicalJson(attempt.terminal) === canonicalJson(terminal)) {
      return sealLedger(next);
    }
    throw new PublishingError('attempt_already_terminal', 'The attempt already has a different terminal resolution.');
  }
  if (record.attempts.at(-1)?.attemptId !== attemptId) {
    throw new PublishingError('attempt_not_owned', 'The publishing attempt is no longer active.');
  }
  if (execution !== undefined && !sameExecution(attempt.execution, execution)) {
    throw new PublishingError('attempt_not_owned', 'The publishing attempt belongs to another execution.');
  }

  attempt.state = terminal.kind;
  attempt.terminal = terminal;
  return sealLedger(next);
}

export function markAttemptPublished(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
  execution: PublicExecutionIdentity,
  providerId: string,
  url: string,
  recordedAt: string,
): PublishingLedgerV1 {
  const record = ledger.records[recordKeyValue];
  if (record === undefined) throw new PublishingError('attempt_not_found', 'Publishing record was not found.');
  validatePublicPost(record.destination, providerId, url);
  requireTimestamp(recordedAt, '$.recordedAt');
  return terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, execution, {
    kind: 'published',
    providerId,
    url,
    recordedAt,
    resolution: 'provider',
  });
}

export function markAttemptRejected(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
  execution: PublicExecutionIdentity,
  retryEligible: boolean,
  recordedAt: string,
): PublishingLedgerV1 {
  requireTimestamp(recordedAt, '$.recordedAt');
  return terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, execution, {
    kind: 'rejected',
    retryEligible,
    recordedAt,
    resolution: 'provider',
  });
}

export function reconcileAttemptPublished(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
  providerId: string,
  url: string,
  recordedAt: string,
): PublishingLedgerV1 {
  const record = ledger.records[recordKeyValue];
  if (record === undefined) throw new PublishingError('attempt_not_found', 'Publishing record was not found.');
  validatePublicPost(record.destination, providerId, url);
  requireTimestamp(recordedAt, '$.recordedAt');
  return terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, undefined, {
    kind: 'published',
    providerId,
    url,
    recordedAt,
    resolution: 'operator_public_post',
  });
}

export function reconcileAttemptNonCreation(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
  recordedAt: string,
): PublishingLedgerV1 {
  requireTimestamp(recordedAt, '$.recordedAt');
  return terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, undefined, {
    kind: 'rejected',
    retryEligible: true,
    recordedAt,
    resolution: 'operator_non_creation',
  });
}

export function reviseRejectedPlan(
  ledger: PublishingLedgerV1,
  oldRecordKey: string,
  attemptNumber: number,
  attemptId: string,
  newPlanInput: RenderedDestinationPlan,
  execution: PublicExecutionIdentity,
  createdAt: string,
): PublishingLedgerV1 {
  const newPlan = validateRenderedPlan(newPlanInput);
  validateExecution(execution, '$.execution');
  requireTimestamp(createdAt, '$.createdAt');

  const currentRecord = ledger.records[oldRecordKey];
  if (currentRecord === undefined) throw new PublishingError('attempt_not_found', 'Publishing record was not found.');
  const attempt = currentRecord.attempts[attemptNumber - 1];
  if (attempt === undefined || attempt.attemptId !== attemptId) {
    throw new PublishingError('attempt_not_found', 'The exact rejected attempt was not found.');
  }
  if (attempt.state !== 'rejected' || currentRecord.attempts.at(-1)?.attemptId !== attemptId) {
    throw new PublishingError('revision_not_allowed', 'Only the latest definitively rejected attempt can be revised.');
  }

  if (recordKeyForPlan(newPlan) !== oldRecordKey) {
    throw new PublishingError(
      'revision_not_allowed',
      'A plan revision cannot change repository, release, destination, or target account identity.',
    );
  }
  if (newPlan.digest === attempt.payloadDigest) {
    throw new PublishingError('revision_not_allowed', 'A plan revision must bind to a different validated digest.');
  }
  if (currentRecord.revisions.some((revision) => revision.fromAttemptNumber === attemptNumber)) {
    throw new PublishingError('revision_not_allowed', 'This rejected attempt already has a plan revision.');
  }

  const { next, record } = mutableRecord(ledger, oldRecordKey);
  record.revisions.push({
    revisionNumber: record.revisions.length + 1,
    fromAttemptNumber: attemptNumber,
    fromDigest: attempt.payloadDigest,
    toDigest: newPlan.digest,
    createdAt,
    execution,
  });
  return sealLedger(next);
}

export function locateAttempt(
  ledger: PublishingLedgerV1,
  recordKeyValue: string,
  attemptNumber: number,
  attemptId: string,
): { record: DestinationRecord; attempt: PublishingAttempt } {
  const record = ledger.records[recordKeyValue];
  const attempt = record?.attempts[attemptNumber - 1];
  if (record === undefined || attempt === undefined || attempt.attemptId !== attemptId) {
    throw new PublishingError('attempt_not_found', 'The exact publishing attempt was not found.');
  }
  return { record, attempt };
}

export function validatePublicPost(destination: Destination, providerId: string, url: string): void {
  if (destination === 'x') {
    if (!/^\d+$/.test(providerId) || url !== `https://x.com/i/web/status/${providerId}`) {
      throw new PublishingError('invalid_reconciliation', 'X public post identity is not canonical.');
    }
    return;
  }

  if (
    !/^urn:li:(?:share|ugcPost):\d+$/.test(providerId) ||
    url !== `https://www.linkedin.com/feed/update/${providerId}`
  ) {
    throw new PublishingError('invalid_reconciliation', 'LinkedIn public post identity is not canonical.');
  }
}
