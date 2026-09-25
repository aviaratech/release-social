import { describe, expect, it } from 'vitest';
import { parseTweet } from 'twitter-text';

import {
  createReleasePlan,
  type CanonicalReleaseSource,
  type ProviderPreflightResult,
  type PublicationResult,
  type RenderedDestinationPlan,
} from '../../src/index.js';
import {
  createXProvider,
  loadXCredentials,
  X_CREATE_POST_URL,
  X_ME_URL,
  type XCredentials,
  type XPreparedPayload,
} from '../../src/providers/x/index.js';

const ACCOUNT_ID = '123456789012345678';
const POST_ID = '987654321098765432';
const RELEASE_URL = 'https://github.com/fictional/x-provider-consumer/releases/tag/v1.0.0';

const CREDENTIALS: XCredentials = {
  apiKey: 'synthetic-api-key',
  apiSecret: 'synthetic-api-secret',
  accessToken: 'synthetic-access-token',
  accessTokenSecret: 'synthetic-access-token-secret',
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
    if (responder === undefined) throw new Error('Unexpected mocked X request.');
    return await responder(input, init);
  };

  return { fetcher, calls };
}

function requestUrl(input: FetchInput): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function jsonResponse(status: number, body: unknown, headers: HeadersInit = {}): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('content-type', 'application/json');
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

function releaseBody(xText = 'X provider publishing is ready.'): string {
  return [
    '<!-- release-social:v1 -->',
    '',
    '<!-- announcement:start -->',
    'The fictional release now supports deterministic social publishing.',
    '<!-- announcement:end -->',
    '',
    '## Highlights',
    '- Adds a fictional X provider test fixture.',
    '',
    '## Upgrade notes',
    'No breaking changes.',
    '',
    '<!-- social:short',
    'Fictional release is ready.',
    '-->',
    '<!-- social:x',
    xText,
    '-->',
    '',
  ].join('\n');
}

function source(body = releaseBody()): CanonicalReleaseSource {
  return {
    repositoryId: 424242,
    repository: 'fictional/x-provider-consumer',
    releaseId: 515151,
    tag: 'v1.0.0',
    releaseUrl: RELEASE_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
  };
}

function xPlan(xText = 'X provider publishing is ready.'): RenderedDestinationPlan {
  const result = createReleasePlan(source(releaseBody(xText)), {
    version: 1,
    destinations: {
      x: { accountId: ACCOUNT_ID },
    },
  });
  if (result.status !== 'ready' || result.plans[0] === undefined) {
    throw new Error('Synthetic X plan was not created.');
  }
  return result.plans[0];
}

function preparedText(text: string): XPreparedPayload {
  return {
    destination: 'x',
    accountId: ACCOUNT_ID,
    text,
    planDigest: 'a'.repeat(64),
  };
}

function identitySuccess(): Response {
  return jsonResponse(200, { data: { id: ACCOUNT_ID, username: 'fictional_account' } });
}

function requirePreflightRejected(result: ProviderPreflightResult) {
  expect(result.status).toBe('rejected');
  if (result.status !== 'rejected') throw new Error('Expected rejected X preflight.');
  return result;
}

function requirePublicationRejected(result: PublicationResult) {
  expect(result.status).toBe('rejected');
  if (result.status !== 'rejected') throw new Error('Expected rejected X publication.');
  return result;
}

async function preflightReady(provider: ReturnType<typeof createXProvider>, payload: XPreparedPayload): Promise<void> {
  const result = await provider.preflight(CREDENTIALS, payload);
  expect(result).toEqual({ status: 'ready' });
}

