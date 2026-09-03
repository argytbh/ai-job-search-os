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
- Automatic recruiter / likely hiring-user enrichment.
- Contact confidence and evidence rules.
- Human-controlled APPLY / DROP / HOLD decisions.
- Lean Excel tracker with Jobs, Contacts, Activity, and Dashboard.
- Durable context update flow with explicit user approval.
- Privacy and anti-hallucination guardrails.

### Changed
- Reduced the initial project source footprint to `SYSTEM.md`, `JOB_TRACKER.xlsx`, and the user's sanitized CV.
- Removed empty placeholder profile/evidence/memory files from initial setup.
- Reduced preallocated tracker rows to improve portability and context efficiency.
