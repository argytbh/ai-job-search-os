# Persistence, Durable Context & Reporting

## Tracker role

The Personal Workspace supports exactly one configured operational tracker:

- `local_json` (default): `data/tracker.json` is canonical and the local HTML dashboard reads/writes it;
- `google_sheets` (optional): one verified Google Sheet owned by the user is canonical and acts as the cross-device tracker UI.

Read `data/tracker.config.json` when present. Never maintain JSON and Google Sheets as simultaneous canonical databases. A mode switch requires explicit user choice, a backup/export of the source, one-time reconciliation into the destination, destination read/write verification, and only then a config update. Preserve Job IDs and Activity history.

An existing XLSX/CSV tracker remains valid input and may be preserved or migrated with user approval.

Expected logical collections:
- `jobs`: one record per viable opportunity;
- `contacts`: relevant recruiter/hiring-user records linked by Job ID;
- `activity`: meaningful history/milestones;
- `reports/DASHBOARD.md`: generated readable pipeline summary, never canonical state.
- interactive local dashboard: optional user interface over `data/tracker.json`, never a second database.

The JSON state is transparent infrastructure, not homework for the user. The AI maintains it and generates human-readable reports or optional XLSX/CSV exports.

## Optional Google Sheets mode

Use Google Sheets only when the user chose it and the current agent has a real authenticated connector that can create, read, and write the Sheet. The user completes Google authorization in the provider's official UI. Never request credentials, treat a public/edit link as authenticated write access, or claim success from opening a URL.

Create or verify three tabs with one header row and stable IDs:

- `Jobs`: Job ID, Company, Role, Status, Location, Job URL, Discovered At, Applied At, Interview At, Recruiter Name, Recruiter LinkedIn, Role Category, Industry, Work Arrangement, Employment Type, Next Action, Notes, Updated At;
- `Contacts`: Contact ID, Job ID, Name, Role, Profile URL, Confidence, Notes;
- `Activity`: Activity ID, Job ID, At, Type, Summary.

Freeze headers and add status validation when supported, but do not block setup on cosmetic formatting. Prove persistence by creating/reading the required structure and performing a harmless write/read-back in the user-owned Sheet. Record the exact `https://docs.google.com/spreadsheets/...` URL and verification timestamp in `data/tracker.config.json` only after success.

If authenticated Sheet access is unavailable, state that limitation once. Keep or return to `local_json` only with the user's choice; never fall back silently or instruct repeated public-link workarounds.

## File persistence

Read `startup.md` on session recovery or when file authority is unclear. Never overwrite existing data with a release's blank tracker. If tracker copies disagree, establish which is current before writing.

Capabilities differ by platform.

If the platform can genuinely persist tracker changes:
- read the latest canonical tracker;
- check duplicates by requisition ID or canonical job URL, then by normalized company + role + location;
- for new jobs, record useful dates (`discovered_at`, `applied_at`, and the next known `interview_at`) plus `role_category`, `industry`, `work_arrangement`, `employment_type`, and `source_name` when the posting or verified company evidence supports them; use `null` or omit an optional value when it is unknown instead of guessing;
- preserve existing Job IDs and append meaningful activity;
- for nontrivial migrations, create a dated backup;
- write valid JSON through a temporary file when supported, replace the canonical file, and read it back;
- refresh `reports/DASHBOARD.md` after successful persistence.

The user may add or edit job records, change job status, and export a CSV through the interactive dashboard. Treat dashboard writes as explicit human input. When a dashboard status transition first reaches `Interview`, record the transition time in an empty `interview_at` field; preserve an interview date/time already entered by the user or agent. Re-read the tracker immediately before agent writes, preserve dashboard-created jobs, contacts, dates, classifications, and activity records, and reconcile/retry if the state changed during the operation. Never replace a newer tracker with a stale in-memory copy.

In `local_json` mode, the dashboard presents four connected views over that state: Kanban overview, evidence-grounded analytics, a searchable tracker table, and activity logs. Missing analytics classifications must remain visibly unclassified rather than being inferred by the interface. In `google_sheets` mode, the HTML dashboard directs the user to the verified Sheet and must not edit a stale JSON snapshot.

If it cannot:
- never claim the file was updated;
- maintain the latest working state available in the conversation/project;
- when persistence is needed, generate replacement structured state and tell the user exactly what to replace.

Do not repeatedly ask the user whether standard tracker updates should happen.

## Durable context changes

During normal use, new preferences may emerge.

Use a newly stated preference immediately in the current conversation when clear, but do not silently rewrite canonical identity from one casual statement.

When meaningful durable changes accumulate:
1. summarize the proposed changes;
2. use the narrowest valid scope;
3. ask the user to approve/correct the durable update;
4. after approval, generate a complete replacement `USER_CONTEXT.md`;
5. increment `context_version`;
6. tell the user to replace the prior context file in persistent Project/workspace sources.

Examples of durable changes:
- “From now on, avoid quota-carrying sales.”
- “I prefer implementation-heavy transformation over pure strategy.”

Examples that are NOT automatically durable/global:
- one office location is inconvenient;
- one specific manager/company interaction was poor;
- a temporary salary constraint;
- one irrelevant posting.

## Decision memory scope

Use the narrowest valid scope:
- posting;
- role;
- location;
- company;
- industry;
- temporary.

One bad role does not create a company ban.
One company does not create an industry ban.

## Reporting

When the user asks for tracker/dashboard/pipeline analysis, read the latest available state and analyze:
- discovered/review opportunities;
- applications;
- recruiter screens;
- interviews;
- offers;
- rejections;
- drops;
- closed roles;
- conversion rates;
- common drop reasons;
- stale/no-action items;
- bottlenecks;
- recommended next actions.

Distinguish small samples from reliable trends.
Never invent causality from insufficient evidence.

## Runtime repository rule

Once the workspace or Skill is operational, normal job-search use must not depend on repeatedly fetching this GitHub repository. Never run Git commands in a Personal Workspace.

User/project data must not be sent back to the public repository as part of normal operation.

Repository/version checking is a distribution/update concern, not a per-prompt runtime requirement.

## Completion criteria

Persistence/reporting work is complete when:
- operational state reflects known facts as far as platform capability allows;
- durable context updates have required human approval;
- any file-replacement action is stated clearly;
- reports are grounded in tracker evidence and distinguish fact from inference.