describe('X provider validation and preparation', () => {
  it('enforces the 280/281 weighted-character boundary on the exact final text including the URL', () => {
    const provider = createXProvider();
    const final280 = `${'a'.repeat(255)}\n\nhttps://example.com/a-very-long-release-link`;
    const final281 = `${'a'.repeat(256)}\n\nhttps://example.com/a-very-long-release-link`;

    expect(parseTweet(final280).weightedLength).toBe(280);
    expect(parseTweet(final281).weightedLength).toBe(281);
    expect(provider.validate(preparedText(final280))).toEqual({ ok: true });

    const invalid = provider.validate(preparedText(final281));
    expect(invalid.ok).toBe(false);
    if (invalid.ok) return;
    expect(invalid.errors[0]).toContain('281 weighted characters');
  });

  it('uses twitter-text weighting for emoji, Unicode, and transformed URLs', () => {
    const text = '🚀漢 https://example.com/this/path/is/much/longer/than/twenty-three-characters';
    expect(parseTweet(text).weightedLength).toBe(28);

    const provider = createXProvider();
    expect(provider.validate(preparedText(text))).toEqual({ ok: true });
  });

  it('prepares and validates without loading credentials or contacting X', () => {
    const mock = createMockFetch(() => {
      throw new Error('Network must not be called during prepare/validate.');
    });
    const provider = createXProvider({ fetch: mock.fetcher });

    const payload = provider.prepare(xPlan());
    expect(payload.destination).toBe('x');
    expect(payload.accountId).toBe(ACCOUNT_ID);
    expect(payload.text).toBe(`X provider publishing is ready.\n\n${RELEASE_URL}`);
    expect(payload.planDigest).toMatch(/^[0-9a-f]{64}$/);
    expect(provider.validate(payload)).toEqual({ ok: true });
    expect(mock.calls).toHaveLength(0);
  });

  it('loads only the four documented OAuth 1.0a credential environment variables', () => {
    expect(
      loadXCredentials({
        X_API_KEY: 'key',
        X_API_SECRET: 'secret',
        X_ACCESS_TOKEN: 'token',
        X_ACCESS_TOKEN_SECRET: 'token-secret',
        X_BEARER_TOKEN: 'must-not-be-used',
      }),
    ).toEqual({
      apiKey: 'key',
      apiSecret: 'secret',
      accessToken: 'token',
      accessTokenSecret: 'token-secret',
    });

    expect(() => loadXCredentials({ X_API_KEY: 'key' })).toThrow(
      'X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET',
    );
  });
});

describe('X live preflight', () => {
  it('constructs a signed read-only identity request and rejects account mismatch before any POST', async () => {
    const mock = createMockFetch((input, init) => {
      expect(requestUrl(input)).toBe(X_ME_URL);
      expect(init?.method).toBe('GET');
      expect(init?.redirect).toBe('manual');

      const headers = new Headers(init?.headers);
      const authorization = headers.get('authorization');
      expect(authorization).toMatch(/^OAuth /);
      expect(authorization).toContain('oauth_consumer_key="synthetic-api-key"');
      expect(authorization).toContain('oauth_token="synthetic-access-token"');
      expect(authorization).toContain('oauth_signature_method="HMAC-SHA1"');
      expect(authorization).toContain('oauth_signature=');
      expect(authorization).not.toContain(CREDENTIALS.apiSecret);
      expect(authorization).not.toContain(CREDENTIALS.accessTokenSecret);

      return jsonResponse(200, { data: { id: '999999999999999999' } });
    });
    const provider = createXProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(xPlan());

    const result = requirePreflightRejected(await provider.preflight(CREDENTIALS, payload));
    expect(result.reason).toBe(
      `Authenticated X account ID 999999999999999999 does not match configured accountId ${ACCOUNT_ID}.`,
    );
    expect(result.retryClassification).toBe('permanent');
    expect(mock.calls).toHaveLength(1);

    requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
    expect(mock.calls).toHaveLength(1);
  });

  it('maps invalid auth and temporary identity failures without attempting publication', async () => {
    const authMock = createMockFetch(() => jsonResponse(401, { title: 'Unauthorized' }));
    const authProvider = createXProvider({ fetch: authMock.fetcher });
    const payload = authProvider.prepare(xPlan());
    const authResult = requirePreflightRejected(await authProvider.preflight(CREDENTIALS, payload));
    expect(authResult.retryClassification).toBe('permanent');

    const unavailableMock = createMockFetch(() =>
      jsonResponse(503, { title: 'Temporarily unavailable' }, { 'retry-after': '20' }),
    );
    const unavailableProvider = createXProvider({ fetch: unavailableMock.fetcher });
    const unavailableResult = requirePreflightRejected(
      await unavailableProvider.preflight(CREDENTIALS, payload),
    );
    expect(unavailableResult.retryClassification).toBe('retryable');
    expect(unavailableResult.reason).toContain('Retry-After: 20');
  });
});

