# GitHub Marketplace release runbook

Aviara Release Social is distributed primarily as a GitHub Action. The canonical launch event is a GitHub Release published to GitHub Marketplace.

`v1.0.0` is preserved at its original commit and contains an Action runner input defect. The corrected launch is `v1.0.1`; consumers pinned to `v1.0.0` should upgrade to `v1.0.1`, and the `v1` compatibility tag should point to the corrected release.

## v1 release model

Use two references with different guarantees:

- `v1.0.1` — release-specific tag attached to the immutable GitHub Release.
- `v1` — separate movable compatibility tag pointing to the latest backwards-compatible v1 release commit.

Do not create a GitHub Release for `v1` when immutable releases are enabled. Keep `v1` as a standalone compatibility tag so it can advance to later compatible v1 commits.

Consumer guidance:

```yaml
# Convenience: latest compatible v1
- uses: aviaratech/release-social@v1

# Exact released version
- uses: aviaratech/release-social@v1.0.1

# Maximum pinning assurance
- uses: aviaratech/release-social@FULL_40_CHARACTER_RELEASE_SHA
```

## Before drafting v1.0.1

1. Merge the reviewed Marketplace-readiness PR to `main`.
2. Confirm post-merge CI is green.
3. Confirm `package.json` and lockfile version are `1.0.1`.
4. Confirm root `action.yml` reports:
   - `name: Aviara Release Social`
   - `author: Aviara Tech`
   - `branding.icon: send`
   - `branding.color: blue`
   - `runs.using: node24`
5. Confirm the committed Action bundle matches source.
6. Confirm distributable acceptance tests prove X and LinkedIn create requests.
7. Confirm `npm pack --dry-run` contains only intended public assets.
8. Confirm no live credentials or private operational data are present.
9. Enable GitHub immutable releases for the repository before publishing the release.
10. Confirm GitHub private vulnerability reporting is enabled if Aviara Tech wants the repository's preferred private reporting path to be available.

## Draft the GitHub Release

In the repository UI:

1. Open root `action.yml`.
2. Use GitHub's **Draft a release** / Marketplace publication banner.
3. Select **Publish this Action to the GitHub Marketplace**.
4. If GitHub requires it, an Aviara Tech organization owner accepts the GitHub Marketplace Developer Agreement.
5. Confirm GitHub reports the metadata as valid and confirms the Marketplace name is available.
6. Choose:
   - Primary category: **Publishing**
   - Secondary category: **Utilities**
7. Create tag: `v1.0.1`.
8. Target the exact reviewed `main` commit.
9. Release title: **Aviara Release Social v1.0.1**.
10. Start with GitHub's generated release notes if useful, then ensure the final release body accurately reflects the corrected stable v1 product and its `release-id` / `config-path` Action input fix.
11. Publish the release with Marketplace enabled using the required 2FA flow.

GitHub Marketplace publication is not complete until the Marketplace listing is visibly live.

## Canonical v1.0.1 release body

Use the following as the release body, preserving factual accuracy if any final launch detail changes.

````md
# Aviara Release Social v1.0.1

Publish GitHub Releases to X and LinkedIn—safely.

v1.0.1 is the corrected stable GitHub Marketplace release of Aviara Release Social, built and maintained by Aviara Tech. It fixes GitHub Actions runner input lookup for `release-id` and `config-path`.

## Highlights

- Publish one text-and-link announcement to X and/or a personal LinkedIn profile.
- Preview is the default; live publication must be explicit.
- Use ordinary GitHub Release notes or versioned agent-authored release copy.
- Validate the exact final provider payload, including the canonical GitHub Release URL.
- Preserve confirmed successes across reruns and partial failures.
- Stop ambiguous external writes for explicit reconciliation instead of blindly reposting.
- Keep provider credentials out of release notes, configuration, logs, and publishing state.
- Use the bundled Node 24 GitHub Action or the same implementation through the CLI/package.

## Install

For the latest backwards-compatible v1 release:

```yaml
- uses: aviaratech/release-social@v1
```

For an exact release:

```yaml
- uses: aviaratech/release-social@v1.0.1
```

For maximum pinning assurance, use the full 40-character commit SHA of this release.

## Supported destinations

- X
- Personal LinkedIn profiles

LinkedIn organization pages and other social providers are not part of v1.0.1.

## Verification

The release is covered by provider, state/recovery, CLI, GitHub Action, documentation, and distributable acceptance tests. The distributable tests launch the actual built CLI and committed Action bundle and verify their X/LinkedIn create requests against synthetic blocked-network APIs.

Offline verification does not imply that a consumer's real X or LinkedIn account is currently authorized; each consumer owns its provider access, credentials, and optional live acceptance.

## Upgrade notes

Consumers pinned to `v1.0.0` should change that exact pin to `v1.0.1`. The `v1.0.0` release and tag remain at their original commit; `v1` is the movable compatibility tag for the latest backwards-compatible v1 release.

## Maintainer

Built and maintained by [Aviara Tech](https://aviaratech.io).
````

## Create the v1 compatibility tag

After the immutable `v1.0.1` GitHub Release exists:

1. Resolve the exact commit SHA referenced by `v1.0.1`.
2. Create the separate `v1` tag at that same commit.
3. Verify:
   - `v1.0.0` remains tied to its original immutable release and commit;
   - `v1.0.1` remains tied to the corrected immutable release;
   - `v1` resolves to the same commit;
   - no GitHub Release exists for `v1`.

For later backwards-compatible v1 releases, move only the standalone `v1` tag to the newest compatible release commit.

Never rewrite or replace an immutable release-specific tag to repair a bad release. Publish a new patch/minor release instead.

## Marketplace smoke test

After publication:

1. Open the Marketplace listing.
2. Confirm the listing shows:
   - Aviara Release Social
   - Aviara Tech
   - send/blue branding
   - `v1.0.1` as the stable release
3. Use the Marketplace **Use latest version** / installation UI and verify the generated workflow syntax.
4. In a clean fictional or dedicated test consumer, run:
   - preview with X only;
   - preview with LinkedIn only;
   - preview with both;
   - an explicitly authorized publish if live acceptance is desired.
5. Confirm the repository README, Marketplace listing, and release page all point to the same setup/recovery documentation.

## Withdrawal / correction

If a released version is defective:

- do not mutate or replace either immutable release-specific tag;
- fix the defect on a branch;
- run the complete release gate;
- publish a new semantic patch/minor GitHub Release;
- update the standalone `v1` compatibility tag only after the new release is established.

If a Marketplace version must be withdrawn, edit the affected GitHub Release and remove its Marketplace publication state according to GitHub's current Marketplace controls. Preserve repository/release history.
