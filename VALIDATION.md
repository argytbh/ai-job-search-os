# v1.6.0 validation

## Local automated checks

The distribution tests cover reproducibility, complete Personal Workspace contents, canonical runtime parity, payload checksums, migration-guide generation, Git-metadata exclusion, Pages download targets, missing-module rejection, and version-mismatch rejection. They validate artifacts, not AI decisions.

Reproduce using Python 3.10+:

```text
python scripts/build_release.py
python scripts/build_release.py --check
python -m unittest discover -s tests -p "test_*.py" -v
```

Observed on the local Windows development checkout using bundled Python 3.12:

- **PASS:** 12 distribution tests.
- **PASS:** build/check of all 11 generated artifacts.
- **PASS:** Skill Creator quick_validate.py reports `Skill is valid!` (PyYAML 6.0.3 installed only in ignored .tmp/skill-validator for this check).
- **PASS:** `git diff --check`.

The system Python launcher was unavailable, so checks used the bundled runtime. The first Skill-validator attempt lacked PyYAML; the successful run used the temporary dependency and read-only elevated access required by its local file permissions. No global Python install was changed.

## Live host acceptance

Observed on 2026-09-04 in Codex desktop on Windows, using GPT-5.6 Sol Medium and a clean extraction of the `1.6.0-dev.2` release-candidate Personal Workspace ZIP. The stable `1.6.0` package preserves the tested runtime and changes release-version metadata; its package integrity is covered by the automated checks above.

- **PASS S04:** the extracted folder opened as a local Codex project and Codex followed the workspace entry instructions.
- **PASS S09 (release candidate):** Codex read version `1.6.0-dev.2`, validated the empty `jobs`, `contacts`, and `activity` arrays in `data/tracker.json`, created `data/SETUP_STATUS.json`, and read it back.
- **PASS artifact evidence:** the resulting file records `local_write_verified: true` with a timestamp and matching workspace version.
- **Observed safety behavior:** Codex reported the workspace ready without Git and changed only `data/SETUP_STATUS.json` during setup.
- **PASS S11:** using a fictional sanitized CV, Codex interviewed adaptively, treated the CV as career-history evidence rather than a predetermined career goal, separated verified facts/preferences/targets/interpretation, and explicitly requested approval before persistence.
- **PASS S11 artifact evidence:** after the fictional user approved the summary, Codex created and read back `profile/USER_CONTEXT.md`. The file records `user_approved: true`, identifies itself as fictional test data, preserves unsupported-claim boundaries, and records the approved Power BI/BI Analyst direction separately from a longer-term managerial path.
- **PASS S12/S18:** in a new Codex task for the same local project, the agent detected Active Mode, read the approved profile and empty tracker, returned the correct priority roles and avoidance constraints, and did not repeat onboarding.
- **PASS S18 artifact evidence (release candidate):** the fresh task reported zero jobs, contacts, and activities, preserved `updated_at: null`, identified workspace version `1.6.0-dev.2`, and confirmed that no file was changed during the read-only recovery check.

S01–S03, S04A, S05–S10, and S13–S17 remain **pending live host execution**. All runtime T01–T21 remain **pending live host execution for this version**, including the required T07/T08/T10/T13/T20/T21 regressions. There is no claim that these passed from reviewing their wording.

The complete Migration Coach journey, Claude Code/Antigravity IDE/Cursor setup, live job search, application document delivery, and tracker mutation remain untested. Codex local setup, fictional-profile onboarding, and fresh-session recovery are supported by observed evidence.

Record future runs with host/version, actual tools, fictional inputs, expected vs observed behavior, resulting artifacts, and the new-session check. Publish no real CV, personal context, or job-search history as evidence.

## Publication

The stable ZIPs are reproducible release artifacts. Exact release links become exercisable when tag `v1.6.0` and its GitHub Release are published. The matching release-candidate runtime passed the local Codex tests above; the complete Migration Coach download journey and other named-host routes remain pending.
