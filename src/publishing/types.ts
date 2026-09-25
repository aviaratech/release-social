import type {
  Destination,
  ProviderPreflightResult,
  ProviderValidationResult,
  PublicationResult,
  ReleaseSocialProvider,
  RenderedDestinationPlan,
} from '../core/types.js';

export const PUBLISHING_SCHEMA_VERSION = 1 as const;
export const PUBLISHING_IMPLEMENTATION_ID = 'release-social/publishing:v1' as const;
export const STATE_BRANCH = 'release-social-state' as const;
export const STATE_PATH = 'release-social-state-v1.json' as const;

export interface GitHubRunExecutionIdentity {
  kind: 'github_run';
  repository: string;
  runId: number;
  url: string;
}

export interface CliExecutionIdentity {
  kind: 'cli';
  invocationId: string;
}

export type PublicExecutionIdentity = GitHubRunExecutionIdentity | CliExecutionIdentity;

export type AttemptState = 'pending' | 'published' | 'rejected';

export interface PublishedTerminalState {
  kind: 'published';
  providerId: string;
  url: string;
  recordedAt: string;
  resolution: 'provider' | 'operator_public_post';
}

export interface RejectedTerminalState {
  kind: 'rejected';
  retryEligible: boolean;
  recordedAt: string;
  resolution: 'provider' | 'operator_non_creation';
}

export type TerminalState = PublishedTerminalState | RejectedTerminalState;

export interface PublishingAttempt {
  attemptNumber: number;
  attemptId: string;
  payloadDigest: string;
  schemaVersion: 1;
  implementationId: string;
  execution: PublicExecutionIdentity;
  startedAt: string;
  state: AttemptState;
  terminal?: TerminalState;
}

export interface PlanRevision {
  revisionNumber: number;
  fromAttemptNumber: number;
  fromDigest: string;
  toDigest: string;
  createdAt: string;
  execution: PublicExecutionIdentity;
}

export interface DestinationRecord {
  key: string;
  repositoryId: number;
  releaseId: number;
  repository: string;
  destination: Destination;
  accountIdentity: string;
  attempts: PublishingAttempt[];
  revisions: PlanRevision[];
}

export interface LedgerTransition {
  id: string;
  kind: string;
  at: string;
  recordKey?: string;
  attemptId?: string;
}

export interface PublishingLedgerV1 {
  schemaVersion: 1;
  implementationId: string;
  records: Record<string, DestinationRecord>;
  transitions: LedgerTransition[];
  checksum: string;
}

export interface StateTransitionMetadata {
  id: string;
  kind: string;
  at: string;
  recordKey?: string;
  attemptId?: string;
}

export interface StateMutation<T> {
  next: PublishingLedgerV1;
  value: T;
}

export interface PublishingStateRepository {
  read(): Promise<PublishingLedgerV1>;
  transition<T>(
    metadata: StateTransitionMetadata,
    apply: (current: PublishingLedgerV1) => StateMutation<T>,
  ): Promise<T>;
}

export interface BoundProvider {
  destination: Destination;
  prepare(plan: RenderedDestinationPlan): unknown;
  validate(payload: unknown): ProviderValidationResult;
  preflight(payload: unknown): Promise<ProviderPreflightResult>;
  publish(payload: unknown): Promise<PublicationResult>;
}

export interface PublisherBinding<Credentials, Payload> {
  provider: ReleaseSocialProvider<Credentials, Payload>;
  credentials: Credentials;
}

export interface StageEvent {
  stage: 'validate' | 'preflight' | 'pending' | 'ownership' | 'publish' | 'outcome';
  status: 'ok' | 'skipped' | 'blocked' | 'failed';
  durationMs: number;
  code?: string;
}

export type DestinationPublicationStatus = 'published' | 'already_published' | 'rejected' | 'unknown' | 'blocked';

export interface DestinationPublicationResult {
  destination: Destination;
  status: DestinationPublicationStatus;
  postId?: string;
  postUrl?: string;
  attemptNumber?: number;
  attemptId?: string;
  events: StageEvent[];
}

export interface PublishReleaseResult {
  results: DestinationPublicationResult[];
}

export interface AttemptLocator {
  recordKey: string;
  attemptNumber: number;
  attemptId: string;
}

export interface ExecutionQuiescenceVerifier {
  verify(
    execution: PublicExecutionIdentity,
    cliAttestation?: { processStoppedAndRequestsSettled: true },
  ): Promise<void>;
}
