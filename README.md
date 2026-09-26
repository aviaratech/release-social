# release-social

Publish release announcements to selected social destinations from standardized GitHub release notes.

## Status

The shared TypeScript core implements versioned release-note/configuration contracts, source eligibility, deterministic authored/fallback rendering, and provider interfaces. X and LinkedIn personal-profile providers plus durable duplicate-resistant publishing state are implemented. The packaged CLI and bundled Node 24 GitHub Action expose the same validated application path.

## Core behavior

- Parses release notes beginning with `<!-- release-social:v1 -->`.
- Requires one visible announcement paragraph plus visible `## Highlights` and `## Upgrade notes` sections.
- Requires hidden `social:short` prose and supports optional `social:x`, `social:linkedin`, and `social:skip` markers.
- Validates version-1 destination configuration for X and personal LinkedIn profiles without accepting secrets.
- Accepts only canonical GitHub release source metadata and binds the final link to that source.
- Produces deterministic per-destination plans and SHA-256 digests from canonical nonsecret plan inputs and exact final payload bytes.
- Returns typed skips for draft, prerelease, non-public, explicitly opted-out, and configured missing-authored releases.
- When authored release-social sections are absent, `content.missingAuthored` defaults to `github-release-notes`; `error` and `skip` are explicit alternatives. Fallback uses only the already-published GitHub Release body, strips boilerplate/markup deterministically, fits whole entries to each provider's real text rules, and never generates new notes or calls an LLM.

For valid authored notes, rendering precedence is provider-specific release-note override, then an explicitly configured text variant, then the provider default. X defaults to `short`; LinkedIn defaults to `announcement`. Selected prose is line-ending normalized, boundary-trimmed without collapsing internal whitespace, and followed by exactly one canonical GitHub release URL.

## Templates

- [`templates/release-notes.md`](templates/release-notes.md) is the release-note starting point.
- [`templates/release-social.config.json`](templates/release-social.config.json) is a synthetic configuration example.

The templates use fictional account identities and contain no credentials. Provider setup is documented in [`docs/providers/x.md`](docs/providers/x.md) and [`docs/providers/linkedin.md`](docs/providers/linkedin.md). Durable publication state and conservative recovery are documented in [`docs/publishing-state.md`](docs/publishing-state.md). CLI/Action usage and least-privilege workflow guidance are in [`docs/entrypoints.md`](docs/entrypoints.md).

## Development

Use Node.js 24.21.0 and npm 11.19.0.

```sh
npm ci
npm run checks
npm run build
npm test -- --run tests/core
npm pack --dry-run
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for repository boundaries and verification requirements.

## License

[MIT](LICENSE).
