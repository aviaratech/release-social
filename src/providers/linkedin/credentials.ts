export interface LinkedInCredentials {
  accessToken: string;
}

export const LINKEDIN_CREDENTIAL_ENV_NAME = 'LINKEDIN_ACCESS_TOKEN' as const;

export function loadLinkedInCredentials(env: NodeJS.ProcessEnv = process.env): LinkedInCredentials {
  const accessToken = env.LINKEDIN_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Missing required LinkedIn credential environment variable: LINKEDIN_ACCESS_TOKEN');
  }
  return { accessToken };
}

export function validateLinkedInCredentials(credentials: LinkedInCredentials): readonly string[] {
  return credentials.accessToken.trim() === '' ? ['LINKEDIN_ACCESS_TOKEN is empty.'] : [];
}
