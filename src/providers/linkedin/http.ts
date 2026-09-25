import type { LinkedInCredentials } from './credentials.js';

export const LINKEDIN_POSTS_URL = 'https://api.linkedin.com/rest/posts' as const;
export const LINKEDIN_RESTLI_PROTOCOL_VERSION = '2.0.0' as const;

export type LinkedInFetch = typeof fetch;

export function linkedInHeaders(credentials: LinkedInCredentials, apiVersion: string): Headers {
  const headers = new Headers();
  headers.set('accept', 'application/json');
  headers.set('authorization', `Bearer ${credentials.accessToken}`);
  headers.set('content-type', 'application/json');
  headers.set('linkedin-version', apiVersion);
  headers.set('x-restli-protocol-version', LINKEDIN_RESTLI_PROTOCOL_VERSION);
  return headers;
}

export async function fetchLinkedInWithTimeout(
  fetcher: LinkedInFetch,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher(LINKEDIN_POSTS_URL, {
      ...init,
      redirect: 'manual',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
