import { describe, expect, it } from 'vitest';

import {
  createReleasePlan,
  type CanonicalReleaseSource,
  type ProviderPreflightResult,
  type PublicationResult,
  type RenderedDestinationPlan,
} from '../../src/index.js';
import {
  createLinkedInProvider,
  escapeLinkedInCommentary,
  linkedInCharacterLength,
  LINKEDIN_COMMENTARY_MAX_CHARACTERS,
  LINKEDIN_POSTS_URL,
  LINKEDIN_RESTLI_PROTOCOL_VERSION,
  loadLinkedInCredentials,
  type LinkedInCredentials,
  type LinkedInPreparedPayload,
} from '../../src/providers/linkedin/index.js';

const AUTHOR = 'urn:li:person:FictionalMember123';
const API_VERSION = '202609';
const SHARE_URN = 'urn:li:share:987654321098765432';
const UGC_URN = 'urn:li:ugcPost:987654321098765433';
const RELEASE_URL = 'https://github.com/fictional/linkedin-consumer/releases/tag/v1.0.0';

const CREDENTIALS: LinkedInCredentials = {
  accessToken: 'synthetic-linkedin-access-token',
};

type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];
type MockResponder = (input: FetchInput, init: FetchInit) => Response | Promise<Response>;

interface CapturedCall {
  input: FetchInput;
  init: FetchInit;
}

function createMockFetch(...responders: MockResponder[]): {
  fetcher: typeof fetch;
  calls: CapturedCall[];
} {
  const calls: CapturedCall[] = [];
  let index = 0;

  const fetcher: typeof fetch = async (input, init) => {
    calls.push({ input, init });
    const responder = responders[index];
    index += 1;
    if (responder === undefined) throw new Error('Unexpected mocked LinkedIn request.');
    return await responder(input, init);
  };

  return { fetcher, calls };
}

function requestUrl(input: FetchInput): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function response(status: number, headers: Readonly<Record<string, string>> = {}): Response {
  const responseHeaders = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    responseHeaders.set(name, value);
  }
  return new Response('', { status, headers: responseHeaders });
}

function releaseBody(linkedInText = 'LinkedIn provider publishing is ready.'): string {
  return [
    '<!-- release-social:v1 -->',
    '',
    '<!-- announcement:start -->',
    'The fictional release now supports deterministic LinkedIn publishing.',
    '<!-- announcement:end -->',
    '',
    '## Highlights',
    '- Adds a fictional LinkedIn provider test fixture.',
    '',
    '## Upgrade notes',
    'No breaking changes.',
    '',
    '<!-- social:short',
    'Fictional release is ready.',
    '-->',
    '<!-- social:linkedin',
    linkedInText,
    '-->',
    '',
  ].join('\n');
}

function source(body = releaseBody()): CanonicalReleaseSource {
  return {
    repositoryId: 424242,
    repository: 'fictional/linkedin-consumer',
    releaseId: 515151,
    tag: 'v1.0.0',
    releaseUrl: RELEASE_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
  };
}

function linkedInPlan(text = 'LinkedIn provider publishing is ready.'): RenderedDestinationPlan {
  const result = createReleasePlan(source(releaseBody(text)), {
    version: 1,
    destinations: {
      linkedin: { author: AUTHOR, apiVersion: API_VERSION },
    },
  });
  if (result.status !== 'ready' || result.plans[0] === undefined) {
    throw new Error('Synthetic LinkedIn plan was not created.');
  }
  return result.plans[0];
}

function preparedText(text: string): LinkedInPreparedPayload {
  return {
    destination: 'linkedin',
    author: AUTHOR,
    apiVersion: API_VERSION,
    text,
    commentary: escapeLinkedInCommentary(text),
    planDigest: 'a'.repeat(64),
  };
}

function requirePreflightRejected(result: ProviderPreflightResult) {
  expect(result.status).toBe('rejected');
  if (result.status !== 'rejected') throw new Error('Expected rejected LinkedIn preflight.');
  return result;
}

function requirePublicationRejected(result: PublicationResult) {
  expect(result.status).toBe('rejected');
  if (result.status !== 'rejected') throw new Error('Expected rejected LinkedIn publication.');
  return result;
}

function requirePublicationUnknown(result: PublicationResult) {
  expect(result.status).toBe('unknown');
  if (result.status !== 'unknown') throw new Error('Expected unknown LinkedIn publication.');
  return result;
}

async function preflightReady(
  provider: ReturnType<typeof createLinkedInProvider>,
  payload: LinkedInPreparedPayload,
): Promise<void> {
  expect(await provider.preflight(CREDENTIALS, payload)).toEqual({ status: 'ready' });
}

