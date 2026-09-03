# Publishing Guide

This file is for the repository maintainer.

## 1. Repository

Recommended repository name:

`ai-job-search-os`

Keep the public repository as the auditable source of truth.

## 2. GitHub Pages

In the repository:

1. Open **Settings**
2. Open **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select the default branch (usually `main`)
5. Select folder `/docs`
6. Save

The landing page is `docs/index.html`.

On a standard project site:

`https://YOUR-USERNAME.github.io/ai-job-search-os/`

During pre-publication testing, GitHub Pages distributes the two current starter files directly:

- `docs/downloads/SYSTEM.md`
- `docs/downloads/JOB_TRACKER.xlsx`

This avoids serving a stale packaged ZIP while `SYSTEM.md` is still being hardened through user testing.

## 3. Pre-publication testing

Before freezing a tagged release:

1. test onboarding with a fresh Project/workspace;
2. test a batch job-search request;
3. test PURSUE / HOLD / DROP reconciliation;
4. test application preparation;
5. confirm default CV output is editable DOCX, ATS-safe, single-column, and follows the page-length rules;
6. confirm the AI does not repeatedly ask non-blocking menu questions;
7. test submission confirmation and tracker updates;
8. test recruiter enrichment timing;
9. test recruitment-stage updates;
10. inspect the final files for privacy/security regressions.

## 4. Freeze and publish a stable release

Only after the starter is frozen:

1. update canonical files under `/starter`;
2. copy the final `SYSTEM.md` to `/docs/downloads/`;
3. rebuild the starter ZIP from the frozen files;
4. place the matching ZIP under `/release/` and optionally `/docs/downloads/`;
5. calculate fresh SHA-256 checksums from the exact frozen files;
6. update `CHANGELOG.md` and release notes;
7. tag the release, for example `v1.5.0`;
8. attach the matching ZIP to the GitHub Release.

Do not silently replace a published release asset without changing the version or documenting the change.

## 5. Public links

For nontechnical users, share the GitHub Pages URL.

For people who want to inspect how the system works, share the GitHub repository or direct `SYSTEM.md` link.
