import { createHash } from 'node:crypto';

import { parseTweet } from 'twitter-text';

import { validateRenderedPlan } from '../../core/render.js';
import type {
  ProviderPreflightResult,
  ProviderValidationResult,
  PublicationResult,
  ReleaseSocialProvider,
  RenderedDestinationPlan,
} from '../../core/types.js';
import { validateXCredentials, type XCredentials } from './credentials.js';
import { createAuthorizationHeader, fetchWithTimeout, X_CREATE_POST_URL, X_ME_URL, type XFetch } from './http.js';

const MAX_WEIGHTED_LENGTH = 280;
const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_DIAGNOSTIC_LENGTH = 320;

export interface XPreparedPayload {
  destination: 'x';
  accountId: string;
  text: string;
  planDigest: string;
}

export interface XProviderOptions {
  fetch?: XFetch;
  timeoutMs?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function responseDataId(body: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(body);
    if (!isRecord(parsed) || !isRecord(parsed.data)) return undefined;
    const id = parsed.data.id;
    if (typeof id !== 'string' || !/^\d+$/.test(id)) return undefined;
    return id;
  } catch {
    return undefined;
  }
}

function authenticatedUserId(body: string): string | undefined {
  return responseDataId(body);
}

function credentialsApprovalKey(credentials: XCredentials, accountId: string): string {
  return createHash('sha256')
    .update(credentials.apiKey)
    .update('\0')
    .update(credentials.apiSecret)
    .update('\0')
    .update(credentials.accessToken)
    .update('\0')
    .update(credentials.accessTokenSecret)
    .update('\0')
    .update(accountId)
    .digest('hex');
}

function sanitizeDiagnostic(value: string, credentials: XCredentials): string {
  let result = value.replace(/authorization\s*[:=]\s*[^\r\n]+/gi, 'Authorization: [REDACTED]');

  for (const secret of [
    credentials.apiKey,
    credentials.apiSecret,
    credentials.accessToken,
    credentials.accessTokenSecret,
  ]) {
    if (secret !== '') result = result.split(secret).join('[REDACTED]');
  }

  result = result.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ');
  return result.trim().slice(0, MAX_DIAGNOSTIC_LENGTH);
}

async function boundedResponseDetail(response: Response, credentials: XCredentials): Promise<string> {
  try {
    const body = await response.text();
    if (body.trim() === '') return '';
    return sanitizeDiagnostic(body, credentials);
  } catch {
    return '';
  }
}

function retryAfterSuffix(response: Response): string {
  const retryAfter = response.headers.get('retry-after');
  if (!retryAfter) return '';
  return ` Retry-After: ${retryAfter.slice(0, 80)}.`;
}

function rejected(reason: string, retryClassification: 'retryable' | 'permanent'): PublicationResult {
  return { status: 'rejected', reason, retryClassification };
}

function preflightRejected(reason: string, retryClassification: 'retryable' | 'permanent'): ProviderPreflightResult {
  return { status: 'rejected', reason, retryClassification };
}

function safeErrorMessage(error: unknown, credentials: XCredentials): string {
  if (error instanceof Error) {
    return sanitizeDiagnostic(error.message, credentials);
  }
  return 'Unexpected transport failure.';
}

function statusReason(prefix: string, status: number, detail: string, retryAfter: string): string {
  return `${prefix} (HTTP ${status})${detail === '' ? '' : `: ${detail}`}${retryAfter}`;
}

function isAmbiguousPostStatus(status: number): boolean {
  return (status >= 300 && status < 400) || status === 408 || status >= 500;
}

export class XProvider implements ReleaseSocialProvider<XCredentials, XPreparedPayload> {
  readonly destination = 'x' as const;

  private readonly fetcher: XFetch;
  private readonly timeoutMs: number;
  private readonly approvals = new Set<string>();

