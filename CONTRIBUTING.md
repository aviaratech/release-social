# Contributing

## Toolchain

Use Node.js 24.21.0 and npm 11.19.0. The repository intentionally uses npm and the committed lockfile.

From a clean checkout:

```sh
npm ci
npm run checks
npm run build
npm pack --dry-run
```

For the core acceptance suite specifically:

```sh
npm test -- --run tests/core
```

## Release-social core boundaries

The core is deterministic and offline. Parsing, configuration validation, source eligibility, rendering, and digest generation must not require credentials or network access.

This repository never stores social credentials in release notes, configuration, plans, fixtures, examples, or test output. Provider implementations receive credentials only at their live boundary.

Provider HTTP calls, durable publication state, CLI execution, and GitHub Action execution are outside the initial core issue. Provider implementations must not automatically retry a publication POST when creation may have occurred.

Use only fictional identities and repositories in tests and documentation.
