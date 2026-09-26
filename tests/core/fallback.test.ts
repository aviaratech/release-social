import { describe, expect, it } from 'vitest';

import {
  ReleaseSocialValidationError,
  createReleasePlan,
  measureLinkedInText,
  measureXText,
  validateRenderedPlan,
  type CanonicalReleaseSource,
} from '../../src/index.js';
import { createLinkedInProvider } from '../../src/providers/linkedin/index.js';
import { createXProvider } from '../../src/providers/x/index.js';

const RELEASE_URL = 'https://github.com/fictional/example-release-app/releases/tag/v1.2.3';

const AUTHORED_BODY = [
  '<!-- release-social:v1 -->',
  '',
  '<!-- announcement:start -->',
  'Release Social now produces deterministic release announcement plans.',
  '<!-- announcement:end -->',
  '',
  '## Highlights',
  '- Added strict release-note and configuration validation.',
  '',
  '## Upgrade notes',
  'No breaking changes.',
  '',
  '<!-- social:short',
  'Deterministic release announcement planning is ready.',
  '-->',
  '',
].join('\n');

const GENERATED_BODY = [
  "## What's Changed",
  '* Add **fast mode** by @alice in https://github.com/fictional/example-release-app/pull/10',
  '* Support [Unicode 🚀](https://example.com/docs) and notify @release-team safely.',
  '',
  '### Fixes',
  '* Preserve deterministic ordering.',
  '',
  '<!-- hidden provider metadata -->',
  '<script>alert("not social copy")</script>',
  '',
  '```sh',
  'curl https://example.com/should-not-appear',
  '```',
  '',
  '## New Contributors',
  '* @bob made their first contribution in https://github.com/fictional/example-release-app/pull/11',
  '',
  '**Full Changelog**: https://github.com/fictional/example-release-app/compare/v1.2.2...v1.2.3',
].join('\n');

function source(
  body: string = GENERATED_BODY,
  overrides: Partial<CanonicalReleaseSource> = {},
): CanonicalReleaseSource {
  return {
    repositoryId: 424242,
    repository: 'fictional/example-release-app',
    releaseId: 515151,
    tag: 'v1.2.3',
    releaseUrl: RELEASE_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
    ...overrides,
  };
}

function bothConfig(content?: { missingAuthored: 'github-release-notes' | 'error' | 'skip' }) {
  return {
    version: 1,
    ...(content === undefined ? {} : { content }),
    destinations: {
      x: { accountId: '123456789012345678' },
      linkedin: { author: 'urn:li:person:FictionalPerson123', apiVersion: '202609' },
    },
  };
}

function expectCode(run: () => unknown, code: string): void {
  try {
    run();
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(ReleaseSocialValidationError);
    if (!(error instanceof ReleaseSocialValidationError)) throw error;
    expect(error.issues.some((issue) => issue.code === code)).toBe(true);
    return;
  }
  throw new Error('Expected validation error: ' + code);
}

describe('GitHub release-note fallback selection', () => {
  it('uses deterministic GitHub release-note fallback by default and strips unsafe boilerplate', () => {
    const result = createReleasePlan(source(), bothConfig());
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;

    const x = result.plans.find((plan) => plan.destination === 'x');
    const linkedin = result.plans.find((plan) => plan.destination === 'linkedin');
    expect(x?.textSource.kind).toBe('github_release_notes');
    expect(linkedin?.textSource.kind).toBe('github_release_notes');

    expect(x?.text).toContain('fictional/example-release-app v1.2.3 is available.');
    expect(x?.text).toContain('Add fast mode');
    expect(x?.text).not.toContain('@alice');
    expect(x?.text).not.toContain('@release-team');
    expect(x?.text).not.toContain('example.com/docs');
    expect(x?.text).not.toContain('curl');
    expect(x?.text).not.toContain('alert(');
    expect(x?.text).not.toContain('New Contributors');
    expect(x?.text).not.toContain('Full Changelog');
    expect(x?.text.endsWith('\n\n' + RELEASE_URL)).toBe(true);
    if (x === undefined || linkedin === undefined) throw new Error('Missing fallback plans.');
    expect(validateRenderedPlan(x)).toEqual(x);
    expect(validateRenderedPlan(linkedin)).toEqual(linkedin);
  });

  it('supports explicit strict/error and typed skip modes for missing authored content', () => {
    expectCode(() => createReleasePlan(source(), bothConfig({ missingAuthored: 'error' })), 'authored_content_missing');
    expect(createReleasePlan(source(), bothConfig({ missingAuthored: 'skip' }))).toEqual({
      status: 'skipped',
      reason: 'authored_content_missing',
    });
  });

  it('honors a standalone opt-out in ordinary notes before fallback selection', () => {
    const body = ['Ordinary generated notes.', '', '<!-- social:skip -->'].join('\n');
    expect(createReleasePlan(source(body), bothConfig())).toEqual({
      status: 'skipped',
      reason: 'announcement_opt_out',
    });
  });

  it('treats partial, malformed, unsupported, and fenced authored markers as errors rather than fallback', () => {
    expectCode(
      () => createReleasePlan(source('<!-- release-social:v1 -->\nPartial authored body.'), bothConfig()),
      'announcement_marker_count',
    );
    expectCode(
      () => createReleasePlan(source('Ordinary body.\n<!-- social:threads -->'), bothConfig()),
      'missing_version_marker',
    );
    expectCode(
      () =>
        createReleasePlan(source(['Ordinary body.', '```md', '<!-- social:skip -->', '```'].join('\n')), bothConfig()),
      'marker_in_fence',
    );
    expectCode(() => createReleasePlan(source('Ordinary body.\n<!-- social:skip'), bothConfig()), 'malformed_comment');
  });

  it('preserves source eligibility ahead of authored-content inspection', () => {
    expect(createReleasePlan(source('<!-- malformed reserved marker', { draft: true }), bothConfig())).toEqual({
      status: 'skipped',
      reason: 'draft_release',
    });
    expect(createReleasePlan(source(GENERATED_BODY, { prerelease: true }), bothConfig())).toEqual({
      status: 'skipped',
      reason: 'prerelease_release',
    });
    expect(createReleasePlan(source(GENERATED_BODY, { visibility: 'private' }), bothConfig())).toEqual({
      status: 'skipped',
      reason: 'source_not_public',
    });
  });

  it('still rejects zero configured destinations and invalid missing-authored values', () => {
    expectCode(() => createReleasePlan(source(), { version: 1, destinations: {} }), 'empty_destinations');
    expectCode(
      () =>
        createReleasePlan(source(), {
          version: 1,
          content: { missingAuthored: 'invent' },
          destinations: { x: { accountId: '123' } },
        }),
      'invalid_missing_authored_mode',
    );
  });
});

