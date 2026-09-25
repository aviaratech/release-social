export { parseReleaseSocialConfig } from './core/config.js';
export { ReleaseSocialValidationError } from './core/errors.js';
export { parseReleaseNotes } from './core/release-notes.js';
export { createReleasePlan, validateRenderedPlan } from './core/render.js';
export { getSourceSkipReason, sourceIdentity, validateCanonicalSource } from './core/source.js';
export type {
  CanonicalReleaseSource,
  CanonicalSourceIdentity,
  Destination,
  LinkedInAccountIdentity,
  LinkedInDestinationConfig,
  ParsedReleaseNotes,
  ProviderAccountIdentity,
  ProviderPreflightResult,
  ProviderValidationResult,
  PublicationRejected,
  PublicationResult,
  PublicationPublished,
  PublicationUnknown,
  ReleasePlanReady,
  ReleasePlanResult,
  ReleasePlanSkipped,
  ReleaseSocialConfig,
  ReleaseSocialProvider,
  RenderedDestinationPlan,
  SkipReason,
  SourceVisibility,
  TextSource,
  TextVariant,
  XAccountIdentity,
  XDestinationConfig,
} from './core/types.js';
