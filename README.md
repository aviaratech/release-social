# release-social

Publish one deterministic text-and-link GitHub Release announcement to **X** and/or a **personal LinkedIn profile**.

## Status

The v0.1 repository implementation includes:

- versioned authored release-note and configuration contracts;
- deterministic fallback from the already-published GitHub Release body when authored sections are absent;
- X and personal LinkedIn provider implementations;
- duplicate-resistant publishing state and conservative recovery;
- a packaged CLI;
- a bundled Node 24 GitHub Action;
- synthetic/offline verification with mocked GitHub/social boundaries.

Supported social destinations are intentionally limited to **X** and **personal LinkedIn profiles**. LinkedIn organization pages and other providers are out of scope for v0.1.

This documentation work does **not** publish npm, create a version tag/GitHub Release, move a major-version Action tag, connect a real account, or make a live social post.

Tracking: [Issue #1 — Ship configurable release announcements for X and LinkedIn](https://github.com/aviaratech/release-social/issues/1) · [v0.1 milestone](https://github.com/aviaratech/release-social/milestone/1)

## Adoption paths

Consumers can choose either path:

1. **Ordinary GitHub Release notes** — default. With no authored release-social markers, content.missingAuthored defaults to deterministic github-release-notes fallback from the canonical published Release body.
2. **Agent-authored release sections** — use the v1 template and canonical release-writer guidance, optionally append GitHub-generated PR/contributor details, then publish one final GitHub Release body.

Social publication reads that final Release body. It never regenerates notes or calls an LLM.

Start here:

- [Consumer adoption guide](docs/adoption.md)
- [Canonical release-authoring and agent guidance](docs/release-authoring.md)
- [CLI and GitHub Action](docs/entrypoints.md)
- [Publishing state and conservative recovery](docs/publishing-state.md)
- [X consumer setup](docs/providers/x.md)
- [LinkedIn personal-profile setup](docs/providers/linkedin.md)
- [Optional live acceptance procedure](docs/live-acceptance.md)
- [Initial package/Action release checklist](docs/release-checklist.md)
- [Fictional consumer rehearsal](examples/fictional-consumer/README.md)

## Core behavior

- Valid authored notes begin with the release-social:v1 marker, contain one benefit-first announcement paragraph, Highlights, Upgrade notes, and a hidden social:short block.
- Optional social:x / social:linkedin blocks override provider copy; social:skip opts out.
- Missing authored content defaults to github-release-notes; explicit error and skip modes are available.
- Malformed/partial authored markers remain errors and never silently fall back.
- X defaults to short copy; LinkedIn defaults to announcement copy.
- Exactly one canonical GitHub Release URL is included in the final provider text.
- Preview is credential-free for social providers and writes no publishing state.
- Live publication preflights all selected destinations before the first social POST.
- Confirmed successes survive partial failures; ambiguous attempts stop for exact reconciliation instead of being blindly retried.
- Public duplicate-resistance state lives on the dedicated release-social-state branch and advances only through non-force fast-forward ref updates.

## Templates

- [templates/release-notes.md](templates/release-notes.md) — exact v1 authored starting point.
- [templates/release-social.config.json](templates/release-social.config.json) — fictional both-provider configuration.

Templates and examples contain no credentials.

## Development verification

Use Node.js 24.21.0 and npm 11.19.0.

~~~sh
npm ci
npm run checks
npm run build
npm test -- --run tests/core
npm test -- --run tests/providers/x.test.ts
npm test -- --run tests/providers/linkedin.test.ts
npm test -- --run tests/publishing tests/github/state-store.test.ts
npm test -- --run tests/entrypoints
npm test -- --run tests/docs
npm run check:action-bundle
npm pack --dry-run
~~~

See [CONTRIBUTING.md](CONTRIBUTING.md) for repository boundaries.

## Live validation still outstanding

Offline CI must not be described as live provider proof. A real consumer still needs to separately establish, for the exact account/text it authorizes:

- current X app/user write access and applicable X API pricing/access;
- current LinkedIn member authorization for w_member_social, a supported API version, and a non-expired token;
- repository rules that permit non-force updates to release-social-state;
- any optional live X/LinkedIn post acceptance evidence.

Follow [docs/live-acceptance.md](docs/live-acceptance.md) if live proof is desired.

## License

[MIT](LICENSE).
