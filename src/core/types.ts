export const DESTINATIONS = ['x', 'linkedin'] as const;
export type Destination = (typeof DESTINATIONS)[number];

export const TEXT_VARIANTS = ['short', 'announcement'] as const;
export type TextVariant = (typeof TEXT_VARIANTS)[number];

export interface XDestinationConfig {
  accountId: string;
  text?: TextVariant;
}

export interface LinkedInDestinationConfig {
  author: string;
  apiVersion: string;
  text?: TextVariant;
}

export interface ReleaseSocialConfig {
  version: 1;
  destinations: {
    x?: XDestinationConfig;
    linkedin?: LinkedInDestinationConfig;
  };
}

export type SourceVisibility = 'public' | 'private' | 'internal';

export interface CanonicalReleaseSource {
  repositoryId: number;
  repository: string;
  releaseId: number;
  tag: string;
  releaseUrl: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  visibility: SourceVisibility;
}

export interface CanonicalSourceIdentity {
  repositoryId: number;
  repository: string;
  releaseId: number;
  tag: string;
  releaseUrl: string;
}

export interface ParsedReleaseNotes {
  announcement: string;
  short: string;
  overrides: Partial<Record<Destination, string>>;
  highlights: string;
  upgradeNotes: string;
  skip: boolean;
}

export interface XAccountIdentity {
  destination: 'x';
  accountId: string;
}

export interface LinkedInAccountIdentity {
  destination: 'linkedin';
  author: string;
  apiVersion: string;
}

export type ProviderAccountIdentity = XAccountIdentity | LinkedInAccountIdentity;

export type TextSource =
  | { kind: 'provider_override' }
  | { kind: 'configured_variant'; variant: TextVariant }
  | { kind: 'provider_default'; variant: TextVariant };

export interface RenderedDestinationPlan {
  version: 1;
  destination: Destination;
  account: ProviderAccountIdentity;
  textSource: TextSource;
  text: string;
  source: CanonicalSourceIdentity;
  digest: string;
}

export type SkipReason = 'draft_release' | 'prerelease_release' | 'source_not_public' | 'announcement_opt_out';

export interface ReleasePlanReady {
  status: 'ready';
  plans: readonly RenderedDestinationPlan[];
}

export interface ReleasePlanSkipped {
  status: 'skipped';
  reason: SkipReason;
}

export type ReleasePlanResult = ReleasePlanReady | ReleasePlanSkipped;

export interface ProviderValidationSuccess {
  ok: true;
}

export interface ProviderValidationFailure {
  ok: false;
  errors: readonly string[];
}

export type ProviderValidationResult = ProviderValidationSuccess | ProviderValidationFailure;

export interface ProviderPreflightReady {
  status: 'ready';
}

export interface ProviderPreflightRejected {
  status: 'rejected';
  reason: string;
  retryClassification: 'retryable' | 'permanent';
}

export type ProviderPreflightResult = ProviderPreflightReady | ProviderPreflightRejected;

export interface PublicationPublished {
  status: 'published';
  providerId: string;
  url: string;
}

export interface PublicationRejected {
  status: 'rejected';
  reason: string;
  retryClassification: 'retryable' | 'permanent';
}

export interface PublicationUnknown {
  status: 'unknown';
  reason: string;
}

export type PublicationResult = PublicationPublished | PublicationRejected | PublicationUnknown;

/**
 * Provider contract for real consumers. Implementations must keep prepare/validate pure,
 * make preflight read-only, and perform at most one publish request per publish call.
 * An unknown publish result must be reconciled by the caller before any retry.
 */
export interface ReleaseSocialProvider<Credentials, PreparedPayload> {
  readonly destination: Destination;
  prepare(plan: RenderedDestinationPlan): PreparedPayload;
  validate(payload: PreparedPayload): ProviderValidationResult;
  preflight(credentials: Credentials, payload: PreparedPayload): Promise<ProviderPreflightResult>;
  publish(credentials: Credentials, payload: PreparedPayload): Promise<PublicationResult>;
}
