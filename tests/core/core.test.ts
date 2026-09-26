import { describe, expect, it } from 'vitest';

import {
  ReleaseSocialValidationError,
  createReleasePlan,
  parseReleaseNotes,
  parseReleaseSocialConfig,
  validateCanonicalSource,
  validateRenderedPlan,
  type CanonicalReleaseSource,
} from '../../src/index.js';

const BASE_BODY = [
  '<!-- release-social:v1 -->',
  '',
  '<!-- announcement:start -->',
  'Release Social now produces deterministic release announcement plans.',
  '<!-- announcement:end -->',
  '',
  '## Highlights',
  '- Added strict release-note and configuration validation.',
  '- Added deterministic per-destination planning.',
  '',
  '## Upgrade notes',
  'No breaking changes.',
  '',
  '<!-- social:short',
  'Deterministic release announcement planning is ready.',
  '-->',
  '',
].join('\n');

function source(overrides: Partial<CanonicalReleaseSource> = {}): CanonicalReleaseSource {
  return {
    repositoryId: 424242,
    repository: 'fictional/example-release-app',
    releaseId: 515151,
    tag: 'v1.2.3',
    releaseUrl: 'https://github.com/fictional/example-release-app/releases/tag/v1.2.3',
    body: BASE_BODY,
    draft: false,
    prerelease: false,
    visibility: 'public',
    ...overrides,
  };
}

