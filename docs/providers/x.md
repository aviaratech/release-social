# X provider

The X provider publishes one text-only X post for a validated release-social destination. It uses X API v2, OAuth 1.0a user context, and the exact final text produced by the shared core.

## Required X setup

Create or select an X developer app that is authorized to post for the intended consumer-owned X account.

The app/account must support:

- OAuth 1.0a User Context.
- Read access for the authenticated-user identity preflight.
- Write access for creating posts.
- An API plan with sufficient access/credits for the endpoints the consumer intends to call.

X access and pricing can change. Check the current official pricing and Developer Console rather than assuming permanent free access or a fixed per-request cost:

- https://docs.x.com/x-api/getting-started/pricing

The provider uses these fixed API operations:

- `GET https://api.x.com/2/users/me` for read-only identity verification.
- `POST https://api.x.com/2/tweets` for one text-only post.

## Credentials

Generate OAuth 1.0a credentials for the X user that should publish the release announcement. If app permissions are changed, follow X's current developer-console guidance for regenerating user access tokens as needed.

Expose exactly these environment variables to the process that performs live X operations:

```text
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
```

Do not put these values in release notes, release-social configuration, rendered plans, repository files, CI logs, or receipts. App-only bearer tokens are not a publishing fallback for this provider.

The expected publishing account ID is non-secret configuration. Consumers may either keep `accountId` in the destination config or supply the numeric ID through `X_ACCOUNT_ID`. If both are present, they must match exactly. Centralizing `X_ACCOUNT_ID` as a repository or organization variable avoids duplicating one account ID across many consumer repositories.

## Runtime behavior

Preparation and validation are offline. They do not load credentials or contact X.

Validation applies X's weighted-character rules through `twitter-text` to the exact final payload, including the canonical release URL. The provider supports one standard post up to 280 weighted characters and never truncates or splits the text.

Before publication, call the provider's live `preflight` method. It signs a read-only identity request and verifies that the authenticated X user ID equals the configured numeric `accountId`. A successful preflight grants a one-use publication approval for that account and credential set.

`publish` then performs at most one create POST. It never follows redirects and never automatically retries an ambiguous create outcome. A transport timeout, 5xx response, redirect, request timeout response, or malformed success without a post ID is returned as `unknown` because creation cannot safely be ruled out.

The provider returns bounded, redacted diagnostic text. It does not log raw HTTP request or response objects and does not expose OAuth secrets or Authorization headers in returned failures.

## Consumer example

```ts
import { createXProvider, loadXCredentials } from '@aviaratech/release-social/providers/x';

const provider = createXProvider();
const credentials = loadXCredentials();

const payload = provider.prepare(renderedXPlan);
const validation = provider.validate(payload);

if (!validation.ok) {
  throw new Error(validation.errors.join(' '));
}

const preflight = await provider.preflight(credentials, payload);
if (preflight.status !== 'ready') {
  throw new Error(preflight.reason);
}

const result = await provider.publish(credentials, payload);
```

In a multi-destination publisher, complete live preflight for every selected destination before issuing any social POST.
