export interface XCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export const X_CREDENTIAL_ENV_NAMES = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'] as const;

export function loadXCredentials(env: NodeJS.ProcessEnv = process.env): XCredentials {
  const apiKey = env.X_API_KEY;
  const apiSecret = env.X_API_SECRET;
  const accessToken = env.X_ACCESS_TOKEN;
  const accessTokenSecret = env.X_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    const missing: string[] = [];
    if (!apiKey) missing.push('X_API_KEY');
    if (!apiSecret) missing.push('X_API_SECRET');
    if (!accessToken) missing.push('X_ACCESS_TOKEN');
    if (!accessTokenSecret) missing.push('X_ACCESS_TOKEN_SECRET');

    throw new Error(`Missing required X credential environment variable(s): ${missing.join(', ')}`);
  }

  return { apiKey, apiSecret, accessToken, accessTokenSecret };
}

export function validateXCredentials(credentials: XCredentials): readonly string[] {
  const errors: string[] = [];
  if (credentials.apiKey.trim() === '') errors.push('X_API_KEY is empty.');
  if (credentials.apiSecret.trim() === '') errors.push('X_API_SECRET is empty.');
  if (credentials.accessToken.trim() === '') errors.push('X_ACCESS_TOKEN is empty.');
  if (credentials.accessTokenSecret.trim() === '') errors.push('X_ACCESS_TOKEN_SECRET is empty.');
  return errors;
}
