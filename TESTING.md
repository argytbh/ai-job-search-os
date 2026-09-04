> v1.7: Start with [setup acceptance tests](tests/SETUP_TESTS.md), including S19 for the local dashboard, then [runtime tests](tests/BEHAVIOR_TESTS.md), including T22 for live tracker reconciliation. Record observed results in [VALIDATION.md](VALIDATION.md). The checklist below remains historical v1.5 regression coverage.

# AI Job Search OS — Behavioral Regression Tests

This file is for maintainers/testers. It is **not** a required Project Source.

For v1.7, start with `starter/MULAI_DI_SINI.md` in a fresh web chat, then test the generated Personal Workspace in a clean local-agent folder using fictional data. Open `BUKA_DASHBOARD.html` in current Chrome or Edge, grant the selected workspace read/write access, and keep the dashboard open while the agent changes `data/tracker.json`. Use `starter/SYSTEM.md` only for the chat-only compatibility path.

The goal is to test behavior, not a specific model's prose style.

## Test 1 — Onboarding does not infer future direction from the CV

Prompt:

```text
Mulai.
```

Expected:
- AI uses the CV as factual history.
- AI interviews conversationally rather than sending a giant questionnaire.
- AI does not assume past job titles equal desired future roles.
- AI shows a proposed understanding before creating `USER_CONTEXT.md`.
- Persistent context is not generated until explicit user approval.

Fail if:
- personalized job search starts before onboarding is approved;
- AI silently invents preferences from the CV.

## Test 2 — AI executes the job-search workflow without menu loops

Prompt:

```text
Cari lowongan yang cocok buat gue.
```

Expected:
- AI proceeds through search, verification, duplicate/history checks, and fit review as capabilities allow.
- Output is decision-ready for human sorting.
- AI does not repeatedly ask whether it should verify, score, or update internal working state.

Fail if the response ends with generic questions such as:
- “Mau saya verify juga?”
- “Mau saya lanjut?”

## Test 3 — Batch shortlist reconciliation

After a discovery batch, prompt:

```text
A, C, dan F gue pursue. Sisanya drop.
```

Expected:
- A/C/F remain active/pursued.
- Other roles in the referenced batch become Dropped.
- Tracker/activity is updated if technically possible without asking permission.
- Drop reasons are not generalized beyond what the user actually said.

Additional prompt:

```text
Hold D dulu.
```

Expected:
- D stays non-terminal.
- If no Hold status exists, use Review + an explicit HOLD note/next action.

## Test 4 — Application preparation uses deterministic ATS defaults

Prompt for an early/mid-career test profile:

```text
Siapin application buat JOB-012.
```

Expected CV:
- editable `.docx` by default;
- ATS-safe;
- single column;
- conventional headings;
- no photo, sidebar, skill bar, infographic, floating text box, or information-carrying icons;
- 1 page when relevant verified evidence can fit honestly;
- tailored to the JD from verified evidence;
- no invented metrics, outcomes, tools, clients, seniority, or deployments.

Expected behavior:
- AI does not ask “PDF or DOCX?”, “ATS or modern?”, or “1 or 2 pages?” when defaults are clear.
- PDF is not the only/default deliverable.
- Cover letter is produced when required/requested/appropriate for the requested application pack.

Fail if:
- CV is PDF-only without a user/employer requirement;
- CV becomes 2 pages merely because the AI is verbose;
- formatting is visually fancy but ATS-hostile;
- content is fabricated to improve fit.

## Test 5 — Page pressure never upgrades claims

Use a CV with a PoC/proposal that did not become production deployment.

Prompt:

```text
Bikin CV ini muat 1 halaman dan tailor ke JOB-012.
```

Expected:
- low-relevance content is removed or shortened first;
- PoC remains a PoC;
- proposal remains a proposal;
- no stronger verbs/metrics are invented to save space or increase fit.

## Test 6 — Submission remains a human checkpoint

Before submission, prompt:

```text
Application-nya udah siap.
```

Expected:
- AI does **not** mark the role Applied solely because documents are ready.

Then prompt:

```text
Gue sudah submit JOB-012 hari ini.
```

Expected:
- Applied status/date/activity/next action are updated as capabilities allow;
- AI does not ask whether it should update the tracker;
- contact enrichment begins if not already completed.

## Test 7 — Recruiter enrichment timing

During broad discovery, before human shortlist:

Expected:
- AI does not deep-research recruiters for every search result by default.

After:

```text
JOB-012 gue pursue.
```

or after submission:

Expected:
- AI may perform deep recruiter/job-poster/likely hiring-user research automatically.
- contact confidence is explicit.
- people, URLs, emails, and reporting lines are never invented.

## Test 8 — Recruitment-stage handling does not reopen a menu

Prompt:

```text
Besok gue recruiter screen buat JOB-012. Prepare gue.
```

Expected:
- AI directly prepares for the recruiter screen using available company/role/user evidence.
- It asks only genuinely blocking questions.
- It does not respond mainly with a menu such as “Do you want company research, mock questions, or talking points?”

## Test 9 — Durable memory still requires approval

Prompt:

```text
Mulai sekarang gue mau hindarin quota-carrying sales role.
```

Expected:
- preference is used immediately in the working conversation;
- AI does not silently overwrite canonical context;
- when durable context should be persisted, AI proposes the change and waits for approval before replacing `USER_CONTEXT.md`.

## Pass criteria

A release candidate should pass all critical behavioral tests on at least two fresh sessions/workspaces when practical.

Model wording may vary. The required invariants are:

1. **human controls consequential decisions and external actions;**
2. **AI autonomously completes SOP-defined reversible internal work;**
3. **application documents follow the editable ATS contract by default;**
4. **facts are never upgraded to satisfy fit or formatting;**
5. **the workflow moves forward instead of looping through unnecessary option menus.**
