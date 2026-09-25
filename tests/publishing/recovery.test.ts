import { describe, expect, it } from 'vitest';

import { createCliExecutionIdentity, findRecordForPlan, recordKeyForPlan } from '../../src/publishing/ledger.js';
import { publishRelease } from '../../src/publishing/publisher.js';
import {
  attemptLocator,
  reconcileNonCreationAttempt,
  reviseRejectedAttemptPlan,
} from '../../src/publishing/reconciliation.js';
import { createPlans, FakeProvider, FakeQuiescenceVerifier, fixedClock, MemoryStateRepository } from './helpers.js';

describe('separate-process interruption and resume', () => {
  it('treats a process death immediately after the pending checkpoint as uncertain on resume', async () => {
    const state = new MemoryStateRepository();
    const [plan] = createPlans({ includeX: false });
    if (plan === undefined) throw new Error('Missing LinkedIn plan.');

    const execution = createCliExecutionIdentity('10000000-0000-4000-8000-000000000010');
    const attemptId = '10000000-0000-4000-8000-000000000011';
    await state.transition(
      {
        id: createTransitionId(),
        kind: 'append_pending',
        at: fixedClock().now(),
        recordKey: recordKeyForPlan(plan),
        attemptId,
      },
      (current) => {
        const appended = appendPendingAttempt(current, plan, execution, attemptId, fixedClock().now());
        return { next: appended.ledger, value: undefined };
      },
    );

    // Simulate a new process: the original execution vanished before any provider POST.
    const provider = new FakeProvider({ destination: 'linkedin' });
    const resumed = await publishRelease({
      plans: [plan],
      providers: [provider],
      state,
      execution: createCliExecutionIdentity('10000000-0000-4000-8000-000000000012'),
      ...fixedClock(),
    });

    expect(resumed.results[0]?.status).toBe('unknown');
    expect(provider.preflightCount).toBe(0);
    expect(provider.publishCount).toBe(0);
  });

  it('skips success, stops on uncertain interruption, reconciles quiescent non-creation, and matches uninterrupted logical results', async () => {
    const state = new MemoryStateRepository();
    const plans = createPlans();
    const xProcess1 = new FakeProvider({ destination: 'x' });
    const linkedInProcess1 = new FakeProvider({
      destination: 'linkedin',
      publications: [new Error('synthetic process interruption after pending checkpoint')],
    });

    const first = await publishRelease({
      plans,
      providers: [xProcess1, linkedInProcess1],
      state,
      execution: createCliExecutionIdentity('10000000-0000-4000-8000-000000000001'),
      ...fixedClock(),
    });

    expect(first.results.map((item) => item.status)).toEqual(['published', 'unknown']);
    expect(xProcess1.publishCount).toBe(1);
    expect(linkedInProcess1.publishCount).toBe(1);

    const xProcess2 = new FakeProvider({ destination: 'x' });
    const linkedInProcess2 = new FakeProvider({ destination: 'linkedin' });
    const second = await publishRelease({
      plans,
      providers: [xProcess2, linkedInProcess2],
      state,
      execution: createCliExecutionIdentity('10000000-0000-4000-8000-000000000002'),
      ...fixedClock(),
    });

    expect(second.results[0]?.status).toBe('already_published');
    expect(second.results[1]?.status).toBe('unknown');
    expect(xProcess2.publishCount).toBe(0);
    expect(linkedInProcess2.publishCount).toBe(0);

    const linkedInPlan = plans.find((plan) => plan.destination === 'linkedin');
    if (linkedInPlan === undefined) throw new Error('Missing LinkedIn plan.');
    const ledger = await state.read();
    const linkedInRecord = findRecordForPlan(ledger, linkedInPlan);
    const interrupted = linkedInRecord?.attempts[0];
    if (linkedInRecord === undefined || interrupted === undefined) {
      throw new Error('Missing interrupted LinkedIn attempt.');
    }

    const verifier = new FakeQuiescenceVerifier();
    await reconcileNonCreationAttempt({
      state,
      verifier,
      attempt: attemptLocator(linkedInRecord.key, interrupted.attemptNumber, interrupted.attemptId),
      confirmedNonCreation: true,
      cliAttestation: { processStoppedAndRequestsSettled: true },
      ...fixedClock(),
    });

    const xProcess3 = new FakeProvider({ destination: 'x' });
    const linkedInProcess3 = new FakeProvider({ destination: 'linkedin' });
    const resumed = await publishRelease({
      plans,
      providers: [xProcess3, linkedInProcess3],
      state,
      execution: createCliExecutionIdentity('10000000-0000-4000-8000-000000000003'),
      ...fixedClock(),
    });

    expect(resumed.results.map((item) => item.status)).toEqual(['already_published', 'published']);
    expect(xProcess3.publishCount).toBe(0);
    expect(linkedInProcess3.publishCount).toBe(1);

    const uninterruptedState = new MemoryStateRepository();
    const uninterrupted = await publishRelease({
      plans,
      providers: [new FakeProvider({ destination: 'x' }), new FakeProvider({ destination: 'linkedin' })],
      state: uninterruptedState,
      execution: createCliExecutionIdentity('10000000-0000-4000-8000-000000000004'),
      ...fixedClock(),
    });

    expect(uninterrupted.results.map((item) => [item.destination, item.status, item.postUrl])).toEqual([
      ['x', 'published', resumed.results[0]?.postUrl],
      ['linkedin', 'published', resumed.results[1]?.postUrl],
    ]);
  });

  it('recovers a definitive LinkedIn rejection through explicit apiVersion plan revision without touching X success', async () => {
    const state = new MemoryStateRepository();
    const oldPlans = createPlans({ linkedInVersion: '202609' });
    const first = await publishRelease({
      plans: oldPlans,
      providers: [
        new FakeProvider({ destination: 'x' }),
        new FakeProvider({
          destination: 'linkedin',
          publications: [{ status: 'rejected', reason: 'unsupported version', retryClassification: 'permanent' }],
        }),
      ],
      state,
      execution: createCliExecutionIdentity('20000000-0000-4000-8000-000000000001'),
      ...fixedClock(),
    });
    expect(first.results.map((item) => item.status)).toEqual(['published', 'rejected']);

    const newPlans = createPlans({ linkedInVersion: '202610' });
    const linkedInNew = newPlans.find((plan) => plan.destination === 'linkedin');
    const linkedInOld = oldPlans.find((plan) => plan.destination === 'linkedin');
    if (linkedInNew === undefined || linkedInOld === undefined) throw new Error('Missing LinkedIn plans.');

    const blockedProvider = new FakeProvider({ destination: 'linkedin' });
    const blocked = await publishRelease({
      plans: newPlans,
      providers: [new FakeProvider({ destination: 'x' }), blockedProvider],
      state,
      execution: createCliExecutionIdentity('20000000-0000-4000-8000-000000000002'),
      ...fixedClock(),
    });
    expect(blocked.results[0]?.status).toBe('already_published');
    expect(blocked.results[1]?.status).toBe('blocked');
    expect(blockedProvider.publishCount).toBe(0);

    const ledger = await state.read();
    const record = findRecordForPlan(ledger, linkedInOld);
    const rejected = record?.attempts[0];
    if (record === undefined || rejected === undefined) throw new Error('Missing rejected attempt.');

    await reviseRejectedAttemptPlan({
      state,
      attempt: attemptLocator(record.key, rejected.attemptNumber, rejected.attemptId),
      newPlan: linkedInNew,
      execution: createCliExecutionIdentity('20000000-0000-4000-8000-000000000003'),
      confirmedRevision: true,
      ...fixedClock(),
    });

    const xRetry = new FakeProvider({ destination: 'x' });
    const linkedInRetry = new FakeProvider({ destination: 'linkedin' });
    const retried = await publishRelease({
      plans: newPlans,
      providers: [xRetry, linkedInRetry],
      state,
      execution: createCliExecutionIdentity('20000000-0000-4000-8000-000000000004'),
      ...fixedClock(),
    });

    expect(retried.results.map((item) => item.status)).toEqual(['already_published', 'published']);
    expect(xRetry.publishCount).toBe(0);
    expect(linkedInRetry.publishCount).toBe(1);

    const finalLedger = await state.read();
    const key = recordKeyForPlan(linkedInNew);
    expect(finalLedger.records[key]?.attempts).toHaveLength(2);
    expect(finalLedger.records[key]?.revisions).toHaveLength(1);
    expect(finalLedger.records[key]?.revisions[0]?.toDigest).toBe(linkedInNew.digest);
  });
});
