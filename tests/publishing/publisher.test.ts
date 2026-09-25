import { describe, expect, it } from 'vitest';

import {
  createCliExecutionIdentity,
  findRecordForPlan,
  locateAttempt,
  recordKeyForPlan,
} from '../../src/publishing/ledger.js';
import { publishRelease } from '../../src/publishing/publisher.js';
import { createPlans, FakeProvider, fixedClock, MemoryStateRepository } from './helpers.js';

describe('publishing orchestration', () => {
  it('preflights every destination before the first social POST', async () => {
    const calls: string[] = [];
    const state = new MemoryStateRepository();
    const plans = createPlans();
    const x = new FakeProvider({ destination: 'x', calls });
    const linkedin = new FakeProvider({ destination: 'linkedin', calls });
    const clock = fixedClock();

    const result = await publishRelease({
      plans,
      providers: [x, linkedin],
      state,
      execution: createCliExecutionIdentity('11111111-1111-4111-8111-111111111111'),
      ...clock,
    });

    expect(result.results.map((item) => item.status)).toEqual(['published', 'published']);
    const firstPublish = calls.findIndex((call) => call.endsWith(':publish'));
    expect(firstPublish).toBeGreaterThan(calls.indexOf('x:preflight'));
    expect(firstPublish).toBeGreaterThan(calls.indexOf('linkedin:preflight'));
    expect(x.publishCount).toBe(1);
    expect(linkedin.publishCount).toBe(1);
  });

  it('does not send any social POST if one selected destination fails preflight', async () => {
    const state = new MemoryStateRepository();
    const plans = createPlans();
    const x = new FakeProvider({ destination: 'x' });
    const linkedin = new FakeProvider({
      destination: 'linkedin',
      preflight: { status: 'rejected', reason: 'synthetic', retryClassification: 'permanent' },
    });

    const result = await publishRelease({
      plans,
      providers: [x, linkedin],
      state,
      execution: createCliExecutionIdentity('22222222-2222-4222-8222-222222222222'),
      ...fixedClock(),
    });

    expect(x.publishCount).toBe(0);
    expect(linkedin.publishCount).toBe(0);
    expect(result.results.every((item) => item.status === 'blocked')).toBe(true);
    expect(Object.keys((await state.read()).records)).toHaveLength(0);
  });

  it('persists partial success independently and skips it on rerun', async () => {
    const state = new MemoryStateRepository();
    const plans = createPlans();
    const x = new FakeProvider({ destination: 'x' });
    const linkedin = new FakeProvider({
      destination: 'linkedin',
      publications: [{ status: 'rejected', reason: 'synthetic non-creation', retryClassification: 'permanent' }],
    });

    const first = await publishRelease({
      plans,
      providers: [x, linkedin],
      state,
      execution: createCliExecutionIdentity('33333333-3333-4333-8333-333333333333'),
      ...fixedClock(),
    });
    expect(first.results.map((item) => item.status)).toEqual(['published', 'rejected']);

    const secondX = new FakeProvider({ destination: 'x' });
    const secondLinkedIn = new FakeProvider({ destination: 'linkedin' });
    const second = await publishRelease({
      plans,
      providers: [secondX, secondLinkedIn],
      state,
      execution: createCliExecutionIdentity('44444444-4444-4444-8444-444444444444'),
      ...fixedClock(),
    });

    expect(second.results[0]?.status).toBe('already_published');
    expect(secondX.publishCount).toBe(0);
    expect(secondLinkedIn.publishCount).toBe(0);
    expect(second.results[1]?.status).toBe('blocked');
  });

  it('leaves provider success uncertain when the outcome checkpoint cannot be proven', async () => {
    const state = new MemoryStateRepository();
    state.failBeforeKinds.add('record_published');
    const [xPlan] = createPlans({ includeLinkedIn: false });
    if (xPlan === undefined) throw new Error('Missing X plan.');
    const x = new FakeProvider({ destination: 'x' });

    const result = await publishRelease({
      plans: [xPlan],
      providers: [x],
      state,
      execution: createCliExecutionIdentity('55555555-5555-4555-8555-555555555555'),
      ...fixedClock(),
    });

    expect(x.publishCount).toBe(1);
    expect(result.results[0]?.status).toBe('unknown');

    const ledger = await state.read();
    const record = findRecordForPlan(ledger, xPlan);
    expect(record?.attempts[0]?.state).toBe('pending');

    const rerunProvider = new FakeProvider({ destination: 'x' });
    const rerun = await publishRelease({
      plans: [xPlan],
      providers: [rerunProvider],
      state,
      execution: createCliExecutionIdentity('66666666-6666-4666-8666-666666666666'),
      ...fixedClock(),
    });
    expect(rerun.results[0]?.status).toBe('unknown');
    expect(rerunProvider.publishCount).toBe(0);
  });

  it('blocks payload edits after a confirmed success instead of republishing', async () => {
    const state = new MemoryStateRepository();
    const [original] = createPlans({ includeLinkedIn: false, xText: 'Original X text.' });
    const [edited] = createPlans({ includeLinkedIn: false, xText: 'Edited X text.' });
    if (original === undefined || edited === undefined) throw new Error('Missing X plan.');

    await publishRelease({
      plans: [original],
      providers: [new FakeProvider({ destination: 'x' })],
      state,
      execution: createCliExecutionIdentity('77777777-7777-4777-8777-777777777777'),
      ...fixedClock(),
    });

    const provider = new FakeProvider({ destination: 'x' });
    const rerun = await publishRelease({
      plans: [edited],
      providers: [provider],
      state,
      execution: createCliExecutionIdentity('88888888-8888-4888-8888-888888888888'),
      ...fixedClock(),
    });

    expect(rerun.results[0]?.status).toBe('blocked');
    expect(rerun.results[0]?.events.some((item) => item.code === 'published_plan_changed')).toBe(true);
    expect(provider.publishCount).toBe(0);
  });

  it('blocks changing the target account after a destination already has history', async () => {
    const state = new MemoryStateRepository();
    const [original] = createPlans({ includeLinkedIn: false });
    const [changedAccount] = createPlans({
      includeLinkedIn: false,
      xAccountId: '999999999999999999',
    });
    if (original === undefined || changedAccount === undefined) throw new Error('Missing X plans.');

    await publishRelease({
      plans: [original],
      providers: [new FakeProvider({ destination: 'x' })],
      state,
      execution: createCliExecutionIdentity('dddddddd-dddd-4ddd-8ddd-dddddddddddd'),
      ...fixedClock(),
    });

    const provider = new FakeProvider({ destination: 'x' });
    const result = await publishRelease({
      plans: [changedAccount],
      providers: [provider],
      state,
      execution: createCliExecutionIdentity('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'),
      ...fixedClock(),
    });

    expect(result.results[0]?.status).toBe('blocked');
    expect(result.results[0]?.events.some((item) => item.code === 'record_identity_conflict')).toBe(true);
    expect(provider.publishCount).toBe(0);
  });

  it('allows a later-added destination without invalidating an existing success', async () => {
    const state = new MemoryStateRepository();
    const [xOnly] = createPlans({ includeLinkedIn: false });
    if (xOnly === undefined) throw new Error('Missing X plan.');

    await publishRelease({
      plans: [xOnly],
      providers: [new FakeProvider({ destination: 'x' })],
      state,
      execution: createCliExecutionIdentity('99999999-9999-4999-8999-999999999999'),
      ...fixedClock(),
    });

    const both = createPlans();
    const x = new FakeProvider({ destination: 'x' });
    const linkedin = new FakeProvider({ destination: 'linkedin' });
    const result = await publishRelease({
      plans: both,
      providers: [x, linkedin],
      state,
      execution: createCliExecutionIdentity('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
      ...fixedClock(),
    });

    expect(result.results.map((item) => item.status)).toEqual(['already_published', 'published']);
    expect(x.publishCount).toBe(0);
    expect(linkedin.publishCount).toBe(1);
  });

  it('works with immutable release fixtures because publication never mutates release assets or bodies', async () => {
    const state = new MemoryStateRepository();
    const plans = createPlans({ includeLinkedIn: false });
    const frozenPlans = Object.freeze(plans.map((plan) => Object.freeze(structuredClone(plan))));
    const provider = new FakeProvider({ destination: 'x' });

    const result = await publishRelease({
      plans: frozenPlans,
      providers: [provider],
      state,
      execution: createCliExecutionIdentity('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
      ...fixedClock(),
    });

    expect(result.results[0]?.status).toBe('published');
    const ledger = await state.read();
    const key = recordKeyForPlan(frozenPlans[0]!);
    const attempt = locateAttempt(ledger, key, 1, ledger.records[key]!.attempts[0]!.attemptId);
    expect(attempt.attempt.payloadDigest).toBe(frozenPlans[0]!.digest);
  });

  it('emits bounded stage metadata rather than provider diagnostics or secrets', async () => {
    const state = new MemoryStateRepository();
    const [xPlan] = createPlans({ includeLinkedIn: false });
    if (xPlan === undefined) throw new Error('Missing X plan.');
    const provider = new FakeProvider({
      destination: 'x',
      preflight: {
        status: 'rejected',
        reason: 'SECRET_TOKEN_SHOULD_NOT_ESCAPE',
        retryClassification: 'permanent',
      },
    });

    const result = await publishRelease({
      plans: [xPlan],
      providers: [provider],
      state,
      execution: createCliExecutionIdentity('cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
      ...fixedClock(),
    });

    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('SECRET_TOKEN_SHOULD_NOT_ESCAPE');
    for (const stage of result.results[0]?.events ?? []) {
      expect(stage.code?.length ?? 0).toBeLessThanOrEqual(80);
      expect(stage.durationMs).toBeLessThanOrEqual(86_400_000);
    }
  });
});
