# Validation

## v1.7.0 development candidate

v1.7.0 adds an optional browser dashboard over the Personal Workspace's existing `data/tracker.json`. The dashboard has no cloud database and no network-write path: the user explicitly selects a local workspace folder in Chrome or Edge, the board checks that tracker about every 1.5 seconds while visible, and user status changes are written back to that same file with a `status_changed` activity record.

Observed on the local Windows development checkout using bundled Python 3.12 and Node.js 24:

- **PASS:** reproducible build/check of all 11 generated v1.7.0 artifacts.
- **PASS:** 13 distribution tests, including dashboard packaging, local-only Content Security Policy, required local-file APIs, polling contract, and absence of common network APIs.
- **PASS:** `node --check docs/dashboard/dashboard.js`.
- **PASS:** `git diff --check`.
- **PASS:** Skill Creator `quick_validate.py` reports `Skill is valid!` for `skill/ai-job-search-os`.
- **PASS (UI shell only):** the dashboard entry screen loaded from a local HTTP server in the Codex in-app browser at desktop width, exposed the expected folder-selection action, and produced no browser console warnings or errors.
- **PASS (fictional browser fixture):** Dashboard/Kanban, Analytics, Tracker, and Logs rendered from a synthetic tracker. A user-added job appeared immediately in Tracker and Kanban, its subsequent date edit passed write/read-back verification, duplicate-URL entry was rejected, and both changes appeared in Logs. Analytics updated to the new total and rendered pipeline/work-arrangement donuts plus role, industry, location, source, and active-age bars. A first transition to Interview filled an empty timestamp, while another transition preserved an existing scheduled interview. CSV export processed all three jobs and displayed its Excel-readable download confirmation. The in-app browser harness did not expose the resulting downloaded file for an Excel open/read check. The temporary fixture was removed after the run.
- **PASS (fictional tracker-mode fixture):** a `local_json` configuration opened the normal JSON-backed dashboard, while a separately isolated `google_sheets` configuration showed only the exact verified Sheet link and did not render or edit the local JSON snapshot. This verifies dashboard routing and the single-store boundary, not Google authorization or connector persistence.

S03A–S03C, S19–S20, T22, and T23 remain **pending complete live execution**. The Migration Coach storage-choice conversation, Google authorization, real Sheet creation/read/write, OS folder permission flow, remembered permission, live agent-to-dashboard refresh, write-back to a user-selected workspace folder, downloaded CSV opening in Excel, and concurrent agent/dashboard reconciliation have not yet been exercised end to end. Source review, static tests, and fixture UAT do not establish those behaviors.

## v1.6.0 released baseline

### Local automated checks

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

### Live host acceptance

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

### Publication

The stable ZIPs are reproducible release artifacts. Exact release links become exercisable when tag `v1.6.0` and its GitHub Release are published. The matching release-candidate runtime passed the local Codex tests above; the complete Migration Coach download journey and other named-host routes remain pending.
