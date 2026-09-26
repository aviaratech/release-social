# Fictional consumer rehearsal

Everything under this directory is fictional. The repository, account IDs, member URNs, release IDs, post IDs, and workflow values do not identify a real consumer.

Synthetic consumer:

~~~text
Repository: fictional/release-social-consumer
Repository ID: 424242
Release ID: 515151
Tag: v1.2.3
X account ID: 123456789012345678
LinkedIn author: urn:li:person:FictionalMember123
~~~

No fixture contains a real provider credential.

## What the rehearsal demonstrates

The intended consumer flow is:

1. A release writer reads real consumer release evidence and prepares authored sections using docs/release-authoring.md, or the consumer chooses ordinary GitHub-generated notes.
2. The consumer publishes one final GitHub Release body. For authored content, GitHub-generated PR/contributor details may be appended to the authored sections before this point.
3. The canonical published GitHub Release is validated and previewed with the packaged release-social CLI.
4. The consumer's package/application release job succeeds.
5. The pinned bundled Action runs in explicit publish mode.
6. Only duplicate-resistance state changes after release publication. The GitHub Release body/assets stay immutable.

The automated docs rehearsal uses mocked GitHub and social-provider boundaries. It never creates a real release or social post.

## Release fixtures

- releases/authored-final.md — valid authored v1 body plus fictional GitHub-generated detail.
- releases/generated.md — ordinary GitHub-generated style notes using default fallback.
- releases/empty.md — empty ordinary Release body; produces metadata-only fallback.
- releases/opted-out-generated.md — ordinary notes with a valid standalone social:skip.
- releases/malformed-authored.md — intentionally invalid partial authored contract.

## Configuration fixtures

- config/x.json — X only.
- config/linkedin.json — LinkedIn personal profile only.
- config/both.json — both destinations.
- config/missing-error.json — missing authored content is an error.
- config/missing-skip.json — missing authored content is a typed skip.
- config/corrected-linkedin.json — fictional corrected LinkedIn apiVersion for rejected-plan revision.
- config/invalid-provider.json — intentionally invalid provider selection.

All valid fixtures are exercised through the real CLI planning/validation path in tests/docs. Invalid fixtures must fail with the documented validation class/message.

## Example commands

After the fictional GitHub Release exists:

~~~sh
GH_TOKEN=SYNTHETIC_GITHUB_TOKEN release-social validate \
  --repository fictional/release-social-consumer \
  --release-id 515151 \
  --config examples/fictional-consumer/config/both.json

GH_TOKEN=SYNTHETIC_GITHUB_TOKEN release-social preview \
  --repository fictional/release-social-consumer \
  --release-id 515151 \
  --config examples/fictional-consumer/config/both.json
~~~

The strings above are placeholders only; the automated test injects mocked GitHub release metadata.

## One-time state setup

Before any real consumer's first publish, initialization is explicit:

~~~sh
GH_TOKEN=... release-social state-init \
  --repository OWNER/REPOSITORY
~~~

The fixture never treats a missing state branch as permission to recreate it during publish.

The state store creates commits against the exact verified release-social-state head and updates refs with force:false. A competing successor is re-read/revalidated; state history is never force-pushed or reset by this workflow.

## Immutable release demonstration

The rehearsal source fixture is read-only after it is constructed. Publication tests operate on rendered plans and the separate publishing ledger; no code path writes GitHub Release bodies or assets.

This mirrors the production contract: once the consumer has published the stable GitHub Release used as the source, release-social reads it canonically and stores only sanitized state on release-social-state.

## Workflow fixture

release-and-social.yml shows the intended ordering and permissions. It is deliberately non-production documentation:

- fake repository/release values;
- placeholder immutable Action SHA;
- no social secrets in PR validation;
- contents:read for preview;
- contents:write only for state publication;
- actions:read for reconciliation support;
- release-specific concurrency with cancel-in-progress:false.

The workflow does not use pull_request_target and does not check out release-tag code.

## Recovery rehearsal

The underlying entrypoint/state tests additionally prove:

- one destination may succeed while another fails;
- confirmed success is skipped on rerun;
- ambiguous creation stops automatic retry;
- exact-attempt reconciliation requires quiescence;
- a definitively non-created/rejected LinkedIn attempt can be revised to a newly validated config digest without touching the successful destination.

See docs/publishing-state.md for the recovery model.
