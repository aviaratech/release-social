# Publishing state and conservative recovery

release-social stores duplicate-resistance state on a dedicated branch named `release-social-state` in the source repository. The branch is intentionally separate from release bodies and assets so immutable GitHub releases remain untouched.

## Initialize once

State initialization is an explicit consumer setup operation. Normal publication and reconciliation **never create or recreate** the state branch.

Initialization creates a disconnected, data-only Git history containing one checksummed file:

```text
release-social-state-v1.json
```

If `release-social-state` already exists, initialization fails rather than overwriting it.

Deleting, force-rewriting, replacing, or manually repairing this branch outside a separately reviewed recovery procedure invalidates the duplicate-resistance guarantees. A missing, corrupt, unsupported, or structurally unexpected state branch fails closed; release-social does not provide a generic reset or force-push escape hatch.

## Atomic state transitions

Every state change follows GitHub's Git database model:

1. read the exact `release-social-state` head;
2. read and validate that commit, its data-only tree, the Git blob SHA, the JSON checksum, schema, implementation identity, records, attempts, revisions, and transition history;
3. create the new blob and tree from the verified current tree;
4. create a commit whose parent is that exact verified head;
5. update the branch ref with `force: false`;
6. read back the branch and prove the exact unique transition marker before treating the checkpoint as committed.

A concurrent successor causes the transition to re-read and revalidate before it is reapplied. A writer that loses a race never adopts another writer's pending attempt as permission to post.

If the ref-update response is lost, release-social searches the verified current branch ancestry for the exact commit and transition marker. If it cannot prove that exact transition, the result is uncertain and no social POST is authorized.

GitHub documents `force: false` as the fast-forward-safe reference update behavior:

- https://docs.github.com/en/rest/git/refs
- https://docs.github.com/en/rest/git/trees
- https://docs.github.com/en/rest/git/commits

## What is stored

The state branch is public data. It contains only:

- repository/release/destination/account identity needed for stable record keys;
- schema and publishing implementation identity;
- payload/configuration digests;
- attempt and revision numbers/IDs;
- bounded public execution identity (GitHub Actions run URL/ID or generated CLI invocation ID);
- timestamps and state;
- confirmed public provider post IDs and canonical public post URLs.

It does **not** contain provider credentials, GitHub tokens, raw social responses, raw provider payloads, private release notes, usernames/display names, or provider error bodies.

## Publication recovery model

All selected destinations are validated and live-preflighted before the first social POST.

For each destination that still needs publication:

1. append a new `pending` attempt atomically;
2. read the committed marker back;
3. immediately revalidate that the same execution still owns that exact pending attempt;
4. call the provider's one-shot `publish` once;
5. persist a confirmed `published` or definitive `rejected` terminal result.

A pending attempt without a verified terminal result is **unknown**. This includes:

- process interruption after the pending checkpoint;
- provider success followed by process death before the outcome checkpoint;
- provider result followed by an outcome-state commit that cannot be proven;
- provider timeout/5xx/ambiguous transport result.

Unknown attempts are never automatically resent.

A confirmed published record is skipped on rerun and retains its original public post URL. A later-added destination can publish independently without invalidating the existing success.

A definitive non-creation may be retried only on a later explicit publish run and only when its retry eligibility permits it. No provider POST is automatically retried within the same run.

## Reconciliation

Reconciliation always names the exact record key, attempt number, and attempt ID.

An operator can resolve a pending uncertain attempt as:

- an already-confirmed public post, with its canonical provider ID and URL; or
- confirmed non-creation, making a later explicit retry eligible.

Before reconciliation, the originating execution must be quiescent:

- for GitHub Actions runs, the recorded run must be verified as `completed`;
- for independent CLI invocations, the operator must explicitly attest that the originating process stopped and all in-flight requests settled.

Elapsed time alone is not evidence of non-creation.

The attempt is re-read inside the atomic transition immediately before resolution. Competing resolutions, resumed stale writers, and late incompatible results are rejected.

## Explicit plan revision

A definitively rejected latest attempt can be explicitly revised from its old digest to one newly validated digest. This supports corrections such as a rejected LinkedIn `apiVersion` or payload.

Revision:

- preserves all earlier attempt history;
- cannot change repository, release, destination, or target account;
- cannot revise a published or still-pending/unknown attempt;
- can revise a rejected attempt only once;
- does not itself authorize or send a social POST.

A later explicit publish run may create a new numbered attempt using the revised digest.

## Delivery guarantee

This design is **duplicate-resistant and conservative**, not exactly-once delivery across GitHub and external social APIs.

Progress logs and returned stage events are observability only; the GitHub state branch is the checkpoint authority. When creation cannot be ruled out, release-social stops and requires reconciliation rather than risking a duplicate announcement.
