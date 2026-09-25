import { validateRenderedPlan } from '../core/render.js';
import type { RenderedDestinationPlan } from '../core/types.js';
import { PublishingError } from './errors.js';
import {
  createTransitionId,
  locateAttempt,
  reconcileAttemptNonCreation,
  reconcileAttemptPublished,
  reviseRejectedPlan,
} from './ledger.js';
import type {
  AttemptLocator,
  ExecutionQuiescenceVerifier,
  PublicExecutionIdentity,
  PublishingStateRepository,
} from './types.js';

export interface ReconcilePublishedOptions {
  state: PublishingStateRepository;
  verifier: ExecutionQuiescenceVerifier;
  attempt: AttemptLocator;
  providerId: string;
  url: string;
  confirmedPublicPost: true;
  cliAttestation?: { processStoppedAndRequestsSettled: true };
  now?: () => string;
}

export interface ReconcileNonCreationOptions {
  state: PublishingStateRepository;
  verifier: ExecutionQuiescenceVerifier;
  attempt: AttemptLocator;
  confirmedNonCreation: true;
  cliAttestation?: { processStoppedAndRequestsSettled: true };
  now?: () => string;
}

export interface RevisePlanOptions {
  state: PublishingStateRepository;
  attempt: AttemptLocator;
  newPlan: RenderedDestinationPlan;
  execution: PublicExecutionIdentity;
  confirmedRevision: true;
  now?: () => string;
}

export async function reconcilePublishedAttempt(options: ReconcilePublishedOptions): Promise<void> {
  if (options.confirmedPublicPost !== true) {
    throw new PublishingError('invalid_reconciliation', 'Public-post reconciliation requires explicit confirmation.');
  }

  const now = options.now ?? (() => new Date().toISOString());
  const before = await options.state.read();
  const located = locateAttempt(
    before,
    options.attempt.recordKey,
    options.attempt.attemptNumber,
    options.attempt.attemptId,
  );
  if (located.attempt.state !== 'pending') {
    throw new PublishingError('attempt_already_terminal', 'Only a pending uncertain attempt can be reconciled.');
  }

  await options.verifier.verify(located.attempt.execution, options.cliAttestation);

  await options.state.transition(
    {
      id: createTransitionId(),
      kind: 'reconcile_published',
      at: now(),
      recordKey: options.attempt.recordKey,
      attemptId: options.attempt.attemptId,
    },
    (current) => {
      const currentAttempt = locateAttempt(
        current,
        options.attempt.recordKey,
        options.attempt.attemptNumber,
        options.attempt.attemptId,
      ).attempt;
      if (currentAttempt.state !== 'pending') {
        throw new PublishingError(
          'attempt_already_terminal',
          'The attempt changed while reconciliation was being verified.',
        );
      }
      return {
        next: reconcileAttemptPublished(
          current,
          options.attempt.recordKey,
          options.attempt.attemptNumber,
          options.attempt.attemptId,
          options.providerId,
          options.url,
          now(),
        ),
        value: undefined,
      };
    },
  );
}

export async function reconcileNonCreationAttempt(options: ReconcileNonCreationOptions): Promise<void> {
  if (options.confirmedNonCreation !== true) {
    throw new PublishingError('invalid_reconciliation', 'Non-creation reconciliation requires explicit confirmation.');
  }

  const now = options.now ?? (() => new Date().toISOString());
  const before = await options.state.read();
  const located = locateAttempt(
    before,
    options.attempt.recordKey,
    options.attempt.attemptNumber,
    options.attempt.attemptId,
  );
  if (located.attempt.state !== 'pending') {
    throw new PublishingError('attempt_already_terminal', 'Only a pending uncertain attempt can be reconciled.');
  }

  await options.verifier.verify(located.attempt.execution, options.cliAttestation);

  await options.state.transition(
    {
      id: createTransitionId(),
      kind: 'reconcile_non_creation',
      at: now(),
      recordKey: options.attempt.recordKey,
      attemptId: options.attempt.attemptId,
    },
    (current) => {
      const currentAttempt = locateAttempt(
        current,
        options.attempt.recordKey,
        options.attempt.attemptNumber,
        options.attempt.attemptId,
      ).attempt;
      if (currentAttempt.state !== 'pending') {
        throw new PublishingError(
          'attempt_already_terminal',
          'The attempt changed while reconciliation was being verified.',
        );
      }
      return {
        next: reconcileAttemptNonCreation(
          current,
          options.attempt.recordKey,
          options.attempt.attemptNumber,
          options.attempt.attemptId,
          now(),
        ),
        value: undefined,
      };
    },
  );
}

export async function reviseRejectedAttemptPlan(options: RevisePlanOptions): Promise<void> {
  if (options.confirmedRevision !== true) {
    throw new PublishingError('revision_not_allowed', 'Plan revision requires explicit operator confirmation.');
  }

  const now = options.now ?? (() => new Date().toISOString());
  const plan = validateRenderedPlan(options.newPlan);

  await options.state.transition(
    {
      id: createTransitionId(),
      kind: 'revise_plan',
      at: now(),
      recordKey: options.attempt.recordKey,
      attemptId: options.attempt.attemptId,
    },
    (current) => ({
      next: reviseRejectedPlan(
        current,
        options.attempt.recordKey,
        options.attempt.attemptNumber,
        options.attempt.attemptId,
        plan,
        options.execution,
        now(),
      ),
      value: undefined,
    }),
  );
}

export function attemptLocator(
  recordKey: string,
  attemptNumber: number,
  attemptId: string,
): AttemptLocator {
  return { recordKey, attemptNumber, attemptId };
}
