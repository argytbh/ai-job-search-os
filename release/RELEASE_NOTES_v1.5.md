# AI Job Search OS v1.5.0

Initial public version of the streamlined human-in-the-loop architecture, updated through pre-publication user testing.

## Starter files

The current starter consists of:

- `SYSTEM.md`
- `JOB_TRACKER.xlsx`

Users add their own sanitized CV.

During pre-publication testing, these files are distributed individually from `starter/` and GitHub Pages so users receive the latest auditable `SYSTEM.md` rather than an older packaged ZIP.

After conversational onboarding and explicit approval, the AI generates `USER_CONTEXT.md`, which should be added back to the same Project Sources.

## Application workflow defaults

The patched v1.5 workflow now defines application preparation as a first-class stage:

- the AI should execute SOP-defined low-risk internal steps without repeatedly asking permission;
- it should ask only genuinely blocking questions;
- default CV output is an **editable `.docx`**, not PDF;
- CV layout is ATS-safe and single-column;
- early/mid-career CVs default to 1 page when relevant evidence can fit honestly;
- 2 pages require genuine experience/seniority justification;
- cover letters default to editable DOCX when required/requested/appropriate;
- PDF is produced only when explicitly requested or required by the employer;
- page constraints never justify invented metrics, outcomes, skills, or stronger claims;
- deep recruiter/hiring-user enrichment primarily happens after the user chooses to pursue/apply.

## Human control

The user retains final control over:

- PURSUE / HOLD / DROP decisions;
- application submission;
- sending outreach;
- sensitive information;
- offer decisions;
- durable `USER_CONTEXT.md` changes.

## Notes

AI search, LinkedIn, and job boards may be stale or incomplete. Verify important opportunities on the employer's official careers page before applying.

No plugins, API keys, OAuth connections, executables, or account connections are required by the workflow itself.
