import { OAuth } from 'oauth';

import type { XCredentials } from './credentials.js';

export const X_API_ORIGIN = 'https://api.x.com';
export const X_ME_URL = `${X_API_ORIGIN}/2/users/me`;
export const X_CREATE_POST_URL = `${X_API_ORIGIN}/2/tweets`;

export type XFetch = typeof fetch;

const OAUTH_REQUEST_TOKEN_URL = `${X_API_ORIGIN}/oauth/request_token`;
const OAUTH_ACCESS_TOKEN_URL = `${X_API_ORIGIN}/oauth/access_token`;

export function createAuthorizationHeader(
  credentials: XCredentials,
  url: typeof X_ME_URL | typeof X_CREATE_POST_URL,
  method: 'GET' | 'POST',
): string {
  const oauth = new OAuth(
    OAUTH_REQUEST_TOKEN_URL,
    OAUTH_ACCESS_TOKEN_URL,
    credentials.apiKey,
    credentials.apiSecret,
    '1.0',
    null,
    'HMAC-SHA1',
  );

  return oauth.authHeader(url, credentials.accessToken, credentials.accessTokenSecret, method);
}

export async function fetchWithTimeout(
  fetcher: XFetch,
  url: typeof X_ME_URL | typeof X_CREATE_POST_URL,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher(url, {
      ...init,
      redirect: 'manual',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
