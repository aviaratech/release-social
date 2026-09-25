export const LINKEDIN_COMMENTARY_MAX_CHARACTERS = 3000;

const RESERVED_CHARACTERS = new Set(['|', '{', '}', '@', '[', ']', '(', ')', '<', '>', '#', '\\', '*', '_', '~']);

/**
 * LinkedIn Posts commentary uses the "little" text grammar. Reserved characters
 * must be backslash-escaped to preserve literal prose semantics.
 *
 * Official grammar:
 * https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format
 */
export function escapeLinkedInCommentary(value: string): string {
  let escaped = '';
  for (const character of value) {
    escaped += RESERVED_CHARACTERS.has(character) ? `\\${character}` : character;
  }
  return escaped;
}

export function linkedInCharacterLength(value: string): number {
  return Array.from(value).length;
}
