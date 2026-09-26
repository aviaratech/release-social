# Aviara Release Social

**Publish GitHub Releases to X and LinkedIn—safely.**

Aviara Release Social is a GitHub Action from [Aviara Tech](https://aviaratech.io) that turns a published GitHub Release into validated social posts for **X** and/or a **personal LinkedIn profile**.

It is preview-first, validates the exact provider payload before posting, and keeps duplicate-resistant publishing state so confirmed posts are not blindly sent again.

[![CI](https://github.com/aviaratech/release-social/actions/workflows/ci.yml/badge.svg)](https://github.com/aviaratech/release-social/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Why use it?

- **GitHub-native** — publish directly from the release workflow you already use.
- **Preview first** — preview is the default; live posting must be explicit.
- **X + LinkedIn** — supports X and personal LinkedIn profiles.
- **No LLM required to publish** — ordinary GitHub Release notes are converted deterministically, or you can supply authored social copy.
- **Provider-aware validation** — validates X weighted length and LinkedIn text/escaping rules on the exact final payload.
- **Duplicate-resistant** — confirmed successes survive reruns and partial failures.
- **Conservative recovery** — ambiguous external writes stop for explicit reconciliation instead of automatic reposting.
- **Credential-safe** — provider credentials stay in your GitHub Secrets/environment and are never written into release notes or publishing state.

## Install

For the stable v1 line:

```yaml
- uses: aviaratech/release-social@v1
```

For maximum supply-chain assurance, pin the full commit SHA of the reviewed release:

```yaml
- uses: aviaratech/release-social@FULL_40_CHARACTER_RELEASE_SHA
```

The immutable GitHub Release tag `v1.0.0` identifies the exact first stable release. The separate `v1` compatibility tag tracks the latest backwards-compatible v1 release.

## Quick start

### 1. Add configuration

Create `.github/release-social.json`.

X only:

```json
{
  "version": 1,
  "destinations": {
    "x": {
      "accountId": "123456789012345678"
    }
  }
}
```

LinkedIn only:

```json
{
  "version": 1,
  "destinations": {
    "linkedin": {
      "author": "urn:li:person:YOUR_MEMBER_ID",
      "apiVersion": "YYYYMM"
    }
  }
}
```

Or configure both.

You can also keep account identity outside the repository and map the non-secret runtime variables `X_ACCOUNT_ID` and `LINKEDIN_AUTHOR`. See [consumer setup](docs/adoption.md).

### 2. Add provider credentials

For X:

```text
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
```

For LinkedIn:

```text
LINKEDIN_ACCESS_TOKEN
```

Store credentials as GitHub Actions secrets. Do not put them in `release-social.json`.

### 3. Initialize publishing state once

Before the first live publish, explicitly initialize the data-only `release-social-state` branch:

```sh
GH_TOKEN=... release-social state-init \
  --repository OWNER/REPOSITORY
```

The branch stores sanitized publishing attempts/outcomes only. It is updated by non-force fast-forward commits.

### 4. Add the Action after your release job

```yaml
jobs:
  social:
    needs: release
    runs-on: ubuntu-latest

    permissions:
      contents: write
      actions: read

    concurrency:
      group: release-social-${{ github.repository_id }}-${{ needs.release.outputs.release_id }}
      cancel-in-progress: false

    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false

      - uses: aviaratech/release-social@v1
        with:
          mode: publish
          repository: ${{ github.repository }}
          release-id: ${{ needs.release.outputs.release_id }}
          config-path: .github/release-social.json
          token: ${{ secrets.GITHUB_TOKEN }}
        env:
          X_API_KEY: ${{ secrets.X_API_KEY }}
          X_API_SECRET: ${{ secrets.X_API_SECRET }}
          X_ACCESS_TOKEN: ${{ secrets.X_ACCESS_TOKEN }}
          X_ACCESS_TOKEN_SECRET: ${{ secrets.X_ACCESS_TOKEN_SECRET }}
          LINKEDIN_ACCESS_TOKEN: ${{ secrets.LINKEDIN_ACCESS_TOKEN }}
```

Remove credentials for destinations you do not use.

For preview-only workflows, use `mode: preview` (or omit `mode`, because preview is the default) and `contents: read`. Preview does not load provider credentials, call social providers, or write publishing state.

## Release content

You have two adoption paths.

### Use ordinary GitHub Release notes

This is the default. If the published GitHub Release body has no release-social authored markers, Aviara Release Social deterministically derives provider-safe text from that already-published body.

It does **not** regenerate release notes and does **not** call an LLM while publishing.

### Provide authored social copy

For release-writing agents or teams that want tighter control, use the versioned authored template in [templates/release-notes.md](templates/release-notes.md).

Authored content supports:

- a benefit-first announcement;
- technical highlights;
- upgrade/breaking-change notes;
- concise shared social copy;
- optional X/LinkedIn overrides;
- explicit social opt-out.

See [release-authoring guidance](docs/release-authoring.md).

## Failure and retry behavior

Aviara Release Social does not treat every failure as safe to retry.

- **Confirmed published:** stored durably and skipped on rerun.
- **Definitive non-creation/rejection:** may be eligible for a later explicit corrected-plan retry.
- **Unknown/ambiguous write:** never automatically reposted. Reconcile the exact recorded attempt after the originating publisher is known to be quiescent.
- **Partial success:** already-confirmed destinations stay confirmed while unresolved destinations are handled independently.

See [publishing state and recovery](docs/publishing-state.md).

## Supported destinations

| Destination | v1 support |
| --- | --- |
| X | Text + canonical GitHub Release link |
| LinkedIn | Personal profile, public text post + canonical GitHub Release link |
| LinkedIn organization pages | Not supported |
| Other social providers | Not supported |

## CLI and library

The GitHub Action is the primary product surface. The same implementation is also exposed as the `release-social` CLI and TypeScript package for local or custom automation.

See [CLI and Action usage](docs/entrypoints.md).

## Security and trust

- GitHub Release-specific versions such as `v1.0.0` are intended to be immutable.
- The movable `v1` tag is a compatibility alias and can advance to later backwards-compatible v1 releases.
- Provider credentials are not written to publishing state.
- PR/fork checks run without social credentials.
- The committed Action bundle is checked for source parity in CI.
- Distributable acceptance tests launch the actual built CLI and committed Action and prove their X/LinkedIn create requests against blocked-network synthetic APIs.
- Ambiguous external writes are not automatically retried.

See [SECURITY.md](SECURITY.md) and the [release checklist](docs/release-checklist.md).

## Verification status

The implementation is verified offline through provider, state/recovery, CLI, Action, documentation, and distributable acceptance suites.

A real consumer still separately controls and authorizes:

- X app/user API access and applicable X pricing;
- LinkedIn `w_member_social` authorization and token validity;
- repository rules allowing the `release-social-state` branch;
- any optional live-account acceptance test.

Offline verification is not presented as proof of a live provider account connection. See [optional live acceptance](docs/live-acceptance.md).

## Documentation

- [Consumer adoption guide](docs/adoption.md)
- [Release-authoring / agent guidance](docs/release-authoring.md)
- [CLI and GitHub Action](docs/entrypoints.md)
- [Publishing state and recovery](docs/publishing-state.md)
- [X setup](docs/providers/x.md)
- [LinkedIn setup](docs/providers/linkedin.md)
- [Marketplace / v1 release runbook](docs/marketplace-release.md)
- [Release checklist](docs/release-checklist.md)
- [Optional live acceptance](docs/live-acceptance.md)

## Support and contributing

- Bugs and feature requests: [GitHub Issues](https://github.com/aviaratech/release-social/issues)
- Security reports: see [SECURITY.md](SECURITY.md)
- Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md)

## Built by Aviara Tech

Aviara Release Social is built and maintained by [Aviara Tech](https://aviaratech.io).

## License

[MIT](LICENSE).
