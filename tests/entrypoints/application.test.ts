import { describe, expect, it } from 'vitest';

import {
  cliExecution,
  prepareRelease,
  publishPrepared,
  reconcileAttempt,
  reviseAttempt,
} from '../../src/cli/application.js';
import { findRecordForPlan, recordKeyForPlan } from '../../src/publishing/ledger.js';
import {
  createPlans,
  FakeProvider,
  FakeQuiescenceVerifier,
  LINKEDIN_AUTHOR,
  MemoryStateRepository,
  releaseSource,
  REPOSITORY,
  X_ACCOUNT_ID,
} from '../publishing/helpers.js';

const GENERATED = [
  "## What's Changed",
  '* Ship generated notes safely.',
  '* Preserve Unicode 🚀 and #reserved characters.',
].join('\n');

function config(destinations: 'x' | 'linkedin' | 'both', missingAuthored?: 'github-release-notes' | 'error' | 'skip') {
  return {
    version: 1,
    ...(missingAuthored === undefined ? {} : { content: { missingAuthored } }),
    destinations: {
      ...(destinations === 'linkedin' ? {} : { x: { accountId: X_ACCOUNT_ID } }),
      ...(destinations === 'x' ? {} : { linkedin: { author: LINKEDIN_AUTHOR, apiVersion: '202609' } }),
    },
  };
}

