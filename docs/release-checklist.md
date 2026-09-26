# Aviara Release Social v1 Marketplace launch checklist

Use this checklist before publishing the first stable GitHub Marketplace release.

The canonical release event is the GitHub Release tagged `v1.0.0`. The standalone `v1` tag is a movable compatibility alias and must not have its own GitHub Release when immutable releases are enabled.

## Source and CI

- [ ] The intended release commit on `main` is reviewed and immutable by SHA.
- [ ] `package.json` and `package-lock.json` report version `1.0.0`.
- [ ] `npm ci` succeeds with 0 known vulnerabilities reported by npm audit during install.
- [ ] `npm run checks` passes.
- [ ] `npm run build` passes.
- [ ] `npm test -- --run tests/core` passes.
- [ ] `npm test -- --run tests/providers/x.test.ts` passes.
- [ ] `npm test -- --run tests/providers/linkedin.test.ts` passes.
- [ ] `npm test -- --run tests/publishing tests/github/state-store.test.ts` passes.
- [ ] `npm test -- --run tests/entrypoints` passes.
- [ ] `npm test -- --run tests/docs` passes.
- [ ] `npm test -- --run tests/acceptance` passes after build.
- [ ] `npm run check:action-bundle` proves `action-dist/index.cjs` matches source.
- [ ] `npm pack --dry-run` passes.

## Marketplace metadata

- [ ] Root metadata file remains `action.yml`.
- [ ] Marketplace name is `Aviara Release Social`.
- [ ] Author is `Aviara Tech`.
- [ ] Description is consumer-benefit oriented.
- [ ] Branding uses supported Feather icon `send`.
- [ ] Branding color is `blue`.
- [ ] Runtime remains Node 24.
- [ ] Existing Action input/output contract remains documented.
- [ ] GitHub's release page reports **Everything looks good!** for Marketplace metadata.
- [ ] GitHub confirms the Marketplace Action name is available.

## Consumer experience

- [ ] README leads with “Publish GitHub Releases to X and LinkedIn—safely.”
- [ ] README recommends `aviaratech/release-social@v1` for normal consumers.
- [ ] README documents full-SHA pinning for highest assurance.
- [ ] README contains a copyable minimal workflow.
- [ ] X-only, LinkedIn-only, and both-destination setup remain documented.
- [ ] Preview-first behavior is obvious.
- [ ] One-time state initialization is documented.
- [ ] Required GitHub permissions are documented.
- [ ] Provider secrets and non-secret account identities are clearly separated.
- [ ] Partial/unknown outcomes and reconciliation are explained without implying automatic safe retry.
- [ ] Aviara Tech attribution links to https://aviaratech.io.

## Security and package integrity

- [ ] `SECURITY.md` is present.
- [ ] GitHub private vulnerability reporting is enabled if Aviara Tech wants GitHub to be the preferred private reporting path.
- [ ] Repository/Action/package artifacts are credential-free.
- [ ] PR/fork checks run without X/LinkedIn secrets.
- [ ] Examples contain only fictional account IDs, URNs, repositories, and credentials.
- [ ] No `pull_request_target` secret workaround exists.
- [ ] Acceptance tests block unexpected network origins.
- [ ] `npm pack --dry-run` excludes tests, local state, acceptance fixtures, credentials, and build-machine files.
- [ ] The package includes the runnable CLI, `action.yml`, committed Action bundle, intended docs/examples, README, license, and contribution guidance.

## State and operational safety

- [ ] State initialization remains explicit.
- [ ] State updates remain non-force fast-forward transitions.
- [ ] Confirmed successes are not reposted on rerun.
- [ ] Unknown attempts are not automatically retried.
- [ ] Reconciliation names an exact attempt and requires publisher quiescence.
- [ ] Plan revision preserves history and cannot bypass unknown/success states.
- [ ] GitHub Release source content remains immutable during social publication.

## GitHub Release / Marketplace publication

- [ ] Enable immutable releases for the repository before publishing `v1.0.0`.
- [ ] Open root `action.yml` and use GitHub's **Draft a release** Marketplace flow.
- [ ] Select **Publish this Action to the GitHub Marketplace**.
- [ ] Aviara Tech organization owner accepts the Marketplace Developer Agreement if required.
- [ ] Primary category: **Publishing**.
- [ ] Secondary category: **Utilities**.
- [ ] Tag: `v1.0.0`.
- [ ] Target: exact reviewed release commit on `main`.
- [ ] Title: **Aviara Release Social v1.0.0**.
- [ ] Final release body follows `docs/marketplace-release.md`.
- [ ] Publish the release with Marketplace enabled using GitHub's required 2FA flow.
- [ ] Verify the GitHub Release is marked immutable.
- [ ] Verify the Marketplace listing is visibly live.

## v1 compatibility tag

After the immutable `v1.0.0` release exists:

- [ ] Resolve the exact commit SHA for `v1.0.0`.
- [ ] Create the separate `v1` tag at that same commit.
- [ ] Verify `v1` and `v1.0.0` resolve to the same commit.
- [ ] Verify no GitHub Release exists for `v1`.
- [ ] Document that future backwards-compatible v1 releases move only the standalone `v1` tag after the new immutable release is established.

## Marketplace smoke test

- [ ] Marketplace listing displays **Aviara Release Social** and **Aviara Tech**.
- [ ] Marketplace badge uses send/blue branding.
- [ ] Marketplace install UI produces valid `uses: aviaratech/release-social@...` syntax.
- [ ] README, Marketplace listing, and GitHub Release agree on setup and supported providers.
- [ ] A clean test consumer can run preview using `aviaratech/release-social@v1`.
- [ ] Optional live acceptance, if performed, is separately authorized and recorded as live evidence rather than CI evidence.

## Repository product surface

- [ ] Repository description is consumer-oriented (recommended: “Publish GitHub Releases to X and LinkedIn—safely.”).
- [ ] Repository website points to https://aviaratech.io if desired for Aviara Tech attribution.
- [ ] Useful repository topics are configured (for example: `github-actions`, `release-automation`, `linkedin`, `x-api`, `social-media`).
- [ ] Public support route points to GitHub Issues.
- [ ] Security route points to `SECURITY.md`.

## Correction policy

If `v1.0.0` is defective after publication:

- [ ] Do not rewrite or replace the immutable release-specific tag.
- [ ] Fix on a branch and rerun the complete release gate.
- [ ] Publish a new semantic patch/minor GitHub Release.
- [ ] Move `v1` only after the replacement release is established.
- [ ] Preserve historical release/state evidence.
