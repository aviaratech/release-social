import { createHash } from 'node:crypto';

import { validateRenderedPlan } from '../../core/render.js';
import type {
  ProviderPreflightResult,
  ProviderValidationResult,
  PublicationResult,
  ReleaseSocialProvider,
  RenderedDestinationPlan,
} from '../../core/types.js';
import { validateLinkedInCredentials, type LinkedInCredentials } from './credentials.js';
import { fetchLinkedInWithTimeout, linkedInHeaders, LINKEDIN_POSTS_URL, type LinkedInFetch } from './http.js';
import { escapeLinkedInCommentary, linkedInCharacterLength, LINKEDIN_COMMENTARY_MAX_CHARACTERS } from './text.js';

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_DIAGNOSTIC_LENGTH = 320;
const POST_URN_PATTERN = /^urn:li:(?:share|ugcPost):\d+$/;

export interface LinkedInPreparedPayload {
  destination: 'linkedin';
  author: string;
  apiVersion: string;
  text: string;
  commentary: string;
  planDigest: string;
}

export interface LinkedInProviderOptions {
  fetch?: LinkedInFetch;
  timeoutMs?: number;
}

export interface LinkedInPostRequest {
  author: string;
  commentary: string;
  visibility: 'PUBLIC';
  distribution: {
    feedDistribution: 'MAIN_FEED';
    targetEntities: readonly [];
    thirdPartyDistributionChannels: readonly [];
  };
  lifecycleState: 'PUBLISHED';
}

function validApiVersion(value: string): boolean {
  if (!/^\d{6}$/.test(value)) return false;
  const month = Number(value.slice(4));
  return month >= 1 && month <= 12;
}

function approvalKey(credentials: LinkedInCredentials, payload: LinkedInPreparedPayload): string {
  return createHash('sha256')
    .update(credentials.accessToken)
    .update('\0')
    .update(payload.author)
    .update('\0')
    .update(payload.apiVersion)
    .update('\0')
    .update(payload.planDigest)
    .update('\0')
    .update(payload.text)
    .update('\0')
    .update(payload.commentary)
    .digest('hex');
}

function sanitizeDiagnostic(value: string, credentials: LinkedInCredentials): string {
  let result = value.replace(/authorization\s*[:=]\s*[^\r\n]+/gi, 'Authorization: [REDACTED]');
  if (credentials.accessToken !== '') {
    result = result.split(credentials.accessToken).join('[REDACTED]');
  }
  return result.trim().slice(0, MAX_DIAGNOSTIC_LENGTH);
}

function retryAfterSuffix(response: Response, credentials: LinkedInCredentials): string {
  const retryAfter = response.headers.get('retry-after');
  if (!retryAfter) return '';
  return ` Retry-After: ${sanitizeDiagnostic(retryAfter, credentials).slice(0, 80)}.`;
}

function rejected(reason: string, retryClassification: 'retryable' | 'permanent'): PublicationResult {
  return { status: 'rejected', reason, retryClassification };
}

function preflightRejected(reason: string, retryClassification: 'retryable' | 'permanent'): ProviderPreflightResult {
  return { status: 'rejected', reason, retryClassification };
}

function safeErrorMessage(error: unknown, credentials: LinkedInCredentials): string {
  if (error instanceof Error) return sanitizeDiagnostic(error.message, credentials);
  return 'Unexpected transport failure.';
}

function statusReason(prefix: string, status: number, retryAfter: string): string {
  return `${prefix} (HTTP ${status}).${retryAfter}`;
}

function isAmbiguousPostStatus(status: number): boolean {
  return (status >= 300 && status < 400) || status === 408 || status >= 500;
}

function postRequest(payload: LinkedInPreparedPayload): LinkedInPostRequest {
  return {
    author: payload.author,
    commentary: payload.commentary,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
  };
}

function postUrl(postUrn: string): string {
  return `https://www.linkedin.com/feed/update/${postUrn}`;
}

export class LinkedInProvider implements ReleaseSocialProvider<LinkedInCredentials, LinkedInPreparedPayload> {
  readonly destination = 'linkedin' as const;

  private readonly fetcher: LinkedInFetch;
  private readonly timeoutMs: number;
  private readonly approvals = new Set<string>();

