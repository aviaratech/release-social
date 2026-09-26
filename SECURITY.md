# Security policy

Aviara Tech takes the security of Aviara Release Social seriously.

## Supported versions

| Version | Security support |
| --- | --- |
| Latest v1.x release | Supported |
| Older v1.x releases | Upgrade to the latest compatible v1 release |
| Pre-v1 / unreleased development versions | Not supported after v1.0.0 is published |

For GitHub Actions workflows, consumers can choose between:

- `aviaratech/release-social@v1` for the latest backwards-compatible v1 release; or
- the full 40-character commit SHA of a reviewed immutable release for maximum pinning assurance.

Release-specific GitHub Releases such as `v1.0.0` are intended to be immutable. The separate `v1` compatibility tag may move to newer backwards-compatible v1 commits.

## Reporting a vulnerability

Do **not** include credentials, access tokens, private release data, or exploit details in a public GitHub Issue.

Prefer GitHub's private vulnerability reporting flow from this repository's **Security** tab when it is available.

If private vulnerability reporting is unavailable, contact an Aviara Tech organization owner privately before sharing sensitive details. Public GitHub Issues are appropriate only for non-sensitive security-hardening requests.

When reporting a vulnerability, include:

- affected release/tag or full commit SHA;
- affected Action/CLI surface;
- a minimal reproduction that does not contain real credentials;
- expected vs actual behavior;
- security impact;
- whether any external provider request may have occurred.

## Credential model

Aviara Release Social is designed so provider credentials remain runtime secrets:

```text
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
LINKEDIN_ACCESS_TOKEN
```

Credentials must not be committed to release notes, configuration, examples, publishing state, or logs.

Non-secret account identities may be configured literally or provided through:

```text
X_ACCOUNT_ID
LINKEDIN_AUTHOR
```

## Publishing-state safety

The dedicated `release-social-state` branch contains sanitized public attempt/outcome state only.

- state initialization is explicit;
- updates are non-force fast-forward transitions;
- confirmed successes are preserved across reruns;
- ambiguous external writes are not automatically retried;
- history must not be deleted, reset, or force-rewritten as a recovery shortcut.

## Supply-chain posture

- the Action bundle is committed and checked for source parity in CI;
- release-specific GitHub Releases are intended to be immutable;
- consumers may pin a full release commit SHA;
- PR/fork checks receive no social-provider credentials;
- distributable acceptance tests block unexpected network origins and use synthetic credentials/accounts only.

See [docs/publishing-state.md](docs/publishing-state.md) and [docs/release-checklist.md](docs/release-checklist.md) for more detail.