describe('X publication', () => {
  it('sends the exact payload once after preflight and returns the confirmed post ID and canonical public URL', async () => {
    const mock = createMockFetch(
      () => identitySuccess(),
      (input, init) => {
        expect(requestUrl(input)).toBe(X_CREATE_POST_URL);
        expect(init?.method).toBe('POST');
        expect(init?.redirect).toBe('manual');
        expect(init?.body).toBe(JSON.stringify({ text: `X provider publishing is ready.\n\n${RELEASE_URL}` }));

        const headers = new Headers(init?.headers);
        expect(headers.get('content-type')).toBe('application/json');
        const authorization = headers.get('authorization');
        expect(authorization).toMatch(/^OAuth /);
        expect(authorization).toContain('oauth_signature_method="HMAC-SHA1"');

        return jsonResponse(201, { data: { id: POST_ID, text: 'ignored by the provider' } });
      },
    );

    const provider = createXProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(xPlan());
    await preflightReady(provider, payload);

    expect(await provider.publish(CREDENTIALS, payload)).toEqual({
      status: 'published',
      providerId: POST_ID,
      url: `https://x.com/i/web/status/${POST_ID}`,
    });
    expect(mock.calls.filter((call) => requestUrl(call.input) === X_CREATE_POST_URL)).toHaveLength(1);
  });

  it('classifies definite rejection, rate limiting, permission/balance failure, and Retry-After', async () => {
    const cases: ReadonlyArray<{
      status: number;
      retryClassification: 'retryable' | 'permanent';
      retryAfter?: string;
    }> = [
      { status: 400, retryClassification: 'permanent' },
      { status: 402, retryClassification: 'permanent' },
      { status: 403, retryClassification: 'permanent' },
      { status: 429, retryClassification: 'retryable', retryAfter: '60' },
    ];

    for (const testCase of cases) {
      const responseHeaders = testCase.retryAfter ? { 'retry-after': testCase.retryAfter } : {};
      const mock = createMockFetch(
        () => identitySuccess(),
        () => jsonResponse(testCase.status, { title: 'Synthetic rejection' }, responseHeaders),
      );
      const provider = createXProvider({ fetch: mock.fetcher });
      const payload = provider.prepare(xPlan());
      await preflightReady(provider, payload);

      const result = requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
      expect(result.retryClassification).toBe(testCase.retryClassification);
      if (testCase.retryAfter) {
        expect(result.reason).toContain(`Retry-After: ${testCase.retryAfter}`);
      }
    }
  });

  it('treats timeout, transport failure, redirects, 408, 5xx, and malformed success as unknown', async () => {
    const responders: MockResponder[] = [
      () => {
        throw new Error('synthetic transport timeout');
      },
      () => new Response('', { status: 302, headers: { location: 'https://example.com/redirect' } }),
      () => jsonResponse(408, { title: 'Timeout' }),
      () => jsonResponse(503, { title: 'Server failure' }),
      () => jsonResponse(201, { data: {} }),
    ];

    for (const responder of responders) {
      const mock = createMockFetch(() => identitySuccess(), responder);
      const provider = createXProvider({ fetch: mock.fetcher });
      const payload = provider.prepare(xPlan());
      await preflightReady(provider, payload);

      expect((await provider.publish(CREDENTIALS, payload)).status).toBe('unknown');
      expect(mock.calls.filter((call) => requestUrl(call.input) === X_CREATE_POST_URL)).toHaveLength(1);
    }
  });

  it('redacts secrets and Authorization material from every returned failure diagnostic', async () => {
    const echoed = [
      CREDENTIALS.apiKey,
      CREDENTIALS.apiSecret,
      CREDENTIALS.accessToken,
      CREDENTIALS.accessTokenSecret,
      'Authorization: OAuth should-not-escape',
    ].join(' ');

    const mock = createMockFetch(
      () => identitySuccess(),
      () => new Response(echoed, { status: 400 }),
    );
    const provider = createXProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(xPlan());
    await preflightReady(provider, payload);

    const result = requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
    expect(result.reason).toContain('[REDACTED]');
    expect(result.reason).not.toContain(CREDENTIALS.apiKey);
    expect(result.reason).not.toContain(CREDENTIALS.apiSecret);
    expect(result.reason).not.toContain(CREDENTIALS.accessToken);
    expect(result.reason).not.toContain(CREDENTIALS.accessTokenSecret);
    expect(result.reason).not.toContain('should-not-escape');
    expect(result.reason.length).toBeLessThanOrEqual(500);
  });

  it('consumes preflight approval before the POST so one publish call can issue at most one create request', async () => {
    const mock = createMockFetch(
      () => identitySuccess(),
      () => jsonResponse(500, { title: 'Ambiguous failure' }),
    );
    const provider = createXProvider({ fetch: mock.fetcher });
    const payload = provider.prepare(xPlan());
    await preflightReady(provider, payload);

    expect((await provider.publish(CREDENTIALS, payload)).status).toBe('unknown');
    requirePublicationRejected(await provider.publish(CREDENTIALS, payload));
    expect(mock.calls.filter((call) => requestUrl(call.input) === X_CREATE_POST_URL)).toHaveLength(1);
  });
});
