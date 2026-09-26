# Consumer adoption guide

release-social publishes one text-and-link announcement to **X** and/or a **personal LinkedIn profile**. Organization LinkedIn pages and other social networks are not supported by v0.1.

The package provides one deterministic core, provider implementations, a CLI, a bundled Node 24 GitHub Action, and duplicate-resistant publishing state.

## 1. Choose the release-content path

### Path A — ordinary GitHub-generated notes

This is the default path. Publish the GitHub Release normally, including GitHub-generated notes if your consumer workflow uses them. When release-social finds no authored release-social markers, it uses the already-published Release body.

Default configuration:

~~~json
{
  "version": 1,
  "content": {
    "missingAuthored": "github-release-notes"
  },
  "destinations": {
    "x": {
      "accountId": "123456789012345678"
    }
  }
}
~~~

content.missingAuthored supports:

- github-release-notes — default deterministic fallback.
- error — fail when authored sections are absent.
- skip — return authored_content_missing without provider calls or state writes.

Absent authored content means there are no release-social/announcement/social reserved markers outside fenced examples, except a valid standalone social:skip.

Partial, malformed, duplicate, unsupported, or fenced reserved markers are **errors**, not fallback candidates.

Fallback strips comments/raw HTML/code/contributor boilerplate/comparison URLs, neutralizes mention-like text, preserves real change wording, and fits whole entries/sentences to each provider's text rules. It reports inclusion/omission diagnostics. Empty or unusable bodies fall back to metadata-only copy.

### Path B — agent-authored sections

Use release-authoring.md and ../templates/release-notes.md.

The release writer produces authored sections from real release evidence. The consumer workflow may append GitHub-generated PR/contributor details. Publish that combined Markdown as one final GitHub Release body before invoking release-social.

Social publication only reads that body.

## 2. Select destinations

### X only

~~~json
{
  "version": 1,
  "destinations": {
    "x": {
      "accountId": "123456789012345678"
    }
  }
}
~~~

### LinkedIn personal profile only

~~~json
{
  "version": 1,
  "destinations": {
    "linkedin": {
      "author": "urn:li:person:FictionalMember123",
      "apiVersion": "202609"
    }
  }
}
~~~

### Both

~~~json
{
  "version": 1,
  "content": {
    "missingAuthored": "github-release-notes"
  },
  "destinations": {
    "x": {
      "accountId": "123456789012345678"
    },
    "linkedin": {
      "author": "urn:li:person:FictionalMember123",
      "apiVersion": "202609"
    }
  }
}
~~~

Omitted providers are disabled. Selecting zero destinations is an error.

## 3. Consumer-owned credentials

Credentials are never stored in public configuration or the public state branch.

### GitHub CLI credential

~~~text
GH_TOKEN
~~~

### GitHub Action token

Pass the Action's explicit token input from the consumer's GitHub credential.

### X

~~~text
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
~~~

The X app/user must be authorized for user-context posting. X pricing/access can change; providers/x.md links to X's current official pricing page instead of promising permanent free access.

### LinkedIn personal profile

~~~text
LINKEDIN_ACCESS_TOKEN
~~~

The authenticated member must authorize w_member_social. LinkedIn's self-service Share on LinkedIn product grants that member-posting permission. Access tokens expire and may require manual reauthorization. release-social does not assume programmatic refresh-token entitlement. See providers/linkedin.md.

Never share provider credentials through this public package, release notes, configuration, examples, outputs, or the state branch.

## 4. Preview before publish

~~~sh
GH_TOKEN=... release-social preview \
  --repository FICTIONAL-ORG/fictional-app \
  --release-id 12345678 \
  --config .github/release-social.json
~~~

Preview:

- loads no provider credentials;
- makes no provider API calls;
- writes no publishing receipts;
- prints exact final text and target identity;
- prints selected content source and fallback omission diagnostics;
- reports provider-pure validation results;
- reports eligibility/opt-out skips.

Platform limits apply to the **final text including the canonical release URL**.

X uses weighted-character rules and supports one standard 280-weighted-character post. LinkedIn uses its own commentary/escaping rules and the package's conservative 3,000-character boundary. Authored copy is never silently truncated.

## 5. Initialize duplicate-resistance state once

Before the first live publish:

~~~sh
GH_TOKEN=... release-social state-init \
  --repository FICTIONAL-ORG/fictional-app
~~~

This explicitly creates the data-only release-social-state branch. Publish and reconciliation never auto-create or recreate it.

The public branch stores only version/identity metadata, digests, timestamps, attempt state, public execution identity, and confirmed public post IDs/URLs. It stores no credentials, provider payloads, private notes, or raw provider responses.

