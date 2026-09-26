# CLI and GitHub Action

release-social exposes the same validated core, providers, and durable publishing state through a packaged CLI and a bundled JavaScript GitHub Action.

## CLI

Install the package, then use the `release-social` binary.

```sh
release-social preview \
  --repository owner/repository \
  --release-id 12345678 \
  --config .github/release-social.json
```

Commands:

- `validate`: fetch the canonical release, parse configuration, build exact destination plans, and run provider-pure validation.
- `preview`: same planning path, returning exact text, destination identity, content source, fallback diagnostics, digest, and validation results.
- `publish`: explicit live mode using provider credentials plus the durable state machine.
- `state-init`: one-time initialization of the dedicated `release-social-state` branch.
- `reconcile`: exact-attempt reconciliation as either a confirmed public post or confirmed non-creation.
- `revise`: bind an exact definitively rejected attempt's old digest to a newly validated plan so a later publish can retry.

CLI GitHub access comes only from `GH_TOKEN`.

Provider account identity can be supplied either literally in the checked-in destination config or through these non-secret runtime variables:

```text
X_ACCOUNT_ID
LINKEDIN_AUTHOR
```

A runtime identity does not enable a destination by itself. If a configured destination supplies both a literal identity and its runtime variable, the values must match exactly. Resolution happens before plan construction, so preview, digests, publishing state, and provider binding all use one concrete account identity.

Provider credentials use only the provider-defined environment variables:

```text
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
LINKEDIN_ACCESS_TOKEN
```

Preview/validate can use the non-secret identity variables but do not load provider credentials, call providers, or write publishing state.

Release text and configuration are parsed as data. The CLI does not interpolate release text into a shell command.

## GitHub Action

The repository ships a bundled Node 24 Action. For normal stable consumption, use the major compatibility tag `aviaratech/release-social@v1`. For exact versioning, use an immutable release tag such as `@v1.0.1`. For maximum supply-chain assurance, pin the full 40-character commit SHA of the reviewed release.

The Action accepts:

- `mode`: `preview` by default; live publication requires explicit `publish`.
- `repository`: source repository in `owner/name` form.
- `release-id`: numeric GitHub Release ID.
- `config-path`: repository-relative path to already-checked-out trusted JSON configuration.
- `token`: explicit GitHub token input.

The Action does not check out the release tag and never executes code from a release/tag merely to publish. It reads only the already-checked-out configuration file inside `GITHUB_WORKSPACE`, then reads the canonical release through the GitHub API.

For centralized identities, map repository or organization variables explicitly:

```yaml
env:
  X_ACCOUNT_ID: ${{ vars.X_ACCOUNT_ID }}
  LINKEDIN_AUTHOR: ${{ vars.LINKEDIN_AUTHOR }}
```

Map provider secrets only into trusted live-publish jobs. Do not use `pull_request_target` to expose social credentials to untrusted pull-request code.

## Consumer workflow permissions

Preview needs only:

```yaml
permissions:
  contents: read
```

Live publishing needs `contents: write` because release-social persists duplicate-resistance state on the dedicated `release-social-state` branch.

Reconciliation of attempts originating from GitHub Actions additionally needs `actions: read` so the originating workflow run can be verified as completed.

Use release-specific concurrency and never cancel an in-progress publisher:

```yaml
concurrency:
  group: release-social-${{ github.repository_id }}-${{ inputs.release_id }}
  cancel-in-progress: false
```

Repository branch/ruleset policy must allow the publishing credential to fast-forward-update `release-social-state`. Do not solve branch-rule conflicts by force-pushing, deleting history, or bypassing protections silently. State initialization remains an explicit one-time setup operation.

## Release workflow placement

Invoke release-social directly after the package/application release job succeeds. Do not depend solely on a second `release:` workflow event when the release itself was created with the repository `GITHUB_TOKEN`: GitHub documents that events created by `GITHUB_TOKEN` generally do not create a new workflow run except for `workflow_dispatch` and `repository_dispatch`.

A manual `workflow_dispatch` preview/retry path is therefore recommended as well.

See:

- https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow
- https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax

## PR and fork safety

Normal pull-request checks must not receive X or LinkedIn credentials. Fork PRs in particular should exercise parsing, preview, provider-pure validation, tests, and bundle parity only.

Provider credentials belong only in explicitly authorized live-publish jobs after trusted release artifacts and configuration are established.

## Exit and output semantics

Preview and eligible skips exit successfully when validation succeeds.

Live publish exits nonzero for partial, rejected/blocked, or unknown outcomes while retaining already-durable successes. Outputs contain bounded per-destination status/events plus confirmed public post IDs/URLs only when known.

An unknown attempt is never automatically retried. Use exact-attempt reconciliation after satisfying Issue #5's quiescence rules.

Neither reconciliation nor revision sends a social post. Neither acts as a state reset or force bypass.
