import { validationError } from './errors.js';
import type { Destination, ParsedReleaseNotes } from './types.js';

const VERSION_MARKER = '<!-- release-social:v1 -->';
const ANNOUNCEMENT_START = '<!-- announcement:start -->';
const ANNOUNCEMENT_END = '<!-- announcement:end -->';
const SKIP_MARKER = '<!-- social:skip -->';

interface TextRange {
  start: number;
  end: number;
}

interface CommentToken extends TextRange {
  raw: string;
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

function trimBoundaryWhitespace(value: string): string {
  return value.trim();
}

function getFenceRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  const lines = text.split('\n');
  let offset = 0;
  let open: { start: number; character: '`' | '~'; length: number } | undefined;

  for (const line of lines) {
    const match = /^\s*(`{3,}|~{3,})/.exec(line);
    if (match?.[1]) {
      const marker = match[1];
      const character = marker[0] as '`' | '~';
      if (open === undefined) {
        open = { start: offset, character, length: marker.length };
      } else if (character === open.character && marker.length >= open.length) {
        ranges.push({ start: open.start, end: offset + line.length });
        open = undefined;
      }
    }
    offset += line.length + 1;
  }

  if (open !== undefined) {
    ranges.push({ start: open.start, end: text.length });
  }

  return ranges;
}

function scanComments(text: string): CommentToken[] {
  const starts = text.match(/<!--/g)?.length ?? 0;
  const tokens: CommentToken[] = [];
  const expression = /<!--[\s\S]*?-->/g;
  for (const match of text.matchAll(expression)) {
    if (match.index === undefined) continue;
    tokens.push({ start: match.index, end: match.index + match[0].length, raw: match[0] });
  }

  if (starts !== tokens.length) {
    validationError(
      'malformed_comment',
      '$.releaseNotes',
      'contains an unclosed or nested HTML comment; reserved markers must be complete and non-nested',
    );
  }
  return tokens;
}

function isInside(position: number, ranges: readonly TextRange[]): boolean {
  return ranges.some((range) => position >= range.start && position <= range.end);
}

function isReservedComment(raw: string): boolean {
  const inner = raw.slice(4, -3).trimStart();
  return inner.startsWith('release-social:') || inner.startsWith('announcement:') || inner.startsWith('social:');
}