describe('fallback rendering and digest stability', () => {
  it('keeps existing authored bytes and digest stable when the fallback option is added', () => {
    const withoutContent = createReleasePlan(source(AUTHORED_BODY), {
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });
    const withContent = createReleasePlan(source(AUTHORED_BODY), {
      version: 1,
      content: { missingAuthored: 'github-release-notes' },
      destinations: { x: { accountId: '123456789012345678' } },
    });
    expect(withoutContent).toEqual(withContent);
    expect(withoutContent.status).toBe('ready');
    if (withoutContent.status !== 'ready') return;
    expect(withoutContent.plans[0]?.digest).toBe('b0f3aa306cbe2f04f71c7f625fc1b91a82520c54e85e92bbece21053cb931dfd');
  });

  it('changes a fallback digest when source content changes but not when another destination is added', () => {
    const xOnly = createReleasePlan(source("## What's Changed\n* First change."), {
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });
    const both = createReleasePlan(source("## What's Changed\n* First change."), bothConfig());
    const changed = createReleasePlan(source("## What's Changed\n* First change.\n* Second change."), {
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });

    expect(xOnly.status).toBe('ready');
    expect(both.status).toBe('ready');
    expect(changed.status).toBe('ready');
    if (xOnly.status !== 'ready' || both.status !== 'ready' || changed.status !== 'ready') return;

    const xBoth = both.plans.find((plan) => plan.destination === 'x');
    expect(xOnly.plans[0]?.digest).toBe(xBoth?.digest);
    expect(changed.plans[0]?.digest).not.toBe(xOnly.plans[0]?.digest);
  });

  it('emits metadata-only copy and an explicit diagnostic for empty or unusable bodies', () => {
    for (const body of [
      '',
      '## New Contributors\n* @user made their first contribution in https://github.com/a/b/pull/1',
    ]) {
      const result = createReleasePlan(source(body), {
        version: 1,
        destinations: { x: { accountId: '123456789012345678' } },
      });
      expect(result.status).toBe('ready');
      if (result.status !== 'ready') continue;

      const plan = result.plans[0];
      expect(plan?.text).toBe('fictional/example-release-app v1.2.3 is available.\n\n' + RELEASE_URL);
      expect(plan?.textSource.kind).toBe('github_release_notes');
      if (plan?.textSource.kind !== 'github_release_notes') continue;
      expect(['empty_body', 'no_useful_content']).toContain(plan.textSource.omissionReason);
    }
  });

  it('uses whole entries and records deterministic budget omissions for long GitHub notes', () => {
    const longEntry = 'A'.repeat(600);
    const result = createReleasePlan(
      source(["## What's Changed", '* Short useful change.', '* ' + longEntry, '* Another short change.'].join('\n')),
      {
        version: 1,
        destinations: { x: { accountId: '123456789012345678' } },
      },
    );
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;

    const plan = result.plans[0];
    expect(plan?.text).toContain('Short useful change.');
    expect(plan?.text).toContain('Another short change.');
    expect(plan?.text).not.toContain(longEntry);
    expect(plan?.textSource.kind).toBe('github_release_notes');
    if (plan?.textSource.kind !== 'github_release_notes') return;
    expect(plan.textSource.omittedEntries).toBe(1);
    expect(plan.textSource.omissionReason).toBe('budget');
  });

  it('fits fallback output using the same pure rules consumed by the real providers', () => {
    const body = [
      "## What's Changed",
      '* Ship Unicode 🚀 and literal #tags (without social mentions).',
      '* ' + '#'.repeat(1501),
    ].join('\n');
    const result = createReleasePlan(source(body), bothConfig());
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;

    const xPlan = result.plans.find((plan) => plan.destination === 'x');
    const linkedInPlan = result.plans.find((plan) => plan.destination === 'linkedin');
    if (xPlan === undefined || linkedInPlan === undefined) throw new Error('Missing fallback plans.');

    expect(measureXText(xPlan.text).valid).toBe(true);
    expect(measureLinkedInText(linkedInPlan.text).valid).toBe(true);

    const xProvider = createXProvider();
    const xPayload = xProvider.prepare(xPlan);
    expect(xProvider.validate(xPayload)).toEqual({ ok: true });
    expect(xProvider.validate({ ...xPayload, text: 'x'.repeat(281) }).ok).toBe(false);

    const linkedInProvider = createLinkedInProvider();
    const linkedInPayload = linkedInProvider.prepare(linkedInPlan);
    expect(linkedInProvider.validate(linkedInPayload)).toEqual({ ok: true });
  });
});
