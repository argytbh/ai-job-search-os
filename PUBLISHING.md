# Publishing Guide

This file is for the repository maintainer.

## 1. Create the repository

Recommended repository name:

`ai-job-search-os`

Make it public.

Upload the contents of this folder to the repository root.

## 2. Enable GitHub Pages

In the repository:

1. Open **Settings**
2. Open **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select the default branch (usually `main`)
5. Select folder `/docs`
6. Save

The landing page is `docs/index.html`.

On a standard project site, it will normally be available at:

`https://YOUR-USERNAME.github.io/ai-job-search-os/`

The landing page automatically infers the GitHub repository link when hosted on a standard `github.io` project URL.

## 3. Create GitHub Release v1.5.0

Create a new release:

- Tag: `v1.5.0`
- Title: `AI Job Search OS v1.5.0`

Use:

`release/RELEASE_NOTES_v1.5.md`

as the basis for the release description.

Attach:

`release/AI-Job-Search-OS-Starter-v1.5.zip`

as the release asset.

The GitHub Pages download button does not depend on the Release being configured; it serves the same starter ZIP directly from `/docs/downloads/`.

## 4. Public link

For nontechnical users, share the GitHub Pages URL.

For people who want to audit the files, share the GitHub repository URL.

## 5. Updating later

For a future version:

1. update canonical files under `/starter`;
2. rebuild the starter ZIP;
3. update `/docs/downloads`;
4. update `CHANGELOG.md`;
5. update checksums;
6. publish a new tagged GitHub Release.

Do not silently replace a published release asset without changing the version.