function bothDestinations(): unknown {
  return {
    version: 1,
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

describe('release-note contract', () => {
  it('parses the required visible and hidden variants', () => {
    const notes = parseReleaseNotes(BASE_BODY);
    expect(notes.announcement).toBe('Release Social now produces deterministic release announcement plans.');
    expect(notes.short).toBe('Deterministic release announcement planning is ready.');
    expect(notes.highlights).toContain('strict release-note');
    expect(notes.upgradeNotes).toBe('No breaking changes.');
    expect(notes.skip).toBe(false);
  });

  it('rejects malformed, duplicate, nested, unsupported, and fenced reserved markers', () => {
    expectCode(
      () => parseReleaseNotes(BASE_BODY.replace('<!-- social:short', '<!-- social:threads')),
      'unsupported_reserved_marker',
    );

    expectCode(() => parseReleaseNotes(BASE_BODY + '\n<!-- social:short\nDuplicate.\n-->\n'), 'duplicate_social_block');

    expectCode(
      () =>
        parseReleaseNotes(BASE_BODY.replace('No breaking changes.', '<!-- social:x\nNested <!-- social:skip -->\n-->')),
      'malformed_comment',
    );

    const fenced = BASE_BODY.replace(
      'No breaking changes.',
      ['No breaking changes.', '', '~~~md', '<!-- social:x', 'Example only.', '-->', '~~~'].join('\n'),
    );
    expectCode(() => parseReleaseNotes(fenced), 'marker_in_fence');
  });

  it('requires one plain-text announcement paragraph and visible non-empty sections', () => {
    expectCode(
      () =>
        parseReleaseNotes(
          BASE_BODY.replace(
            'Release Social now produces deterministic release announcement plans.',
            'First paragraph.\n\nSecond paragraph.',
          ),
        ),
      'multiple_paragraphs',
    );
    expectCode(() => parseReleaseNotes(BASE_BODY.replace('## Highlights', '## Other')), 'highlights_section_count');
    expectCode(() => parseReleaseNotes(BASE_BODY.replace('No breaking changes.', '')), 'empty_upgrade_notes');
  });
});

describe('configuration contract', () => {
  it('accepts valid variants and rejects unknown config, secrets, providers, and empty destinations', () => {
    expect(
      parseReleaseSocialConfig({
        version: 1,
        destinations: {
          x: { accountId: '987654321', text: 'announcement' },
          linkedin: {
            author: 'urn:li:person:FictionalPerson987',
            apiVersion: '202612',
            text: 'short',
          },
        },
      }),
    ).toEqual({
      version: 1,
      destinations: {
        x: { accountId: '987654321', text: 'announcement' },
        linkedin: {
          author: 'urn:li:person:FictionalPerson987',
          apiVersion: '202612',
          text: 'short',
        },
      },
    });

    expectCode(() => parseReleaseSocialConfig({ version: 1, destinations: {} }), 'empty_destinations');
    expectCode(() => parseReleaseSocialConfig({ version: 1, destinations: { bluesky: {} } }), 'unknown_field');
    expectCode(
      () =>
        parseReleaseSocialConfig({
          version: 1,
          destinations: { x: { accountId: '123', accessToken: 'synthetic-not-a-secret' } },
        }),
      'unknown_field',
    );
    expectCode(
      () => parseReleaseSocialConfig({ version: 1, destinations: { x: { accountId: 'not-numeric' } } }),
      'invalid_x_account_id',
    );
  });

  it('resolves non-secret runtime identities and rejects missing, malformed, or conflicting values', () => {
    expect(
      parseReleaseSocialConfig(
        {
          version: 1,
          destinations: {
            x: {},
            linkedin: { apiVersion: '202609' },
          },
        },
        {
          xAccountId: '123456789012345678',
          linkedinAuthor: 'urn:li:person:FictionalPerson123',
        },
      ),
    ).toEqual(bothDestinations());

    expect(
      parseReleaseSocialConfig(
        {
          version: 1,
          destinations: {
            x: { accountId: '123456789012345678' },
            linkedin: {
              author: 'urn:li:person:FictionalPerson123',
              apiVersion: '202609',
            },
          },
        },
        {
          xAccountId: '123456789012345678',
          linkedinAuthor: 'urn:li:person:FictionalPerson123',
        },
      ),
    ).toEqual(bothDestinations());

    expectCode(
      () => parseReleaseSocialConfig({ version: 1, destinations: { x: {} } }),
      'missing_x_account_id',
    );
    expectCode(
      () =>
        parseReleaseSocialConfig(
          { version: 1, destinations: { linkedin: { apiVersion: '202609' } } },
          {},
        ),
      'missing_linkedin_author',
    );
    expectCode(
      () =>
        parseReleaseSocialConfig(
          { version: 1, destinations: { x: {} } },
          { xAccountId: 'not-numeric' },
        ),
      'invalid_x_account_id',
    );
    expectCode(
      () =>
        parseReleaseSocialConfig(
          {
            version: 1,
            destinations: { x: { accountId: '123456789012345678' } },
          },
          { xAccountId: '987654321' },
        ),
      'conflicting_x_account_id',
    );
    expectCode(
      () =>
        parseReleaseSocialConfig(
          {
            version: 1,
            destinations: {
              linkedin: {
                author: 'urn:li:person:FictionalPerson123',
                apiVersion: '202609',
              },
            },
          },
          { linkedinAuthor: 'urn:li:person:FictionalPerson987' },
        ),
      'conflicting_linkedin_author',
    );

    expect(
      parseReleaseSocialConfig(
        {
          version: 1,
          destinations: { x: { accountId: '123456789012345678' } },
        },
        { linkedinAuthor: 'not-a-linkedin-urn' },
      ),
    ).toEqual({
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });
  });
});

describe('source eligibility and rendering', () => {
  it('binds the production URL to the canonical repository and tag', () => {
    expect(validateCanonicalSource(source()).releaseUrl).toBe(source().releaseUrl);

    expectCode(
      () => validateCanonicalSource(source({ releaseUrl: 'https://example.com/releases/v1.2.3' })),
      'invalid_release_url',
    );

    expectCode(
      () =>
        validateCanonicalSource(
          source({
            releaseUrl: 'https://github.com/fictional/example-release-app/releases/tag/v9.9.9',
          }),
        ),
      'release_url_mismatch',
    );

    const slashTag = validateCanonicalSource(
      source({
        tag: 'release/2026-09',
        releaseUrl: 'https://github.com/fictional/example-release-app/releases/tag/release/2026-09',
      }),
    );
    expect(slashTag.tag).toBe('release/2026-09');
  });

  it('applies override over configured variant over provider default', () => {
    const withOverride = BASE_BODY.replace(
      '<!-- social:short\nDeterministic release announcement planning is ready.\n-->',
      [
        '<!-- social:short',
        'Deterministic release announcement planning is ready.',
        '-->',
        '<!-- social:x',
        'Provider-specific X copy.',
        '-->',
      ].join('\n'),
    );

    const overridden = createReleasePlan(source({ body: withOverride }), {
      version: 1,
      destinations: {
        x: { accountId: '123456789012345678', text: 'announcement' },
        linkedin: { author: 'urn:li:person:FictionalPerson123', apiVersion: '202609' },
      },
    });
    expect(overridden.status).toBe('ready');
    if (overridden.status !== 'ready') return;

    const x = overridden.plans.find((plan) => plan.destination === 'x');
    const linkedin = overridden.plans.find((plan) => plan.destination === 'linkedin');
    expect(x?.textSource).toEqual({ kind: 'provider_override' });
    expect(x?.text).toBe('Provider-specific X copy.\n\n' + source().releaseUrl);
    expect(linkedin?.textSource).toEqual({ kind: 'provider_default', variant: 'announcement' });

    const configured = createReleasePlan(source(), {
      version: 1,
      destinations: {
        x: { accountId: '123456789012345678', text: 'announcement' },
      },
    });
    expect(configured.status).toBe('ready');
    if (configured.status !== 'ready') return;
    expect(configured.plans[0]?.textSource).toEqual({
      kind: 'configured_variant',
      variant: 'announcement',
    });
  });

  it('normalizes line endings, preserves internal whitespace, and appends exactly one canonical URL', () => {
    const crlfBody = BASE_BODY.replace(
      'Deterministic release announcement planning is ready.',
      '  Keep  internal   spaces.  ',
    ).replace(/\n/g, '\r\n');

    const result = createReleasePlan(source({ body: crlfBody }), {
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;

    const text = result.plans[0]?.text;
    expect(text).toBe('Keep  internal   spaces.\n\n' + source().releaseUrl);
    expect(text?.split(source().releaseUrl)).toHaveLength(2);
  });

  it('rejects links inside selected prose so only the canonical release URL is emitted', () => {
    const body = BASE_BODY.replace(
      'Deterministic release announcement planning is ready.',
      'Read https://example.com for more details.',
    );

    expectCode(
      () =>
        createReleasePlan(source({ body }), {
          version: 1,
          destinations: { x: { accountId: '123456789012345678' } },
        }),
      'prose_contains_link',
    );
  });

  it('returns typed skips for explicit opt-out and ineligible sources', () => {
    expect(createReleasePlan(source({ body: BASE_BODY + '\n<!-- social:skip -->\n' }), bothDestinations())).toEqual({
      status: 'skipped',
      reason: 'announcement_opt_out',
    });

    expect(
      createReleasePlan(source({ draft: true, body: 'not parsed for an ineligible draft' }), bothDestinations()),
    ).toEqual({ status: 'skipped', reason: 'draft_release' });

    expect(createReleasePlan(source({ prerelease: true }), bothDestinations())).toEqual({
      status: 'skipped',
      reason: 'prerelease_release',
    });

    expect(createReleasePlan(source({ visibility: 'private' }), bothDestinations())).toEqual({
      status: 'skipped',
      reason: 'source_not_public',
    });
  });

  it('produces identical plans when the same identities come from runtime configuration', () => {
    const literal = createReleasePlan(source(), bothDestinations());
    const runtime = createReleasePlan(
      source(),
      {
        version: 1,
        destinations: {
          x: {},
          linkedin: { apiVersion: '202609' },
        },
      },
      {
        xAccountId: '123456789012345678',
        linkedinAuthor: 'urn:li:person:FictionalPerson123',
      },
    );

    expect(runtime).toEqual(literal);
  });

  it('produces deterministic bytes and per-destination digests independent of other destinations', () => {
    const xOnly = createReleasePlan(source(), {
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });
    const both = createReleasePlan(source(), bothDestinations());
    const repeated = createReleasePlan(source(), bothDestinations());

    expect(xOnly.status).toBe('ready');
    expect(both.status).toBe('ready');
    expect(repeated.status).toBe('ready');
    if (xOnly.status !== 'ready' || both.status !== 'ready' || repeated.status !== 'ready') return;

    const xOnlyPlan = xOnly.plans[0];
    const xFromBoth = both.plans.find((plan) => plan.destination === 'x');
    expect(xOnlyPlan?.digest).toBe(xFromBoth?.digest);
    expect(JSON.stringify(both.plans)).toBe(JSON.stringify(repeated.plans));
    expect(both.plans.map((plan) => plan.destination)).toEqual(['x', 'linkedin']);
  });

  it('detects a hand-edited plan instead of trusting its serialized shape', () => {
    const result = createReleasePlan(source(), {
      version: 1,
      destinations: { x: { accountId: '123456789012345678' } },
    });
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;

    const plan = result.plans[0];
    expect(plan).toBeDefined();
    if (plan === undefined) return;

    expect(validateRenderedPlan(plan)).toEqual(plan);
    expectCode(
      () =>
        validateRenderedPlan({
          ...plan,
          text: plan.text.replace('planning is ready', 'planning changed'),
        }),
      'plan_digest_mismatch',
    );
  });
});
