export type PublishingErrorCode =
  | 'state_branch_missing'
  | 'state_branch_exists'
  | 'state_corrupt'
  | 'state_unsupported'
  | 'state_conflict'
  | 'state_uncertain'
  | 'record_identity_conflict'
  | 'attempt_unknown'
  | 'attempt_not_found'
  | 'attempt_not_owned'
  | 'attempt_already_terminal'
  | 'published_plan_changed'
  | 'plan_revision_required'
  | 'revision_not_allowed'
  | 'execution_not_quiescent'
  | 'invalid_reconciliation'
  | 'preflight_failed'
  | 'provider_missing';

export class PublishingError extends Error {
  readonly code: PublishingErrorCode;

  constructor(code: PublishingErrorCode, message: string) {
    super(message);
    this.name = 'PublishingError';
    this.code = code;
  }
}
