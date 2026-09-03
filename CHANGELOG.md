# Changelog

All notable public changes to AI Job Search OS will be documented here.

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
