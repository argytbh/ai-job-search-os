# Application Preparation Workflow

## Trigger

Treat the following as application-preparation intent when the target role is identifiable:
- “I want to apply to this role.”
- “Prepare my application for JOB-XXX.”
- “Make my CV for this role.”
- “Siapin CV/cover letter buat ini.”

Do not ask what format the user wants when the document defaults are defined by `ats-documents.md`.

## Workflow

For a general “prepare my application” request:
1. identify the exact company/role/Job ID;
2. re-check the posting is still live when practical;
3. read the full JD or best available official scope;
4. retrieve verified evidence from `USER_CONTEXT.md` and the sanitized CV;
5. build an internal requirement → evidence map;
6. identify material gaps that must NOT be disguised;
7. decide which artifacts are actually appropriate;
8. generate the ATS CV using `ats-documents.md`;
9. generate a cover letter when required/accepted/useful for an application pack, or explicitly requested;
10. draft visible application questions when available and answerable from verified context;
11. run artifact QA;
12. save deliverables under `applications/<JOB_ID>/` when a Personal Workspace is available, using a new versioned filename rather than overwriting a user-edited file;
13. read the saved files back and, when document rendering is available, visually inspect and fix them;
14. record successful preparation in tracker Activity and set a concise review/submit next action without changing the job to `Applied`;
15. give a concise application brief and state the single next human action: review/edit and submit on the official employer site.

If the user explicitly requests only one artifact, such as “CV only,” create only that artifact.

Do not ask “CV or cover letter?” when the user's phrase “application pack” or equivalent already implies the normal package.

Do not start a new fact-finding interview before drafting. Missing optional evidence means omit or soften that claim. Ask one compact batch only when missing facts would make the requested artifact materially inaccurate or unusable; otherwise create the best truthful artifact from current evidence and list the material gap once.

## Evidence discipline

Every substantive claim must trace to verified user evidence.

Allowed:
- reorder emphasis;
- tighten wording;
- use JD terminology when it truthfully matches existing experience;
- remove irrelevant content;
- foreground stronger role-relevant evidence.

Not allowed:
- invent metrics;
- convert familiarity into expertise;
- convert PoCs/proposals into deployments or completed outcomes;
- invent clients, team sizes, scope, certifications, or responsibilities;
- hide a genuine requirement gap by fabricating experience.

## Application questions

When a posting/application includes visible screening questions:
- answer automatically from approved facts when unambiguous;
- ask only for genuinely blocking facts not present in context, such as legal work authorization, compensation expectation, notice period, or a required declaration;
- never guess sensitive/legal eligibility facts;
- keep draft answers concise and role-specific.

## Submission boundary

The AI prepares; the human submits.

Never mark a role `Applied` until the user explicitly confirms submission.

Never enter or request passwords, OTPs, national ID/passport/tax numbers, bank data, or employer-portal credentials.

## Completion criteria

Application preparation is complete when:
- the role is correctly identified;
- the required artifacts are delivered in the correct editable format;
- claims pass truthfulness checks;
- document QA has been performed as far as platform capability allows;
- files are saved and readable in the target job folder when workspace persistence is available;
- tracker activity reflects preparation while status remains short of `Applied` until submission is confirmed;
- the user is told to review/edit and submit.

Do not end with a generic offer to “make it ATS-friendly” or “convert it to DOCX.” Those are already defaults.
