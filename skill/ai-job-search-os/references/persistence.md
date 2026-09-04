# Persistence, Durable Context & Reporting

## Tracker role

`data/tracker.json` in the Personal Workspace is the preferred operational WHAT/NOW database. An existing XLSX/CSV tracker remains valid input and may be preserved or migrated with user approval.

Expected logical collections:
- `jobs`: one record per viable opportunity;
- `contacts`: relevant recruiter/hiring-user records linked by Job ID;
- `activity`: meaningful history/milestones;
- `reports/DASHBOARD.md`: generated readable pipeline summary, never canonical state.

The JSON state is transparent infrastructure, not homework for the user. The AI maintains it and generates human-readable reports or optional XLSX/CSV exports.

## File persistence

Read `startup.md` on session recovery or when file authority is unclear. Never overwrite existing data with a release's blank tracker. If tracker copies disagree, establish which is current before writing.

Capabilities differ by platform.

If the platform can genuinely persist tracker changes:
- read the latest canonical tracker;
- check duplicates by requisition ID or canonical job URL, then by normalized company + role + location;
- preserve existing Job IDs and append meaningful activity;
- for nontrivial migrations, create a dated backup;
- write valid JSON through a temporary file when supported, replace the canonical file, and read it back;
- refresh `reports/DASHBOARD.md` after successful persistence.

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
