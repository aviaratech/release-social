# Optional live acceptance procedure

Live provider acceptance is optional and is **not performed by repository CI**. This procedure is a manual consumer authorization step after offline verification is green.

Do not run it with production accounts merely to satisfy CI. Do not record secrets in this repository.

## Required authorization record

Before a live POST, the consumer must create an operator-local record containing the exact targets and exact previewed text:

~~~text
Source repository: EXACT_OWNER/EXACT_REPOSITORY
GitHub release ID: EXACT_NUMERIC_RELEASE_ID
GitHub release URL: EXACT_CANONICAL_RELEASE_URL

X enabled: yes|no
Exact X account ID: EXACT_NUMERIC_X_ACCOUNT_ID
Exact X text including final release URL:
<<<
COPY THE COMPLETE X TEXT FROM release-social preview
>>>

LinkedIn enabled: yes|no
Exact LinkedIn author URN: urn:li:person:EXACT_MEMBER_ID
Exact LinkedIn API version: EXACT_SUPPORTED_YYYYMM
Exact LinkedIn text including final release URL:
<<<
COPY THE COMPLETE LINKEDIN TEXT FROM release-social preview
>>>
~~~

The operator separately confirms that those exact accounts are consumer-owned/authorized and that the exact text is approved for public posting.

## Procedure

1. Run the normal offline suite and bundle parity checks.
2. Verify the source is the intended stable public GitHub Release.
3. Run release-social preview with provider secrets absent.
4. Copy the exact target identities/text into the authorization record above.
5. Verify X app/user write access and current pricing/access terms.
6. Verify the LinkedIn member has authorized w_member_social, the configured apiVersion is currently supported, and the access token is not expired.
7. Confirm release-social-state was initialized explicitly and repository rules allow non-force fast-forward updates.
8. Supply consumer-owned secrets only to the explicitly authorized publish process.
9. Run one explicit publish.
10. Record only public post IDs/URLs and the release-social aggregate result. Never record tokens, raw Authorization headers, or provider payloads.
11. If any outcome is unknown, do not rerun publish. Follow exact-attempt reconciliation after the originating process/run is quiescent.

## Evidence boundary

A successful live acceptance proves only the exact authorized accounts, text, and API versions tested at that time. It does not establish permanent provider entitlement, permanent pricing, token refresh eligibility, or future API-version support.

Repository documentation must continue to label live proof separately from offline CI.
