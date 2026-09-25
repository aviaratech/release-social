import type { CanonicalReleaseSource } from '../../src/index.js';

export const ENTRY_REPOSITORY = 'fictional/entrypoint-consumer';
export const ENTRY_RELEASE_ID = 515151;
export const ENTRY_REPOSITORY_ID = 424242;
export const ENTRY_URL = 'https://github.com/fictional/entrypoint-consumer/releases/tag/v1.2.3';

export function entrySource(body: string, overrides: Partial<CanonicalReleaseSource> = {}): CanonicalReleaseSource {
  return {
    repositoryId: ENTRY_REPOSITORY_ID,
    repository: ENTRY_REPOSITORY,
    releaseId: ENTRY_RELEASE_ID,
    tag: 'v1.2.3',
    releaseUrl: ENTRY_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
    ...overrides,
  };
}

export function githubReleaseFetch(source: CanonicalReleaseSource): typeof fetch {
  return async (input) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    if (url === `https://api.github.com/repos/${source.repository}`) {
      return Response.json({
        id: source.repositoryId,
        full_name: source.repository,
        private: source.visibility === 'private',
        visibility: source.visibility,
      });
    }

    if (url === `https://api.github.com/repos/${source.repository}/releases/${source.releaseId}`) {
      return Response.json({
        id: source.releaseId,
        tag_name: source.tag,
        html_url: source.releaseUrl,
        body: source.body,
        draft: source.draft,
        prerelease: source.prerelease,
      });
    }

    throw new Error(`Unexpected synthetic GitHub request: ${url}`);
  };
}

export function generatedBody(extra = ''): string {
  return [
    "## What's Changed",
    '* Ship synthetic entrypoint support.',
    '* Keep release text inert: ' + extra,
  ].join('\n');
}

export function xConfig(): object {
  return {
    version: 1,
    destinations: {
      x: { accountId: '123456789012345678' },
    },
  };
}
