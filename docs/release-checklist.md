# Initial package and Action release checklist

Issue #7 documents this checklist only. It must not publish npm, create a version tag/GitHub Release, or move a major-version Action tag.

Before the first package/Action release:

## Source and checks

- [ ] The intended source commit is reviewed and immutable.
- [ ] npm ci succeeds with the committed lockfile.
- [ ] npm run checks passes.
- [ ] npm run build passes.
- [ ] Core, provider, publishing/state, entrypoint, and docs acceptance suites pass.
- [ ] npm run check:action-bundle proves action-dist/index.cjs matches source.
- [ ] The committed Action metadata uses Node 24 and the intended bundle entrypoint.

## Canonical release-social checks

- [ ] The v1 config/template fixtures validate through the packaged CLI.
- [ ] Preview shows exact X/LinkedIn final text including the canonical GitHub Release URL.
- [ ] Missing-authored default/error/skip behavior is verified.
- [ ] Malformed authored markers fail instead of silently falling back.
- [ ] Draft/prerelease/private/opt-out releases skip without provider/state writes.
- [ ] Provider text budgets are validated through the actual pure provider validators.

## Package contents

- [ ] npm pack --dry-run contains only intended public runtime/docs/examples/assets.
- [ ] No tests, local state, credentials, tokens, private release notes, raw provider payloads, or build-machine files are packaged.
- [ ] The package exposes the runnable release-social CLI bin.
- [ ] action.yml and the committed action-dist bundle are included.

## Security and credentials

- [ ] Repository/Action artifacts are credential-free.
- [ ] PR/fork checks run without X/LinkedIn secrets.
- [ ] Consumer secrets are documented only by variable name.
- [ ] Examples contain only visibly fictional account IDs, URNs, and repositories.
- [ ] No pull_request_target secret workaround exists.

## State and operational safety

- [ ] State initialization remains explicit.
- [ ] State updates remain non-force fast-forward transitions.
- [ ] Unknown attempts are not automatically retried.
- [ ] Reconciliation/revision examples name exact attempts and preserve quiescence/history requirements.
- [ ] Release bodies/assets remain immutable during social publication.

## Release/versioning

- [ ] Choose the immutable package version and Git commit intentionally.
- [ ] Consumers pin the Action to a reviewed full 40-character commit SHA.
- [ ] If a major-version Action tag is introduced later, move it only through a separately reviewed release procedure after the immutable release exists.
- [ ] Record what live provider acceptance, if any, was performed; never imply offline CI is live API proof.

## After release

- [ ] Verify installation in a visibly fictional or dedicated test consumer before recommending production adoption.
- [ ] Re-run preview from the released package/Action artifact.
- [ ] Keep the tracking parent and milestone updated with immutable release/version evidence.
