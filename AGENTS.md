# Repository agent instructions

These instructions govern work in `aviaratech/release-social`. They describe repository checks and review boundaries only; do not install, copy, or synchronize personal agent policy from this repository.

## Authority and scope

- GitHub issues and merged repository content are the source of truth for current scope.
- Keep the shared core deterministic and credential-free.
- Never add real social credentials, tokens, private release data, or live account identifiers to code, fixtures, examples, logs, or documentation.
- Do not make live social posts or paid provider requests during development or CI.
- Do not add provider HTTP code, durable state, CLI behavior, or GitHub Action execution unless the active issue explicitly owns that surface.
- Preserve the v1 release-note and configuration contracts unless an issue explicitly versions or changes them.

## Required verification

Before requesting review, run from a clean dependency install when practical:

```sh
npm ci
npm run checks
npm run build
npm pack --dry-run
```

Core contract changes must also pass:

```sh
npm test -- --run tests/core
```

## Review expectations

Treat malformed or ambiguous release input as an error rather than inventing a fallback. Preserve deterministic final bytes and per-destination digest stability. Keep provider publication semantics explicit: preflight is read-only, publish is one-shot, and an unknown outcome is never automatically retried.