describe('LinkedIn provider validation and preparation', () => {
  it('uses the documented 3000-character boundary rather than X weighted counting', () => {
    const provider = createLinkedInProvider();
    const atLimit = '😀'.repeat(LINKEDIN_COMMENTARY_MAX_CHARACTERS);
    const overLimit = `${atLimit}a`;

    expect(linkedInCharacterLength(atLimit)).toBe(3000);
    expect(provider.validate(preparedText(atLimit))).toEqual({ ok: true });

    const invalid = provider.validate(preparedText(overLimit));
    expect(invalid.ok).toBe(false);
    if (invalid.ok) return;
    expect(invalid.errors[0]).toContain('3000-character maximum');
  });

  it('escapes every reserved little-text character while preserving Unicode and literal prose semantics', () => {
    const raw = 'Release 🚀 | { } @ [ ] ( ) < > # \\ * _ ~';
    const escaped = 'Release 🚀 \\| \\{ \\} \\@ \\[ \\] \\( \\) \\< \\> \\# \\\\ \\* \\_ \\~';

    expect(escapeLinkedInCommentary(raw)).toBe(escaped);
    expect(linkedInCharacterLength('🚀漢')).toBe(2);

    const provider = createLinkedInProvider();
    expect(provider.validate(preparedText(raw))).toEqual({ ok: true });
  });

  it('rejects a source that fits the visible limit but exceeds it after required reserved-character escaping', () => {
    const provider = createLinkedInProvider();
    const raw = '#'.repeat(1501);
    expect(linkedInCharacterLength(raw)).toBe(1501);
    expect(linkedInCharacterLength(escapeLinkedInCommentary(raw))).toBe(3002);
    expect(provider.validate(preparedText(raw)).ok).toBe(false);
  });

  it('prepares and validates without credentials or network access', () => {
    const mock = createMockFetch(() => {
      throw new Error('Network must not be called during prepare/validate.');
    });
    const provider = createLinkedInProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(linkedInPlan('LinkedIn #1 (stable) *literal*.'));

    expect(payload.destination).toBe('linkedin');
    expect(payload.author).toBe(AUTHOR);
    expect(payload.apiVersion).toBe(API_VERSION);
    expect(payload.text).toBe(`LinkedIn #1 (stable) *literal*.\n\n${RELEASE_URL}`);
    expect(payload.commentary).toBe(`LinkedIn \\#1 \\(stable\\) \\*literal\\*.\n\n${RELEASE_URL}`);
    expect(payload.planDigest).toMatch(/^[0-9a-f]{64}$/);
    expect(provider.validate(payload)).toEqual({ ok: true });
    expect(mock.calls).toHaveLength(0);
  });

  it('loads only LINKEDIN_ACCESS_TOKEN and rejects missing credentials', () => {
    expect(
      loadLinkedInCredentials({
        LINKEDIN_ACCESS_TOKEN: 'token',
        LINKEDIN_CLIENT_SECRET: 'must-not-be-used',
      }),
    ).toEqual({ accessToken: 'token' });

    expect(() => loadLinkedInCredentials({})).toThrow('LINKEDIN_ACCESS_TOKEN');
  });
});

describe('LinkedIn preflight', () => {
  it('checks token/configuration without member-read API calls and binds approval to the exact payload', async () => {
    const mock = createMockFetch(() => {
      throw new Error('Preflight must not request member-read scopes or call LinkedIn.');
    });
    const provider = createLinkedInProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(linkedInPlan());

    expect(await provider.preflight(CREDENTIALS, payload)).toEqual({ status: 'ready' });
    expect(mock.calls).toHaveLength(0);

    const edited: LinkedInPreparedPayload = {
      ...payload,
      text: payload.text.replace('publishing is ready', 'publishing was edited'),
    };
    edited.commentary = escapeLinkedInCommentary(edited.text);

    const result = requirePublicationRejected(await provider.publish(CREDENTIALS, edited));
    expect(result.reason).toContain('requires a successful preflight');
    expect(mock.calls).toHaveLength(0);
  });

  it('rejects empty access tokens and invalid person/version configuration before publication', async () => {
    const provider = createLinkedInProvider();

    const missingToken = requirePreflightRejected(await provider.preflight({ accessToken: '' }, preparedText('valid')));
    expect(missingToken.retryClassification).toBe('permanent');

    const invalidAuthor = { ...preparedText('valid'), author: 'urn:li:organization:123' };
    expect(requirePreflightRejected(await provider.preflight(CREDENTIALS, invalidAuthor)).reason).toContain(
      'personal-profile URN',
    );

    const invalidVersion = { ...preparedText('valid'), apiVersion: '202613' };
    expect(requirePreflightRejected(await provider.preflight(CREDENTIALS, invalidVersion)).reason).toContain(
      'valid YYYYMM',
    );
  });
});

