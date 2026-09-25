# LinkedIn personal-profile provider

The LinkedIn provider publishes one public, text-only release announcement to an explicitly configured personal member profile. It uses the current versioned Posts API and does not use the replaced `ugcPosts` endpoint.

## Current official API check

Checked against LinkedIn's Microsoft Learn documentation on **September 25, 2026**:

- Posts API: `POST https://api.linkedin.com/rest/posts` is the current create endpoint and replaces new `ugcPosts` integrations.
- Personal-profile posting uses `w_member_social`; organization posting uses separate organization permissions and is out of scope here.
- Requests require `Linkedin-Version: YYYYMM` and `X-Restli-Protocol-Version: 2.0.0`.
- Text-only organic posts use `PUBLIC` visibility, `MAIN_FEED` distribution, empty `targetEntities` and `thirdPartyDistributionChannels`, and `PUBLISHED` lifecycle.
- A successful create returns HTTP 201 with the post URN in the `x-restli-id` response header.
- Commentary uses LinkedIn's `little` text grammar. Reserved characters `| { } @ [ ] ( ) < > # \\ * _ ~` must be escaped with a backslash to remain literal text.

Official references:

- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens

### Commentary length provenance

The current Posts API documentation reports `FIELD_LENGTH_TOO_LONG` for commentary that exceeds the allowed maximum, but does not currently publish the numeric value on that page. LinkedIn's still-current official UGC Post documentation states a **3,000-character** text maximum. This provider therefore enforces 3,000 characters conservatively on both the literal rendered text and its required `little`-escaped representation. That limit should be rechecked when LinkedIn changes its Posts documentation.

## Required consumer setup

The consumer supplies exactly one credential:

```text
LINKEDIN_ACCESS_TOKEN
```

The token must authorize the configured personal profile and include `w_member_social`. The release-social configuration continues to supply:

```json
{
  "version": 1,
  "destinations": {
    "linkedin": {
      "author": "urn:li:person:FictionalMember123",
      "apiVersion": "202609"
    }
  }
}
```

Use a LinkedIn API version that is currently supported when the consumer runs. Version support changes over time; this package validates the `YYYYMM` shape offline, while LinkedIn remains authoritative for whether a specific version is still accepted.

Do not substitute an organization URN. Organization/page publishing requires separate organization permissions and is outside this provider's scope.

## Preflight and publication behavior

Preparation and validation are pure and offline. They do not load credentials or contact LinkedIn.

The live orchestration should call `preflight` for every selected destination before any social destination publishes. LinkedIn does not expose a suitable member-write authorization probe that avoids unrelated or restricted member-read permissions. Accordingly, this provider's preflight validates the configured person/version/payload and the presence of `LINKEDIN_ACCESS_TOKEN`, performs **no member-read request**, and grants a one-use approval bound to the exact payload and token.

The create request itself is what authorizes the configured `urn:li:person:...`. The provider never falls back to another member or organization identity.

Publication:

- sends one POST at most;
- uses only `https://api.linkedin.com/rest/posts`;
- refuses credential-bearing redirects by using manual redirect handling;
- sends the exact escaped rendered announcement as `commentary`;
- adds no media, article scraping, or preview-card pipeline;
- returns `published` only when HTTP 201 includes a usable `x-restli-id`;
- returns `unknown` for transport ambiguity, redirects, 5xx, unexpected success statuses, or missing success confirmation;
- never polls member feeds or requires restricted `r_member_social`;
- never retries the POST automatically.

Provider errors contain bounded status-oriented diagnostics only. Raw provider request/response payloads are not logged or returned, and access tokens/Authorization material are redacted from transport errors.

## Token expiry and reauthorization

LinkedIn access tokens are generally issued with a 60-day lifetime. Consumers must be prepared to reauthorize before or after expiry.

Programmatic refresh tokens are **not assumed** by this package. LinkedIn documents them for approved Marketing Developer Platform partners; when available they have their own fixed lifetime and still eventually require member reauthorization. This provider neither stores refresh tokens nor silently refreshes access tokens.

For a consumer that does not have approved programmatic refresh-token entitlement, renew access by running the normal LinkedIn authorization flow again and updating `LINKEDIN_ACCESS_TOKEN`.

## Offline versus live evidence

CI proves request construction, validation, escaping, result classification, redaction, redirect refusal, and one-shot POST behavior using fictional data and mocked HTTP.

CI does **not** prove that a particular LinkedIn app currently has the required product entitlement, that a real member granted `w_member_social`, that a configured API version is still accepted on the date of a live run, or that a real token can publish. Those remain consumer-owned live setup evidence.