function validatePlainText(value: string, path: string): string {
  const text = trimBoundaryWhitespace(value);
  if (text === '') validationError('empty_prose', path, 'must contain non-empty plain text');
  if (/\n[\t ]*\n/.test(text)) {
    validationError('multiple_paragraphs', path, 'must contain exactly one paragraph');
  }
  if (/(^|\n)\s*(#{1,6}\s|[-+*]\s|>\s|\d+[.)]\s|```|~~~)/.test(text)) {
    validationError('markdown_in_prose', path, 'must be plain text, not a Markdown block');
  }
  if (/`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|!?\[[^\]]+\]\([^)]*\)|<\/?[A-Za-z][^>]*>/.test(text)) {
    validationError('markup_in_prose', path, 'must be plain text, not HTML or inline Markdown');
  }
  if (text.includes('\0')) validationError('invalid_prose', path, 'must not contain NUL bytes');
  return text;
}

function findVisibleH2(text: string, fences: readonly TextRange[], comments: readonly CommentToken[]): Array<{
  title: string;
  start: number;
  contentStart: number;
}> {
  const headings: Array<{ title: string; start: number; contentStart: number }> = [];
  const lines = text.split('\n');
  let offset = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      if (!isInside(offset, fences) && !isInside(offset, comments)) {
        headings.push({ title: trimmed.slice(3).trim(), start: offset, contentStart: offset + line.length + 1 });
      }
    }
    offset += line.length + 1;
  }
  return headings;
}

function sectionContent(
  text: string,
  heading: { start: number; contentStart: number },
  allHeadings: readonly { start: number }[],
): string {
  const next = allHeadings.find((candidate) => candidate.start > heading.start);
  const end = next?.start ?? text.length;
  return text
    .slice(heading.contentStart, end)
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

export function parseReleaseNotes(input: string): ParsedReleaseNotes {
  const text = normalizeLineEndings(input);
  if (!text.startsWith(VERSION_MARKER)) {
    validationError('missing_version_marker', '$.releaseNotes', `must begin exactly with ${VERSION_MARKER}`);
  }

  const fences = getFenceRanges(text);
  const comments = scanComments(text);
  const supportedStandalone = new Set([VERSION_MARKER, ANNOUNCEMENT_START, ANNOUNCEMENT_END, SKIP_MARKER]);
  const counts = new Map<string, number>();
  const socialBlocks: Partial<Record<'short' | Destination, string>> = {};

  for (const comment of comments) {
    if (!isReservedComment(comment.raw)) continue;
    if (isInside(comment.start, fences)) {
      validationError('marker_in_fence', '$.releaseNotes', 'reserved release-social markers are not allowed inside fenced code');
    }

    if (supportedStandalone.has(comment.raw)) {
      counts.set(comment.raw, (counts.get(comment.raw) ?? 0) + 1);
      continue;
    }

    const block = /^<!-- social:(short|x|linkedin)\n([\s\S]*?)\n?-->$/.exec(comment.raw);
    if (block?.[1] && block[2] !== undefined) {
      const name = block[1] as 'short' | Destination;
      if (socialBlocks[name] !== undefined) {
        validationError('duplicate_social_block', '$.releaseNotes', `contains more than one social:${name} block`);
      }
      socialBlocks[name] = validatePlainText(block[2], `$.releaseNotes.social.${name}`);
      continue;
    }

    validationError(
      'unsupported_reserved_marker',
      '$.releaseNotes',
      `contains malformed or unsupported reserved marker: ${comment.raw.split('\n', 1)[0] ?? comment.raw}`,
    );
  }

  if ((counts.get(VERSION_MARKER) ?? 0) !== 1) {
    validationError('duplicate_version_marker', '$.releaseNotes', 'must contain exactly one release-social:v1 marker');
  }
  if ((counts.get(ANNOUNCEMENT_START) ?? 0) !== 1 || (counts.get(ANNOUNCEMENT_END) ?? 0) !== 1) {
    validationError('announcement_marker_count', '$.releaseNotes', 'must contain exactly one announcement:start and announcement:end marker');
  }
  if ((counts.get(SKIP_MARKER) ?? 0) > 1) {
    validationError('duplicate_skip_marker', '$.releaseNotes', 'must not contain more than one social:skip marker');
  }
  if (socialBlocks.short === undefined) {
    validationError('missing_short_block', '$.releaseNotes', 'must contain exactly one non-empty social:short block');
  }

  const start = text.indexOf(ANNOUNCEMENT_START);
  const end = text.indexOf(ANNOUNCEMENT_END);
  if (start >= end) {
    validationError('announcement_order', '$.releaseNotes', 'announcement:start must occur before announcement:end');
  }
  const announcement = validatePlainText(
    text.slice(start + ANNOUNCEMENT_START.length, end),
    '$.releaseNotes.announcement',
  );

  const headings = findVisibleH2(text, fences, comments);
  const highlights = headings.filter((heading) => heading.title === 'Highlights');
  const upgradeNotes = headings.filter((heading) => heading.title === 'Upgrade notes');
  if (highlights.length !== 1) {
    validationError('highlights_section_count', '$.releaseNotes', 'must contain exactly one visible ## Highlights section');
  }
  if (upgradeNotes.length !== 1) {
    validationError('upgrade_notes_section_count', '$.releaseNotes', 'must contain exactly one visible ## Upgrade notes section');
  }
  const highlightsHeading = highlights[0];
  const upgradeHeading = upgradeNotes[0];
  if (highlightsHeading === undefined || upgradeHeading === undefined) {
    validationError('missing_sections', '$.releaseNotes', 'required sections are missing');
  }
  if (highlightsHeading.start >= upgradeHeading.start) {
    validationError('section_order', '$.releaseNotes', '## Highlights must appear before ## Upgrade notes');
  }

  const highlightsText = sectionContent(text, highlightsHeading, headings);
  const upgradeText = sectionContent(text, upgradeHeading, headings);
  if (highlightsText === '') {
    validationError('empty_highlights', '$.releaseNotes', '## Highlights must retain technical release details');
  }
  if (upgradeText === '') {
    validationError('empty_upgrade_notes', '$.releaseNotes', '## Upgrade notes must describe upgrade impact or state that there are no breaking changes');
  }

  const overrides: Partial<Record<Destination, string>> = {};
  if (socialBlocks.x !== undefined) overrides.x = socialBlocks.x;
  if (socialBlocks.linkedin !== undefined) overrides.linkedin = socialBlocks.linkedin;

  return {
    announcement,
    short: socialBlocks.short,
    overrides,
    highlights: highlightsText,
    upgradeNotes: upgradeText,
    skip: (counts.get(SKIP_MARKER) ?? 0) === 1,
  };
}