describe('LinkedIn publication', () => {
  it('sends exact personal-author/version/headers/payload and publishes from x-restli-id', async () => {
    const mock = createMockFetch((input, init) => {
      expect(requestUrl(input)).toBe(LINKEDIN_POSTS_URL);
      expect(init?.method).toBe('POST');
      expect(init?.redirect).toBe('manual');

      const headers = new Headers(init?.headers);
      expect(headers.get('authorization')).toBe(`Bearer ${CREDENTIALS.accessToken}`);
      expect(headers.get('linkedin-version')).toBe(API_VERSION);
      expect(headers.get('x-restli-protocol-version')).toBe(LINKEDIN_RESTLI_PROTOCOL_VERSION);
      expect(headers.get('content-type')).toBe('application/json');

      expect(init?.body).toBe(
        JSON.stringify({
          author: AUTHOR,
          commentary: `LinkedIn \\#1 \\(stable\\).\n\n${RELEASE_URL}`,
          visibility: 'PUBLIC',
          distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: [],
          },
          lifecycleState: 'PUBLISHED',
        }),
      );

      return response(201, { 'x-restli-id': SHARE_URN });
    });

    const provider = createLinkedInProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(linkedInPlan('LinkedIn #1 (stable).'));
    await preflightReady(provider, payload);

    expect(await provider.publish(CREDENTIALS, payload)).toEqual({
      status: 'published',
      providerId: SHARE_URN,
      url: `https://www.linkedin.com/feed/update/${SHARE_URN}`,
    });
    expect(mock.calls).toHaveLength(1);
  });

  it('preserves both documented share and ugcPost response-header IDs', async () => {
    for (const postUrn of [SHARE_URN, UGC_URN]) {
      const mock = createMockFetch(() => response(201, { 'x-restli-id': postUrn }));
      const provider = createLinkedInProvider({ fetch: mock.fetcher });
      const payload = provider.prepare(linkedInPlan());
      await preflightReady(provider, payload);

      expect(await provider.publish(CREDENTIALS, payload)).toEqual({
        status: 'published',
        providerId: postUrn,
        url: `https://www.linkedin.com/feed/update/${postUrn}`,
      });
    }
  });

  it('maps auth, scope/author, and version errors to definite permanent rejection', async () => {
    for (const status of [400, 401, 403]) {
      const mock = createMockFetch(() => response(status));
      const provider = createLinkedInProvider({ fetch: mock.fetcher });
      const payload = provider.prepare(linkedInPlan());
      await preflightReady(provider, payload);

      const result = requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
      expect(result.retryClassification).toBe('permanent');
    }
  });

  it('maps rate limiting to retryable rejection and preserves bounded Retry-After', async () => {
    const mock = createMockFetch(() => response(429, { 'retry-after': '60' }));
    const provider = createLinkedInProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(linkedInPlan());
    await preflightReady(provider, payload);

    const result = requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
    expect(result.retryClassification).toBe('retryable');
    expect(result.reason).toContain('Retry-After: 60');
  });

  it('treats timeout/transport failure, redirect, 5xx, and missing success ID as unknown', async () => {
    const responders: MockResponder[] = [
      () => {
        throw new Error('synthetic transport timeout');
      },
      () => response(302, { location: 'https://example.com/redirect' }),
      () => response(503),
      () => response(201),
    ];

    for (const responder of responders) {
      const mock = createMockFetch(responder);
      const provider = createLinkedInProvider({ fetch: mock.fetcher });
      const payload = provider.prepare(linkedInPlan());
      await preflightReady(provider, payload);

      expect((await provider.publish(CREDENTIALS, payload)).status).toBe('unknown');
      expect(mock.calls).toHaveLength(1);
    }
  });

  it('redacts access tokens and Authorization material from transport diagnostics', async () => {
    const mock = createMockFetch(() => {
      throw new Error(
        `Authorization: Bearer ${CREDENTIALS.accessToken} request failed with token ${CREDENTIALS.accessToken}`,
      );
    });
    const provider = createLinkedInProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(linkedInPlan());
    await preflightReady(provider, payload);

    const result = requirePublicationUnknown(await provider.publish(CREDENTIALS, payload));
    expect(result.reason).toContain('[REDACTED]');
    expect(result.reason).not.toContain(CREDENTIALS.accessToken);
    expect(result.reason.length).toBeLessThanOrEqual(500);
  });

  it('consumes approval before sending so repeated publish cannot create a second post', async () => {
    const mock = createMockFetch(() => response(503));
    const provider = createLinkedInProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(linkedInPlan());
    await preflightReady(provider, payload);

    expect((await provider.publish(CREDENTIALS, payload)).status).toBe('unknown');
    requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
    expect(mock.calls).toHaveLength(1);
  });
});