Deleting or force-rewriting this branch invalidates recovery guarantees. Normal state updates use fast-forward Git ref updates with force:false.

## 6. Publish

~~~sh
GH_TOKEN=... \
X_API_KEY=... \
X_API_SECRET=... \
X_ACCESS_TOKEN=... \
X_ACCESS_TOKEN_SECRET=... \
LINKEDIN_ACCESS_TOKEN=... \
release-social publish \
  --repository FICTIONAL-ORG/fictional-app \
  --release-id 12345678 \
  --config .github/release-social.json
~~~

All selected destinations validate/preflight before the first social POST.

Confirmed successes are durable and skipped on rerun. A partial failure does not erase the successful destination. Ambiguous/pending attempts are never automatically resent.

## 7. Reconcile an uncertain exact attempt

After the originating publisher is quiescent, resolve the exact recorded attempt.

Confirmed public post:

~~~sh
GH_TOKEN=... release-social reconcile \
  --repository FICTIONAL-ORG/fictional-app \
  --record-key EXACT_RECORD_KEY \
  --attempt-number 1 \
  --attempt-id 11111111-1111-4111-8111-111111111111 \
  --resolution published \
  --provider-id EXACT_PUBLIC_POST_ID \
  --url EXACT_PUBLIC_POST_URL \
  --cli-settled
~~~

Confirmed non-creation:

~~~sh
GH_TOKEN=... release-social reconcile \
  --repository FICTIONAL-ORG/fictional-app \
  --record-key EXACT_RECORD_KEY \
  --attempt-number 1 \
  --attempt-id 11111111-1111-4111-8111-111111111111 \
  --resolution non-creation \
  --cli-settled
~~~

For GitHub Actions attempts, release-social verifies the originating run is completed using actions:read. For independent CLI attempts, --cli-settled is explicit operator attestation that the originating process stopped and all requests settled. Elapsed time alone is not evidence.

## 8. Correct a definitively non-created plan

A rejected/non-created attempt may need a corrected config such as a new LinkedIn apiVersion.

~~~sh
GH_TOKEN=... release-social revise \
  --repository FICTIONAL-ORG/fictional-app \
  --release-id 12345678 \
  --config .github/release-social.corrected.json \
  --destination linkedin \
  --record-key EXACT_RECORD_KEY \
  --attempt-number 1 \
  --attempt-id 11111111-1111-4111-8111-111111111111 \
  --old-digest EXACT_64_CHAR_SHA256
~~~

Revision preserves history and authorizes no social POST by itself. A later explicit publish may create the next attempt. Successful or still-unknown attempts cannot be revised.

See publishing-state.md for recovery details.

## 9. GitHub Action

Use the bundled Action after the consumer's package/release job succeeds. Pin to an immutable full commit SHA.

~~~yaml
- uses: aviaratech/release-social@REPLACE_WITH_FULL_40_CHAR_COMMIT_SHA
  with:
    mode: preview
    repository: OWNER/REPOSITORY
    release-id: 12345678
    config-path: .github/release-social.json
    token: GITHUB_TOKEN_FROM_CONSUMER_WORKFLOW
~~~

mode defaults to preview; live publication requires explicit publish.

Recommended concurrency:

~~~yaml
concurrency:
  group: release-social-REPOSITORY_ID-RELEASE_ID
  cancel-in-progress: false
~~~

Permissions:

- preview: contents:read;
- publish: contents:write for release-social-state;
- GitHub-run reconciliation: actions:read.

Repository rules must permit the publishing credential to fast-forward-update the state branch. Do not bypass protections by force-pushing or deleting history.

The Action reads already-checked-out trusted configuration and the canonical GitHub Release API. It does not check out or execute release-tag code. Do not use pull_request_target as a shortcut for social secrets.

Social secrets must be absent from PR/fork checks.

If the package/release job creates the GitHub Release using GITHUB_TOKEN, do not assume the resulting release event will trigger another workflow. Direct post-release invocation or manual workflow_dispatch is safer; see entrypoints.md.

## 10. Consumer standardization boundary

release-social standardizes release/social behavior only when the consumer explicitly adopts it in that repository's own release process.

It does not overwrite organization policy, repository agent instructions, or a maintainer's personal agent settings.

## Fictional rehearsal

../examples/fictional-consumer/README.md demonstrates the full flow using unmistakably fictional identities and mocked providers.

## Live proof

Offline CI proves contracts, rendering, provider request construction, state/recovery, CLI/Action integration, fixture validity, and bundle parity. It does not prove a real consumer's app entitlement, current token validity, or successful live social publication.

Use live-acceptance.md only after a consumer separately authorizes the exact accounts and exact preview text.
