import type { CanonicalReleaseSource, SourceVisibility } from '../core/types.js';

const GITHUB_API_ORIGIN = 'https://api.github.com';
const GITHUB_API_VERSION = '2026-03-10';

export interface GitHubReleaseReaderOptions {
  token: string;
  fetch?: typeof fetch;
}

export interface GitHubReleaseRequest {
  repository: string;
  releaseId: number;
}

function repositoryParts(repository: string): { owner: string; name: string } {
  const match = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(repository);
  if (!match?.[1] || !match[2]) throw new Error('GitHub repository must use owner/name.');
  return { owner: match[1], name: match[2] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`GitHub returned invalid ${name}.`);
  return value;
}

function requiredInteger(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`GitHub returned invalid ${name}.`);
  }
  return value;
}

function visibilityFor(repository: Record<string, unknown>): SourceVisibility {
  if (repository.private === true) return 'private';
  if (repository.visibility === 'internal') return 'internal';
  return 'public';
}

export class GitHubReleaseReader {
  private readonly token: string;
  private readonly fetcher: typeof fetch;

  constructor(options: GitHubReleaseReaderOptions) {
    if (options.token.trim() === '') throw new Error('GitHub token must not be empty.');
    this.token = options.token;
    this.fetcher = options.fetch ?? fetch;
  }

  async read(request: GitHubReleaseRequest): Promise<CanonicalReleaseSource> {
    const { owner, name } = repositoryParts(request.repository);
    const repository = await this.getJson(`/repos/${owner}/${name}`, 'repository');
    const release = await this.getJson(`/repos/${owner}/${name}/releases/${request.releaseId}`, 'release');

    const repositoryId = requiredInteger(repository.id, 'repository ID');
    const fullName = requiredString(repository.full_name, 'repository full_name');
    if (fullName.toLowerCase() !== request.repository.toLowerCase()) {
      throw new Error('GitHub repository identity did not match the requested repository.');
    }

    const releaseId = requiredInteger(release.id, 'release ID');
    if (releaseId !== request.releaseId)
      throw new Error('GitHub release identity did not match the requested release ID.');

    const body = release.body;
    if (body !== null && typeof body !== 'string') throw new Error('GitHub returned invalid release body.');

    return {
      repositoryId,
      repository: fullName,
      releaseId,
      tag: requiredString(release.tag_name, 'release tag'),
      releaseUrl: requiredString(release.html_url, 'release URL'),
      body: body ?? '',
      draft: release.draft === true,
      prerelease: release.prerelease === true,
      visibility: visibilityFor(repository),
    };
  }

  private async getJson(path: string, operation: string): Promise<Record<string, unknown>> {
    const url = new URL(path, GITHUB_API_ORIGIN);
    if (url.origin !== GITHUB_API_ORIGIN) throw new Error('GitHub release request escaped the official API host.');

    const headers = new Headers();
    headers.set('accept', 'application/vnd.github+json');
    headers.set('authorization', `Bearer ${this.token}`);
    headers.set('x-github-api-version', GITHUB_API_VERSION);

    let response: Response;
    try {
      response = await this.fetcher(url, { method: 'GET', headers, redirect: 'manual' });
    } catch {
      throw new Error(`GitHub ${operation} request failed.`);
    }

    if (response.status >= 300 && response.status < 400) {
      throw new Error(`GitHub ${operation} request refused a redirect.`);
    }
    if (response.status !== 200) throw new Error(`GitHub ${operation} request failed with HTTP ${response.status}.`);

    let parsed: unknown;
    try {
      parsed = await response.json();
    } catch {
      throw new Error(`GitHub returned malformed ${operation} JSON.`);
    }
    if (!isRecord(parsed)) throw new Error(`GitHub returned malformed ${operation} metadata.`);
    return parsed;
  }
}
