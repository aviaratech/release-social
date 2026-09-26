# Release authoring

This repository is the canonical owner of release-social authoring guidance. Consumer repositories should link to this document or copy the instruction block below into their release workflow; they should not replace organization-wide or personal agent policy.

release-social supports two release-content paths:

1. **Ordinary GitHub Release notes** — the default. If no release-social authored markers are present, content.missingAuthored defaults to github-release-notes. release-social deterministically fits visible change text from the already-published GitHub Release body to each selected destination.
2. **Agent-authored release-social sections** — preferred when a release-writing agent is available. The consumer's release workflow prepares the authored Markdown, combines it with any desired GitHub-generated PR/contributor detail, and publishes one final GitHub Release body. Social publication reads that final body; it does not call GitHub's generate-notes endpoint or an LLM.

Malformed or partial authored markers are errors. They never silently fall back to ordinary GitHub notes.

## Exact v1 authored template

Start from ../templates/release-notes.md:

~~~md
<!-- release-social:v1 -->

<!-- announcement:start -->
Lead with the concrete benefit delivered by this release in one plain-text paragraph, then state the most important shipped capability without unsupported claims.
<!-- announcement:end -->

## Highlights

- Describe the most important shipped behavior and concrete technical details.
- Preserve meaningful limitations, compatibility constraints, and evidence from the actual release.

## Upgrade notes

No breaking changes.

<!-- social:short
Write concise plain-text copy suitable for X. Keep only claims supported by the release evidence.
-->
~~~

The visible announcement and hidden social prose are plain text. Do not put Markdown links, inline formatting, HTML, lists, or multiple paragraphs inside those prose blocks.

### Optional provider override

A provider-specific override wins over configured/default text selection:

~~~md
<!-- social:x
Exact optional X override.
-->

<!-- social:linkedin
Exact optional LinkedIn override.
-->
~~~

Remove an override block when it is not needed.

### Explicit opt-out

To suppress social publication for an otherwise eligible release:

~~~md
<!-- social:skip -->
~~~

A standalone social:skip also works with ordinary GitHub-generated notes.

## Default text selection

For valid authored notes:

- X: provider override → configured text variant → default short.
- LinkedIn: provider override → configured text variant → default announcement.
- Exactly one canonical GitHub Release URL is appended by release-social.

Authored copy is never truncated or split. If the exact final text exceeds provider limits, validation fails.

For ordinary GitHub notes, release-social creates neutral deterministic copy from the already-published Release body. It includes complete entries/sentences in source order while they fit the selected provider's real text budget. It reports how many entries were included/omitted and why.

An empty or unusable ordinary Release body produces metadata-only copy such as:

~~~text
fictional/example-app v1.2.3 is available.

https://github.com/fictional/example-app/releases/tag/v1.2.3
~~~

No LLM is needed during publication.

## Combining authored copy with GitHub-generated details

The release-writing workflow may preserve GitHub's useful PR/contributor detail after the authored sections. Example final Release body:

~~~md
<!-- release-social:v1 -->

<!-- announcement:start -->
Fictional App v1.2.3 makes release previews deterministic while preserving conservative retry behavior.
<!-- announcement:end -->

## Highlights

- Added exact X and LinkedIn preview validation before live publication.
- Preserved confirmed destination successes when another destination fails.

## Upgrade notes

No breaking changes.

<!-- social:short
Fictional App v1.2.3 adds deterministic social release previews and conservative retry handling.
-->

## GitHub-generated details

### What's Changed

- Add preview workflow by @fictional-contributor in #123
- Preserve state recovery by @fictional-maintainer in #124
~~~

The consumer publishes that combined body once as the GitHub Release body. release-social subsequently reads it through the canonical release API. It does not modify the published release.

## Canonical release-writer agent instruction

Consumers can reference this section from their own release process.

~~~text
You are preparing the authored release-social sections for a GitHub Release.

Evidence rules:
- Read the real release diff, merged pull requests, changelog, tests, migration notes, and other repository evidence provided by the consumer workflow.
- Make no claim that is not supported by that evidence.
- Preserve meaningful limitations, compatibility constraints, incomplete work, and known upgrade requirements.
- Do not infer benefits, performance gains, security properties, support guarantees, or compatibility that the evidence does not establish.
- Do not include credentials, private operational data, private account identities, or internal-only links.

Authoring rules:
- Start from the canonical release-social:v1 template in the release-social repository.
- Make the announcement benefit-first and concrete, using exactly one plain-text paragraph.
- Keep ## Highlights technical and specific.
- State breaking/upgrade impact explicitly under ## Upgrade notes; write "No breaking changes." only when supported.
- Write concise shared social:short copy.
- Add social:x or social:linkedin only when a provider genuinely needs different copy.
- Use social:skip when the release should not be announced.
- Keep announcement/social prose plain text; no inline Markdown, HTML, links, lists, or multiple paragraphs.

Workflow rules:
- The consumer workflow may append GitHub-generated PR/contributor details after the authored sections.
- The final combined Markdown becomes the single GitHub Release body.
- Do not regenerate or rewrite the Release body during social publication.
- Before release publication, run the release-social package validator/preview against the exact candidate body and consumer config.
- If validation fails, fix the authored release evidence/copy; do not bypass validation or silently truncate text.
~~~

## Validation

Once the candidate body is the actual GitHub Release body, validate/preview the known release:

~~~sh
GH_TOKEN=... release-social validate \
  --repository FICTIONAL-ORG/fictional-app \
  --release-id 12345678 \
  --config .github/release-social.json

GH_TOKEN=... release-social preview \
  --repository FICTIONAL-ORG/fictional-app \
  --release-id 12345678 \
  --config .github/release-social.json
~~~

These commands read the canonical GitHub Release. They do not regenerate notes. Preview does not load social credentials, call social providers, or write publishing state.
