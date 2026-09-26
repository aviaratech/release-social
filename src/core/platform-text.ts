import twitterText from 'twitter-text';

const { parseTweet } = twitterText;

export const X_MAX_WEIGHTED_LENGTH = 280;
export const LINKEDIN_COMMENTARY_MAX_CHARACTERS = 3000;

const LINKEDIN_RESERVED_CHARACTERS = new Set([
  '|',
  '{',
  '}',
  '@',
  '[',
  ']',
  '(',
  ')',
  '<',
  '>',
  '#',
  '\\',
  '*',
  '_',
  '~',
]);

export interface XTextMetrics {
  valid: boolean;
  weightedLength: number;
}

export interface LinkedInTextMetrics {
  valid: boolean;
  sourceLength: number;
  encodedLength: number;
  commentary: string;
}

export function measureXText(value: string): XTextMetrics {
  const parsed = parseTweet(value);
  return {
    valid: parsed.valid && parsed.weightedLength <= X_MAX_WEIGHTED_LENGTH,
    weightedLength: parsed.weightedLength,
  };
}

export function escapeLinkedInCommentary(value: string): string {
  let escaped = '';
  for (const character of value) {
    escaped += LINKEDIN_RESERVED_CHARACTERS.has(character) ? `\\${character}` : character;
  }
  return escaped;
}

export function linkedInCharacterLength(value: string): number {
  return Array.from(value).length;
}

export function measureLinkedInText(value: string): LinkedInTextMetrics {
  const commentary = escapeLinkedInCommentary(value);
  const sourceLength = linkedInCharacterLength(value);
  const encodedLength = linkedInCharacterLength(commentary);
  return {
    valid: sourceLength <= LINKEDIN_COMMENTARY_MAX_CHARACTERS && encodedLength <= LINKEDIN_COMMENTARY_MAX_CHARACTERS,
    sourceLength,
    encodedLength,
    commentary,
  };
}

export function destinationTextFits(destination: 'x' | 'linkedin', value: string): boolean {
  return destination === 'x' ? measureXText(value).valid : measureLinkedInText(value).valid;
}