  constructor(options: LinkedInProviderOptions = {}) {
    this.fetcher = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  prepare(plan: RenderedDestinationPlan): LinkedInPreparedPayload {
    const validated = validateRenderedPlan(plan);
    if (validated.destination !== 'linkedin' || validated.account.destination !== 'linkedin') {
      throw new Error('LinkedIn provider requires a validated LinkedIn destination plan.');
    }

    return {
      destination: 'linkedin',
      author: validated.account.author,
      apiVersion: validated.account.apiVersion,
      text: validated.text,
      commentary: escapeLinkedInCommentary(validated.text),
      planDigest: validated.digest,
    };
  }

  validate(payload: LinkedInPreparedPayload): ProviderValidationResult {
    const errors: string[] = [];

    if (payload.destination !== 'linkedin') errors.push('LinkedIn payload destination must be linkedin.');
    if (!/^urn:li:person:[^\s:]+$/.test(payload.author)) {
      errors.push('LinkedIn author must be a personal-profile URN matching urn:li:person:...');
    }
    if (!validApiVersion(payload.apiVersion)) errors.push('LinkedIn apiVersion must use a valid YYYYMM value.');
    if (!/^[0-9a-f]{64}$/.test(payload.planDigest)) {
      errors.push('LinkedIn payload planDigest must be a lowercase SHA-256 digest.');
    }
    if (payload.text.trim() === '') errors.push('LinkedIn commentary text must not be empty.');

    const expectedCommentary = escapeLinkedInCommentary(payload.text);
    if (payload.commentary !== expectedCommentary) {
      errors.push('LinkedIn commentary must be the literal-prose escaped form of the rendered text.');
    }

    const sourceLength = linkedInCharacterLength(payload.text);
    const encodedLength = linkedInCharacterLength(payload.commentary);
    if (sourceLength > LINKEDIN_COMMENTARY_MAX_CHARACTERS || encodedLength > LINKEDIN_COMMENTARY_MAX_CHARACTERS) {
      errors.push(
        `LinkedIn commentary exceeds the supported ${LINKEDIN_COMMENTARY_MAX_CHARACTERS}-character maximum after literal-text encoding.`,
      );
    }

    return errors.length === 0 ? { ok: true } : { ok: false, errors };
  }

  async preflight(
    credentials: LinkedInCredentials,
    payload: LinkedInPreparedPayload,
  ): Promise<ProviderPreflightResult> {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return preflightRejected(`Invalid LinkedIn payload: ${validation.errors.join(' ')}`, 'permanent');
    }

    const credentialErrors = validateLinkedInCredentials(credentials);
    if (credentialErrors.length > 0) {
      return preflightRejected(credentialErrors.join(' '), 'permanent');
    }

    // LinkedIn does not expose a suitable member-write preflight that avoids
    // unrelated/restricted member-read scopes. The create Posts API authorizes
    // the configured person URN, so preflight intentionally performs no network call.
    this.approvals.add(approvalKey(credentials, payload));
    return { status: 'ready' };
  }

  async publish(credentials: LinkedInCredentials, payload: LinkedInPreparedPayload): Promise<PublicationResult> {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return rejected(`Invalid LinkedIn payload: ${validation.errors.join(' ')}`, 'permanent');
    }

    const credentialErrors = validateLinkedInCredentials(credentials);
    if (credentialErrors.length > 0) {
      return rejected(credentialErrors.join(' '), 'permanent');
    }

    const key = approvalKey(credentials, payload);
    if (!this.approvals.delete(key)) {
      return rejected(
        'LinkedIn publish requires a successful preflight for this exact payload and access token.',
        'permanent',
      );
    }

    let response: Response;
    try {
      response = await fetchLinkedInWithTimeout(
        this.fetcher,
        {
          method: 'POST',
          headers: linkedInHeaders(credentials, payload.apiVersion),
          body: JSON.stringify(postRequest(payload)),
        },
        this.timeoutMs,
      );
    } catch (error: unknown) {
      const detail = safeErrorMessage(error, credentials);
      return {
        status: 'unknown',
        reason: `LinkedIn create request outcome is unknown after a transport failure${detail === '' ? '.' : `: ${detail}`}`,
      };
    }

    const retryAfter = retryAfterSuffix(response, credentials);

    if (response.status === 201) {
      const providerId = response.headers.get('x-restli-id')?.trim();
      if (!providerId || !POST_URN_PATTERN.test(providerId)) {
        return {
          status: 'unknown',
          reason: 'LinkedIn returned 201 without a usable x-restli-id; post creation cannot be ruled out.',
        };
      }
      return {
        status: 'published',
        providerId,
        url: postUrl(providerId),
      };
    }

    if (response.ok || isAmbiguousPostStatus(response.status)) {
      return {
        status: 'unknown',
        reason: statusReason(
          'LinkedIn create request returned an ambiguous response; post creation cannot be ruled out',
          response.status,
          retryAfter,
        ),
      };
    }

    if (response.status === 429) {
      return rejected(
        statusReason(
          'LinkedIn create request was rate limited without confirmed creation',
          response.status,
          retryAfter,
        ),
        'retryable',
      );
    }

    return rejected(
      statusReason('LinkedIn create request was rejected without confirmed creation', response.status, retryAfter),
      'permanent',
    );
  }
}

export function createLinkedInProvider(options: LinkedInProviderOptions = {}): LinkedInProvider {
  return new LinkedInProvider(options);
}

export { LINKEDIN_POSTS_URL };
