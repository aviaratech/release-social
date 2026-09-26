export { parseReleaseSocialConfig } from './core/config.js';
export { ReleaseSocialValidationError } from './core/errors.js';
export { inspectReleaseNotesContent, parseReleaseNotes } from './core/release-notes.js';
export { createReleasePlan, validateRenderedPlan } from './core/render.js';
export {
  destinationTextFits,
  escapeLinkedInCommentary,
  linkedInCharacterLength,
  measureLinkedInText,
  measureXText,
  LINKEDIN_COMMENTARY_MAX_CHARACTERS,
  X_MAX_WEIGHTED_LENGTH,
} from './core/platform-text.js';
export { getSourceSkipReason, sourceIdentity, validateCanonicalSource } from './core/source.js';
export type {
  CanonicalReleaseSource,
  CanonicalSourceIdentity,
  Destination,
  FallbackOmissionReason,
  GitHubReleaseNotesTextSource,
  LinkedInAccountIdentity,
  LinkedInDestinationConfig,
  MissingAuthoredMode,
  ParsedReleaseNotes,
  ProviderAccountIdentity,
  ProviderPreflightResult,
  ProviderValidationResult,
  PublicationRejected,
  PublicationResult,
  PublicationPublished,
  PublicationUnknown,
  ReleaseContentConfig,
  ReleasePlanReady,
  ReleasePlanResult,
  ReleasePlanSkipped,
  ReleaseSocialConfig,
  ReleaseSocialProvider,
  RenderedDestinationPlan,
  RuntimeProviderIdentities,
  SkipReason,
  SourceVisibility,
  TextSource,
  TextVariant,
  XAccountIdentity,
  XDestinationConfig,
} from './core/types.js';