  constructor(options: XProviderOptions = {}) {
    this.fetcher = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  prepare(plan: RenderedDestinationPlan): XPreparedPayload {
    const validated = validateRenderedPlan(plan);
    if (validated.destination !== 'x' || validated.account.destination !== 'x') {
      throw new Error('X provider requires a validated X destination plan.');
    }

    return {
      destination: 'x',
      accountId: validated.account.accountId,
      text: validated.text,
      planDigest: validated.digest,
    };
  }

  validate(payload: XPreparedPayload): ProviderValidationResult {
    const errors: string[] = [];

    if (payload.destination !== 'x') errors.push('X payload destination must be x.');
    if (!/^\d+$/.test(payload.accountId)) errors.push('X accountId must be a numeric user ID.');
    if (!/^[0-9a-f]{64}$/.test(payload.planDigest))
      errors.push('X payload planDigest must be a lowercase SHA-256 digest.');
    if (payload.text.trim() === '') errors.push('X post text must not be empty.');

    const parsed = parseTweet(payload.text);
    if (!parsed.valid || parsed.weightedLength > MAX_WEIGHTED_LENGTH) {
      errors.push(
        `X post text is ${parsed.weightedLength} weighted characters; the supported maximum is ${MAX_WEIGHTED_LENGTH}.`,
      );
    }

    return errors.length === 0 ? { ok: true } : { ok: false, errors };
  }

  async preflight(credentials: XCredentials, payload: XPreparedPayload): Promise<ProviderPreflightResult> {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return preflightRejected(`Invalid X payload: ${validation.errors.join(' ')}`, 'permanent');
    }

    const credentialErrors = validateXCredentials(credentials);
    if (credentialErrors.length > 0) {
      return preflightRejected(credentialErrors.join(' '), 'permanent');
    }

    let response: Response;
    try {
      response = await fetchWithTimeout(
        this.fetcher,
        X_ME_URL,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: createAuthorizationHeader(credentials, X_ME_URL, 'GET'),
          },
        },
        this.timeoutMs,
      );
    } catch (error: unknown) {
      const detail = safeErrorMessage(error, credentials);
      return preflightRejected(
        `X identity verification failed before publication${detail === '' ? '.' : `: ${detail}`}`,
        'retryable',
      );
    }

    const detail = await boundedResponseDetail(response, credentials);
    const retryAfter = retryAfterSuffix(response);

    if (response.status >= 300 && response.status < 400) {
      return preflightRejected(
        statusReason('X identity verification refused an API redirect', response.status, detail, retryAfter),
        'permanent',
      );
    }

    if (response.status === 429 || response.status >= 500) {
      return preflightRejected(
        statusReason('X identity verification is temporarily unavailable', response.status, detail, retryAfter),
        'retryable',
      );
    }

    if (!response.ok) {
      return preflightRejected(
        statusReason('X identity verification was rejected', response.status, detail, retryAfter),
        'permanent',
      );
    }

    const userId = authenticatedUserId(detail);
    if (userId === undefined) {
      return preflightRejected('X identity verification returned a malformed success response.', 'retryable');
    }

    if (userId !== payload.accountId) {
      return preflightRejected(
        `Authenticated X account ID ${userId} does not match configured accountId ${payload.accountId}.`,
        'permanent',
      );
    }

    this.approvals.add(credentialsApprovalKey(credentials, payload.accountId));
    return { status: 'ready' };
  }

  async publish(credentials: XCredentials, payload: XPreparedPayload): Promise<PublicationResult> {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return rejected(`Invalid X payload: ${validation.errors.join(' ')}`, 'permanent');
    }

    const credentialErrors = validateXCredentials(credentials);
    if (credentialErrors.length > 0) {
      return rejected(credentialErrors.join(' '), 'permanent');
    }

    const approvalKey = credentialsApprovalKey(credentials, payload.accountId);
    if (!this.approvals.delete(approvalKey)) {
      return rejected(
        'X publish requires a successful live preflight for this account and credential set before the create request.',
        'permanent',
      );
    }

    const body = JSON.stringify({ text: payload.text });

    let response: Response;
    try {
      response = await fetchWithTimeout(
        this.fetcher,
        X_CREATE_POST_URL,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            authorization: createAuthorizationHeader(credentials, X_CREATE_POST_URL, 'POST'),
            'content-type': 'application/json',
          },
          body,
        },
        this.timeoutMs,
      );
    } catch (error: unknown) {
      const detail = safeErrorMessage(error, credentials);
      return {
        status: 'unknown',
        reason: `X create request outcome is unknown after a transport failure${detail === '' ? '.' : `: ${detail}`}`,
      };
    }

    const detail = await boundedResponseDetail(response, credentials);
    const retryAfter = retryAfterSuffix(response);

    if (response.ok) {
      const providerId = responseDataId(detail);
      if (providerId === undefined) {
        return {
          status: 'unknown',
          reason: 'X returned a success status without a valid post ID; post creation cannot be ruled out.',
        };
      }
      return {
        status: 'published',
        providerId,
        url: `https://x.com/i/web/status/${providerId}`,
      };
    }

    if (isAmbiguousPostStatus(response.status)) {
      return {
        status: 'unknown',
        reason: statusReason(
          'X create request returned an ambiguous response; post creation cannot be ruled out',
          response.status,
          detail,
          retryAfter,
        ),
      };
    }

    if (response.status === 429) {
      return rejected(
        statusReason('X create request was rate limited without creating a post', response.status, detail, retryAfter),
        'retryable',
      );
    }

    return rejected(
      statusReason('X create request was rejected without creating a post', response.status, detail, retryAfter),
      'permanent',
    );
  }
}

export function createXProvider(options: XProviderOptions = {}): XProvider {
  return new XProvider(options);
}
