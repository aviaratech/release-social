import { describe, expect, it } from 'vitest';

import { PublishingError } from '../../src/publishing/errors.js';
import {
  appendPendingAttempt,
  createCliExecutionIdentity,
  createTransitionId,
  markAttemptPublished,
  recordKeyForPlan,
  requireOwnedPendingAttempt,
} from '../../src/publishing/ledger.js';
import {
  attemptLocator,
  reconcileNonCreationAttempt,
  reconcilePublishedAttempt,
  reviseRejectedAttemptPlan,
} from '../../src/publishing/reconciliation.js';
import { createPlans, FakeQuiescenceVerifier, fixedClock, MemoryStateRepository } from './helpers.js';

async function createPendingAttempt(state: MemoryStateRepository) {
  const [plan] = createPlans({ includeLinkedIn: false });
  if (plan === undefined) throw new Error('Missing X plan.');
  const execution = createCliExecutionIdentity('30000000-0000-4000-8000-000000000001');
  const clock = fixedClock();
  const attemptId = '30000000-0000-4000-8000-000000000002';
  const key = recordKeyForPlan(plan);
  const attempt = await state.transition(
    {
      id: createTransitionId(),
      kind: 'append_pending',
      at: clock.now(),
      recordKey: key,
      attemptId,
    },
    (current) => {
      const appended = appendPendingAttempt(current, plan, execution, attemptId, clock.now());
      return { next: appended.ledger, value: appended.attempt };
    },
  );
  return { plan, execution, attempt, key, clock };
}

describe('exact-attempt reconciliation and races', () => {
  it('rejects non-creation reconciliation while the originating publisher is not quiescent', async () => {
    const state = new MemoryStateRepository();
    const pending = await createPendingAttempt(state);
    const verifier = new FakeQuiescenceVerifier();
    verifier.active = true;

    await expect(
      reconcileNonCreationAttempt({
        state,
        verifier,
        attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
        confirmedNonCreation: true,
        cliAttestation: { processStoppedAndRequestsSettled: true },
        ...fixedClock(),
      }),
    ).rejects.toMatchObject({ code: 'execution_not_quiescent' });

    expect((await state.read()).records[pending.key]?.attempts[0]?.state).toBe('pending');
  });

  it('prevents a resumed stale writer and rejects a late incompatible success after non-creation resolution', async () => {
    const state = new MemoryStateRepository();
    const pending = await createPendingAttempt(state);
    const verifier = new FakeQuiescenceVerifier();

    await reconcileNonCreationAttempt({
      state,
      verifier,
      attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
      confirmedNonCreation: true,
      cliAttestation: { processStoppedAndRequestsSettled: true },
      ...fixedClock(),
    });

    const ledger = await state.read();
    expect(() =>
      requireOwnedPendingAttempt(
        ledger,
        pending.key,
        pending.attempt.attemptNumber,
        pending.attempt.attemptId,
        pending.execution,
      ),
    ).toThrow(PublishingError);

    expect(() =>
      markAttemptPublished(
        ledger,
        pending.key,
        pending.attempt.attemptNumber,
        pending.attempt.attemptId,
        pending.execution,
        '987654321098765432',
        'https://x.com/i/web/status/987654321098765432',
        fixedClock().now(),
      ),
    ).toThrow(PublishingError);
  });

  it('records an operator-confirmed public post and rejects contradictory later resolution', async () => {
    const state = new MemoryStateRepository();
    const pending = await createPendingAttempt(state);
    const verifier = new FakeQuiescenceVerifier();

    await reconcilePublishedAttempt({
      state,
      verifier,
      attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
      providerId: '987654321098765432',
      url: 'https://x.com/i/web/status/987654321098765432',
      confirmedPublicPost: true,
      cliAttestation: { processStoppedAndRequestsSettled: true },
      ...fixedClock(),
    });

    const afterPublished = await state.read();
    expect(afterPublished.records[pending.key]?.attempts[0]?.state).toBe('published');

    await expect(
      reconcileNonCreationAttempt({
        state,
        verifier,
        attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
        confirmedNonCreation: true,
        cliAttestation: { processStoppedAndRequestsSettled: true },
        ...fixedClock(),
      }),
    ).rejects.toMatchObject({ code: 'attempt_already_terminal' });
  });

  it('rejects reconciliation for the wrong attempt and invalid public URLs', async () => {
    const state = new MemoryStateRepository();
    const pending = await createPendingAttempt(state);
    const verifier = new FakeQuiescenceVerifier();

    await expect(
      reconcilePublishedAttempt({
        state,
        verifier,
        attempt: attemptLocator(pending.key, 99, pending.attempt.attemptId),
        providerId: '987654321098765432',
        url: 'https://x.com/i/web/status/987654321098765432',
        confirmedPublicPost: true,
        cliAttestation: { processStoppedAndRequestsSettled: true },
        ...fixedClock(),
      }),
    ).rejects.toMatchObject({ code: 'attempt_not_found' });

    await expect(
      reconcilePublishedAttempt({
        state,
        verifier,
        attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
        providerId: '987654321098765432',
        url: 'https://example.com/not-the-post',
        confirmedPublicPost: true,
        cliAttestation: { processStoppedAndRequestsSettled: true },
        ...fixedClock(),
      }),
    ).rejects.toMatchObject({ code: 'invalid_reconciliation' });
  });

  it('does not allow plan revision for pending or successful attempts, account changes, or duplicate revisions', async () => {
    const state = new MemoryStateRepository();
    const pending = await createPendingAttempt(state);
    const [, linkedIn] = createPlans();
    if (linkedIn === undefined) throw new Error('Missing LinkedIn plan.');

    await expect(
      reviseRejectedAttemptPlan({
        state,
        attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
        newPlan: pending.plan,
        execution: createCliExecutionIdentity('30000000-0000-4000-8000-000000000003'),
        confirmedRevision: true,
        ...fixedClock(),
      }),
    ).rejects.toMatchObject({ code: 'revision_not_allowed' });

    await expect(
      reviseRejectedAttemptPlan({
        state,
        attempt: attemptLocator(pending.key, pending.attempt.attemptNumber, pending.attempt.attemptId),
        newPlan: linkedIn,
        execution: createCliExecutionIdentity('30000000-0000-4000-8000-000000000004'),
        confirmedRevision: true,
        ...fixedClock(),
      }),
    ).rejects.toBeInstanceOf(PublishingError);
  });
});
