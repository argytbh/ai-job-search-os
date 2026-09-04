# Changelog

All notable public changes to AI Job Search OS will be documented here.

## [Unreleased]

- Added cookie-free aggregate visit analytics to the public landing page only. The local dashboard and Personal Workspace remain outside analytics.

## [1.7.0] - 2026-09-04

- Added a no-account local dashboard that reads and writes the selected Personal Workspace through browser-granted folder access.
- Added a software-style navigation panel with connected Dashboard/Kanban, Analytics, Tracker/table, and Logs views.
- Added live tracker polling, KPI cards, donut/bar analytics, evidence-grounded classifications, pipeline-age signals, search/filter controls, job and recruiter links, and activity history.
- Added manual job creation/editing, Excel-readable CSV export, automatic first Interview timestamping, duplicate checks, concurrent-write protection, activity logging, and read-back verification.
- Added a one-click dashboard launcher to the Personal Workspace; no job-search data is uploaded to the dashboard host.
- Limited direct folder access to supporting HTTPS browsers, with a clear Chrome/Edge fallback message.
- Bounded onboarding to focused question batches and strengthened application delivery with per-job persistence, read-back/visual QA, and tracker activity without premature Applied status.
- Added an optional verified Google Sheets tracker mode while preserving local JSON + HTML dashboard as the no-Google default; each workspace records exactly one canonical tracker to prevent conflicting dual writes.
- Changed the Migration Coach to present the complete matching setup route in clear sections and stages, pausing only for a required choice, external authorization, or an unverified interface.
- Added a concise bilingual HowTo section and structured HowTo metadata to GitHub Pages, covering the full path from the starter file through local-agent onboarding.
- Routed the public starter-file CTA through the versioned GitHub Release asset so future downloads have an observable count.

## [1.6.0] - 2026-09-04

- Changed the recommended runtime from upload-first chat Projects to a folder-capable local Personal Workspace.
- Added a generated Indonesian-friendly Migration Coach that guides one action at a time from web chat to Codex, Claude Code, Antigravity IDE, Cursor, or a compatible folder-capable agent.
- Added a personal-account safety gate with official-download-only guidance and no credential collection.
- Added a reproducible Personal Workspace ZIP with no Git metadata, remotes, maintainer scripts, credentials, or personal data.
- Added agent instructions for verified local writes, JSON tracker persistence, backups, report refresh, and strict prohibition of Git/push/publish actions.
- Retained native Skill and chat-only Portable Mode as compatibility fallbacks.
- Added observed Codex acceptance evidence for local setup, approval-gated fictional onboarding, persistence, and fresh-session recovery; other named hosts remain unverified.

## [1.6.0-dev.1] - Unreleased development history

- Added a generated SYSTEM.md bootstrap for upload-first setup across capability profiles.
- Connected exact-version Skill acquisition, native verification, pending human import, portable fallback, and session recovery.
- Added a startup module with honest browsing/document/storage fallbacks and protection of existing user context and tracking history.
- Added reproducible Starter/Skill ZIP builds, complete embedded portable workflow, checksums, package checks, and setup acceptance scenarios.
- Updated setup documentation and Pages downloads for the development package.
- Native installation and live workflow behavior on named platforms remain unverified; see VALIDATION.md. No public release/tag has been created by these changes.

## [1.5.0] - 2026-09-03

### Added
- Single end-to-end `SYSTEM.md` operating specification.
- Human-approved onboarding flow.
- Generation of persistent `USER_CONTEXT.md` only after user approval.
- AI-led and user-supplied job discovery workflows.
- Official career-page verification and stale-link handling.
- Alternative-role discovery at the same employer.
- Recruiter / likely hiring-user enrichment with confidence and evidence rules.
- Human-controlled PURSUE / HOLD / DROP and APPLY decisions.
- Lean Excel tracker with Jobs, Contacts, Activity, and Dashboard.
- Durable context update flow with explicit user approval.
- Privacy and anti-hallucination guardrails.

### Fixed during pre-publication testing
- Added a deterministic **Global Execution Rule** so the AI operates as a workflow rather than repeatedly offering menus or asking permission for obvious internal steps.
- Added an explicit **Autonomy Boundary**: low-risk/reversible internal work proceeds automatically; consequential decisions and external actions remain human-controlled.
- Added an **ask-only-blocking-questions** rule. Safe defaults should be used instead of asking questions such as “ATS or fancy?”, “PDF or DOCX?”, “update the tracker?”, or “search recruiters too?”.
- Added a first-class **Application Preparation** stage with completion criteria.
- Added an **ATS CV Document Contract**: editable DOCX by default, single-column ATS-safe layout, conventional headings, no photos/icons/sidebars/skill bars/infographics/text boxes, and no silent PDF substitution.
- Added CV length rules: 1 page by default for early/mid-career profiles when evidence fits honestly; 2 pages only when relevant experience/seniority genuinely justifies it.
- Added a **Cover Letter Contract** with editable DOCX and 1-page defaults when a cover letter is required/requested/appropriate.
- Added application-artifact QA for company/role correctness, page count, editability, factual consistency, sensitive-data leakage, and unsupported claims.
- Added batch shortlist reconciliation such as “Pursue A, C, F; drop the rest,” while preventing accidental drops when the user's wording does not cover unmentioned roles.
- Clarified HOLD handling when the workbook has no dedicated Hold status: keep it non-terminal as Review with explicit HOLD notes/next action.
- Moved deep recruiter/hiring-user enrichment to primarily after the user chooses to pursue/apply, reducing wasted research on discovery noise.
- Added workflow completion criteria so the AI does not stop at arbitrary midpoints with generic “Would you like me to continue?” prompts.
- Strengthened truthfulness under page pressure: formatting constraints never justify stronger claims, invented metrics, or merged unrelated evidence.

### Changed
- Reduced the initial project source footprint to `SYSTEM.md`, `JOB_TRACKER.xlsx`, and the user's sanitized CV.
- Removed empty placeholder profile/evidence/memory files from initial setup.
- Reduced preallocated tracker rows to improve portability and context efficiency.
- During pre-publication testing, starter files are distributed individually from the repository/GitHub Pages so users always receive the current auditable `SYSTEM.md` and tracker rather than a stale packaged ZIP.