describe('shared entrypoint application', () => {
  it('previews X-only, LinkedIn-only, and both without provider credentials or network', () => {
    for (const selection of ['x', 'linkedin', 'both'] as const) {
      const prepared = prepareRelease(releaseSource(GENERATED), config(selection));
      expect(prepared.status).toBe('ready');
      expect(prepared.destinations.map((item) => item.destination)).toEqual(
        selection === 'x' ? ['x'] : selection === 'linkedin' ? ['linkedin'] : ['x', 'linkedin'],
      );
      expect(prepared.destinations.every((item) => item.validation.ok)).toBe(true);
      expect(prepared.destinations.every((item) => item.contentSource === 'github-release-notes')).toBe(true);
      expect(prepared.destinations.every((item) => item.text.endsWith('\n\n' + releaseSource('').releaseUrl))).toBe(
        true,
      );
    }
  });

  it('keeps empty and oversized generated-note fallback inside provider-pure budgets', () => {
    const empty = prepareRelease(releaseSource(''), config('both'));
    expect(empty.status).toBe('ready');
    expect(empty.destinations.every((item) => item.validation.ok)).toBe(true);
    expect(empty.destinations.every((item) => item.diagnostics.includes('omission_reason=empty_body'))).toBe(true);

    const oversized = prepareRelease(
      releaseSource(["## What's Changed", '* Short useful change.', '* ' + '#'.repeat(5000)].join('\n')),
      config('both'),
    );
    expect(oversized.status).toBe('ready');
    expect(oversized.destinations.every((item) => item.validation.ok)).toBe(true);
    expect(oversized.destinations.every((item) => item.diagnostics.includes('omission_reason=budget'))).toBe(true);
    expect(oversized.destinations.every((item) => item.text.endsWith('\n\n' + releaseSource('').releaseUrl))).toBe(true);
  });

  it('surfaces missing-authored fallback/error/skip, malformed authored notes, and ineligible releases', () => {
    expect(prepareRelease(releaseSource(GENERATED), config('x')).status).toBe('ready');
    expect(() => prepareRelease(releaseSource(GENERATED), config('x', 'error'))).toThrow();
    expect(prepareRelease(releaseSource(GENERATED), config('x', 'skip'))).toMatchObject({
      status: 'skipped',
      skipReason: 'authored_content_missing',
    });
    expect(() => prepareRelease(releaseSource('<!-- release-social:v1 -->\npartial'), config('x'))).toThrow();
    expect(prepareRelease({ ...releaseSource(GENERATED), draft: true }, config('x'))).toMatchObject({
      status: 'skipped',
      skipReason: 'draft_release',
    });
  });

  it('preserves partial success and retry behavior through the real publishing state machine', async () => {
    const state = new MemoryStateRepository();
    const source = releaseSource(
      [
        '<!-- release-social:v1 -->',
        '<!-- announcement:start -->',
        'Fictional announcement.',
        '<!-- announcement:end -->',
        '## Highlights',
        '- Synthetic.',
        '## Upgrade notes',
        'None.',
        '<!-- social:short',
        'Fictional X release.',
        '-->',
        '<!-- social:linkedin',
        'Fictional LinkedIn release.',
        '-->',
      ].join('\n'),
    );

    const first = await publishPrepared({
      source,
      config: config('both'),
      repository: REPOSITORY,
      githubToken: 'synthetic',
      execution: cliExecution('61000000-0000-4000-8000-000000000001'),
      state,
      bindings: [
        new FakeProvider({ destination: 'x' }),
        new FakeProvider({
          destination: 'linkedin',
          publications: [{ status: 'rejected', reason: 'version', retryClassification: 'retryable' }],
        }),
      ],
    });
    expect(first.aggregate).toBe('partial');
    expect(first.publications?.map((item) => item.status)).toEqual(['published', 'rejected']);

    const x = new FakeProvider({ destination: 'x' });
    const linkedin = new FakeProvider({ destination: 'linkedin' });
    const retried = await publishPrepared({
      source,
      config: config('both'),
      repository: REPOSITORY,
      githubToken: 'synthetic',
      execution: cliExecution('61000000-0000-4000-8000-000000000002'),
      state,
      bindings: [x, linkedin],
    });
    expect(retried.aggregate).toBe('success');
    expect(retried.publications?.map((item) => item.status)).toEqual(['already_published', 'published']);
    expect(x.publishCount).toBe(0);
    expect(linkedin.publishCount).toBe(1);
  });

  it('returns unknown after an ambiguous write and requires quiescent reconciliation before retry', async () => {
    const state = new MemoryStateRepository();
    const [plan] = createPlans({ includeLinkedIn: false });
    if (!plan) throw new Error('Missing plan.');

    const first = await publishPrepared({
      source: releaseSource(
        [
          '<!-- release-social:v1 -->',
          '<!-- announcement:start -->',
          'Fictional release announcement.',
          '<!-- announcement:end -->',
          '## Highlights',
          '- Synthetic.',
          '## Upgrade notes',
          'None.',
          '<!-- social:short',
          'Fictional X release.',
          '-->',
        ].join('\n'),
      ),
      config: config('x'),
      repository: REPOSITORY,
      githubToken: 'synthetic',
      execution: cliExecution('62000000-0000-4000-8000-000000000001'),
      state,
      bindings: [new FakeProvider({ destination: 'x', publications: [new Error('ambiguous transport')] })],
    });
    expect(first.aggregate).toBe('unknown');

    const ledger = await state.read();
    const record = findRecordForPlan(ledger, plan);
    const attempt = record?.attempts[0];
    if (!record || !attempt) throw new Error('Missing uncertain attempt.');

    const verifier = new FakeQuiescenceVerifier();
    await expect(
      reconcileAttempt({
        repository: REPOSITORY,
        githubToken: 'synthetic',
        recordKey: record.key,
        attemptNumber: attempt.attemptNumber,
        attemptId: attempt.attemptId,
        resolution: 'non-creation',
        cliSettled: false,
        state,
        verifier,
      }),
    ).rejects.toMatchObject({ code: 'execution_not_quiescent' });

    await reconcileAttempt({
      repository: REPOSITORY,
      githubToken: 'synthetic',
      recordKey: record.key,
      attemptNumber: attempt.attemptNumber,
      attemptId: attempt.attemptId,
      resolution: 'non-creation',
      cliSettled: true,
      state,
      verifier,
    });
    expect((await state.read()).records[record.key]?.attempts[0]?.state).toBe('rejected');
  });

  it('revises a definitively rejected config digest without changing account identity', async () => {
    const state = new MemoryStateRepository();
    const [oldPlan] = createPlans({ includeX: false, linkedInVersion: '202609' });
    const [newPlan] = createPlans({ includeX: false, linkedInVersion: '202610' });
    if (!oldPlan || !newPlan) throw new Error('Missing LinkedIn plans.');

    const first = await publishPrepared({
      source: releaseSource(
        [
          '<!-- release-social:v1 -->',
          '<!-- announcement:start -->',
          'Fictional release announcement.',
          '<!-- announcement:end -->',
          '## Highlights',
          '- Synthetic.',
          '## Upgrade notes',
          'None.',
          '<!-- social:short',
          'Unused.',
          '-->',
          '<!-- social:linkedin',
          'Fictional LinkedIn release.',
          '-->',
        ].join('\n'),
      ),
      config: { version: 1, destinations: { linkedin: { author: LINKEDIN_AUTHOR, apiVersion: '202609' } } },
      repository: REPOSITORY,
      githubToken: 'synthetic',
      execution: cliExecution('63000000-0000-4000-8000-000000000001'),
      state,
      bindings: [
        new FakeProvider({
          destination: 'linkedin',
          publications: [{ status: 'rejected', reason: 'unsupported version', retryClassification: 'permanent' }],
        }),
      ],
    });
    expect(first.aggregate).toBe('partial');

    const record = (await state.read()).records[recordKeyForPlan(oldPlan)];
    const attempt = record?.attempts[0];
    if (!record || !attempt) throw new Error('Missing rejected attempt.');

    await reviseAttempt({
      repository: REPOSITORY,
      githubToken: 'synthetic',
      recordKey: record.key,
      attemptNumber: attempt.attemptNumber,
      attemptId: attempt.attemptId,
      oldDigest: oldPlan.digest,
      newPlan,
      execution: cliExecution('63000000-0000-4000-8000-000000000002'),
      state,
    });

    expect((await state.read()).records[record.key]?.revisions[0]?.toDigest).toBe(newPlan.digest);
  });
});
