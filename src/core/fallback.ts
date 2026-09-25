import { createHash } from 'node:crypto';

import { validationError } from './errors.js';
import { destinationTextFits } from './platform-text.js';
import type { CanonicalReleaseSource, Destination, GitHubReleaseNotesTextSource } from './types.js';

const FENCE_PATTERN = /^\s*(`{3,}|~{3,})/;
const HTML_BLOCK_PATTERN = /<(script|style|iframe|object|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->/g;
const MARKDOWN_LINK_PATTERN = /!?\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g;
const BARE_URL_PATTERN = /\bhttps?:\/\/[^\s)\]>]+/gi;
const MENTION_PATTERN = /@([A-Za-z0-9_][A-Za-z0-9_-]*)/g;

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

function stripFencedCode(value: string): string {
  const output: string[] = [];
  let fence: { character: '`' | '~'; length: number } | undefined;

  for (const line of value.split('\n')) {
    const match = FENCE_PATTERN.exec(line);
    if (match?.[1]) {
      const marker = match[1];
      const character = marker[0] as '`' | '~';
      if (fence === undefined) {
        fence = { character, length: marker.length };
        continue;
      }
      if (character === fence.character && marker.length >= fence.length) {
        fence = undefined;
      }
      continue;
    }
    if (fence === undefined) output.push(line);
  }

  return output.join('\n');
}

function neutralizeMentions(value: string): string {
  return value.replace(MENTION_PATTERN, '$1');
}

function cleanInlineMarkdown(value: string): string {
  return neutralizeMentions(
    value
      .replace(MARKDOWN_LINK_PATTERN, '$1')
      .replace(BARE_URL_PATTERN, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/[\*_~]/g, '')
      .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function isBoilerplateHeading(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized === "what's changed" ||
    normalized === 'whats changed' ||
    normalized === 'new contributors' ||
    normalized === 'contributors' ||
    normalized === 'full changelog' ||
    normalized === 'changelog'
  );
}

function isBoilerplateLine(value: string): boolean {
  return (
    /^full changelog\s*:/i.test(value) ||
    /github\.com\/[^\s]+\/compare\//i.test(value) ||
    /\bmade (?:his|her|their) first contribution\b/i.test(value)
  );
}

function cleanChangeLine(value: string): string {
  let cleaned = value
    .replace(/^\s*(?:[-+*]|\d+[.)])\s+/, '')
    .replace(/\s+by\s+@[A-Za-z0-9_-]+\s+in\s+https?:\/\/\S+\s*$/i, '')
    .replace(/\s+by\s+@[A-Za-z0-9_-]+\s*$/i, '');

  cleaned = cleanInlineMarkdown(cleaned);
  return cleaned;
}

function sentenceEntries(value: string): string[] {
  const trimmed = value.trim();
  if (trimmed === '') return [];
  const matches = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [trimmed];
  return matches.map((entry) => entry.trim()).filter((entry) => entry !== '');
}

export function extractGitHubReleaseChangeEntries(body: string): string[] {
  const normalized = normalizeLineEndings(body).replace(HTML_BLOCK_PATTERN, '').replace(HTML_COMMENT_PATTERN, '');
  const withoutCode = stripFencedCode(normalized);
  const entries: string[] = [];
  let skipContributorSection = false;

  for (const rawLine of withoutCode.split('\n')) {
    const trimmed = rawLine.trim();
    if (trimmed === '') continue;

    if (/^<\/?[A-Za-z][^>]*>/.test(trimmed) || /<\/?[A-Za-z][^>]*>/.test(trimmed)) {
      continue;
    }

    const heading = /^#{1,6}\s+(.+)$/.exec(trimmed);
    if (heading?.[1]) {
      const headingText = cleanInlineMarkdown(heading[1]);
      skipContributorSection =
        headingText.toLowerCase() === 'new contributors' || headingText.toLowerCase() === 'contributors';
      continue;
    }

    if (skipContributorSection) continue;
    if (isBoilerplateLine(trimmed)) continue;

    const cleaned = cleanChangeLine(trimmed);
    if (cleaned === '' || isBoilerplateHeading(cleaned)) continue;

    const isListItem = /^\s*(?:[-+*]|\d+[.)])\s+/.test(rawLine);
    if (isListItem) {
      entries.push(cleaned);
      continue;
    }

    entries.push(...sentenceEntries(cleaned));
  }

  return entries;
}

function fallbackContentDigest(body: string): string {
  return createHash('sha256').update(normalizeLineEndings(body), 'utf8').digest('hex');
}

function neutralIntroduction(source: CanonicalReleaseSource): string {
  return neutralizeMentions(`${source.repository} ${source.tag} is available.`);
}

export function renderGitHubReleaseNotesFallback(
  destination: Destination,
  source: CanonicalReleaseSource,
): { prose: string; textSource: GitHubReleaseNotesTextSource } {
  const introduction = neutralIntroduction(source);
  const introductionText = `${introduction}\n\n${source.releaseUrl}`;
  if (!destinationTextFits(destination, introductionText)) {
    validationError(
      'fallback_metadata_overflow',
      '$.source',
      `repository/tag metadata plus the canonical release URL cannot fit the ${destination} text limit`,
    );
  }

  const entries = extractGitHubReleaseChangeEntries(source.body);
  let prose = introduction;
  let includedEntries = 0;

  for (const entry of entries) {
    const candidate = `${prose} ${entry}`;
    if (destinationTextFits(destination, `${candidate}\n\n${source.releaseUrl}`)) {
      prose = candidate;
      includedEntries += 1;
    }
  }

  const omittedEntries = entries.length - includedEntries;
  const omissionReason =
    entries.length === 0
      ? source.body.trim() === ''
        ? 'empty_body'
        : 'no_useful_content'
      : omittedEntries > 0
        ? 'budget'
        : 'none';

  return {
    prose,
    textSource: {
      kind: 'github_release_notes',
      contentDigest: fallbackContentDigest(source.body),
      includedEntries,
      omittedEntries,
      omissionReason,
    },
  };
}
