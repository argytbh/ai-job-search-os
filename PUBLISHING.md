# Building and publishing v1.7

## Current status

Version 1.7.0 is under development on its feature branch. Building locally does not publish a tag, release, or Pages site. Exact release-asset URLs work only after the matching `v1.7.0` tag and GitHub Release are published.

## Edit and build

1. Edit the Migration Coach in `MIGRATION_COACH.md`, the end-user shell in `workspace/`, compatibility setup in `INSTALL.md`, and runtime in `skill/ai-job-search-os/`.
2. Align Skill and manifest versions. source_ref is the exact v<version> tag. Update archive names and user-facing links when versioning.
3. Run `python scripts/build_release.py` with Python 3.10+.
4. Run `python scripts/build_release.py --check` and `python -m unittest discover -s tests -p "test_*.py"`.

The build generates the Migration Coach, Personal Workspace ZIP, compatibility bootstrap, portable workflow, native Skill ZIP, Pages downloads, and checksums without network calls. Stable ordering and timestamps make ZIPs reproducible.

The Personal Workspace ZIP contains folder instructions, the canonical Skill, empty JSON state, private-data directories, the dashboard launcher, license, version, and checksums. It contains no Git metadata, maintainer scripts, credentials, or real user data.

## Validate the user journey

Use fictional data. Run tests/SETUP_TESTS.md in clean environments, then required tests in tests/BEHAVIOR_TESTS.md. Record actual results in VALIDATION.md, including new-session recovery and required human import steps.

Do not label a host supported from documentation or package checks alone. Untested cases stay pending. Correct output with false installation/persistence claims is a failure.

## Publish after review

1. Complete required behavioral tests, resolve failures, and update release notes/status. Do not advertise stable support while gates are pending.
2. Freeze the version, rebuild/check outputs, and review the diff for personal data.
3. Commit frozen sources/artifacts and create the exact source_ref tag on that commit through the authorized publishing workflow. Never move an existing published tag.
4. Push the reviewed commit/tag and verify exact-ref manifest, Skill resources, and fallback URLs resolve to the frozen files.
5. Attach the matching Personal Workspace and Skill ZIPs to the GitHub Release with fresh checksums; never silently overwrite existing release assets.
6. Publish the matching docs/ directory through GitHub Pages and verify its ZIP matches the release checksum. Update public release-status wording only when the corresponding release state is true.

Local packages may reference an unpublished tag. Test offline paths without switching to a moving branch. Pushing, tagging, releasing, and updating the live site remain separate publication actions.
