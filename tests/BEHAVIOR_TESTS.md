# AI Job Search OS v1.7 — Behavioral Acceptance Tests

These tests define expected runtime behavior. They are maintainer QA, not user instructions.

## Test principle

A pass requires both:
1. correct content/result; and
2. correct workflow behavior — especially no unnecessary A/B menus or micro-confirmation loops.

## T01 — Fresh onboarding

**Setup:** Skill installed; sanitized CV present; no `USER_CONTEXT.md`.

**Prompt:** `Mulai job search gue.`

**Expected:**
- detects onboarding mode;
- reads CV as factual history only;
- begins with no more than three focused questions and uses at most one two-question follow-up batch unless the user explicitly requests deeper coaching or a blocking answer is unusable;
- does not repeat answered questions and treats optional details as unknown/flexible instead of extending onboarding;
- does not start personalized discovery before enough approved context exists;
- eventually shows proposed understanding and requires explicit approval;
- generates `USER_CONTEXT.md` only after approval.

## T02 — Existing context skips onboarding

**Setup:** Approved `USER_CONTEXT.md` present.

**Prompt:** `Cari kerja buat gue.`

**Expected:**
- immediately uses Active Mode;
- does not re-interview the user;
- starts discovery using approved constraints and tracker history.

## T03 — Discovery batch

**Prompt:** `Cari 15 lowongan yang cocok buat gue.`

**Expected:**
- searches broadly;
- removes obvious noise/hard-constraint violations;
- checks duplicates/history;
- freshness-verifies important roles where practical;
- returns decision-ready shortlist;
- does NOT deep-search recruiter contacts for all 15 before human sorting;
- next human action is shortlist decision.

## T04 — Batch decision semantics

**Context:** AI returned jobs A–F.

**Prompt:** `A, C, F gue pursue. Sisanya drop.`

**Expected:**
- pursue A/C/F;
- drop B/D/E;
- updates tracker/activity without asking permission;
- does not require row-by-row confirmation.

## T05 — Unmentioned roles are not silently dropped

**Context:** AI returned A–F.

**Prompt:** `A gue pursue.`

**Expected:**
- pursue A;
- leaves B–F unresolved/review unless prior instruction covers them;
- does not infer “drop the rest.”

## T06 — Narrow drop scope

**Prompt:** `Drop yang ini. Kantornya kejauhan, tapi company-nya bagus.`

**Expected:**
- marks the role Dropped;
- reason scoped to location/posting;
- does not blacklist the company globally.

## T07 — Application trigger does not menu-loop

**Prompt:** `Siapin application buat JOB-012.`

**Expected:**
- does NOT ask: ATS vs modern, PDF vs DOCX, 1 vs 2 pages, CV vs application pack when context is clear;
- reads JD + verified evidence;
- builds the appropriate application artifacts;
- does not restart broad career discovery or ask for optional facts already absent from the evidence;
- saves/read-checks the artifacts under `applications/JOB-012/` when workspace persistence is available;
- records preparation without marking the job Applied;
- states only genuinely blocking facts if any.

## T08 — ATS CV default

**Profile:** early/mid-career with enough evidence for one page.

**Prompt:** `Bikin CV buat JOB-012.`

**Expected:**
- editable `.docx` default;
- single-column ATS-safe layout;
- conventional headings;
- no icons/photo/sidebar/skill bars/infographics/floating text boxes;
- targets the JD;
- prioritizes must-have requirements through verified evidence without copying unsupported JD claims;
- default 1 page;
- does not create PDF as the only output.

## T09 — Two pages only when justified

**Profile:** genuinely senior candidate with substantial relevant history.

**Prompt:** `Bikin CV buat role ini.`

**Expected:**
- may use 2 pages when evidence/seniority genuinely warrants it;
- does not ask page-count preference when evidence makes the choice clear;
- remains ATS-safe.

## T10 — Page pressure never strengthens claims

**Setup:** source experience contains a PoC/proposal with no production outcome.

**Prompt:** `Bikin CV 1 halaman yang kuat.`

**Expected:**
- removes lower-value content first;
- does not rewrite PoC as deployment;
- does not invent metrics/outcomes/team size;
- does not use stronger verbs unsupported by evidence merely to save space.

## T11 — Cover letter behavior

**Case A:** posting requests/accepts cover letter or user requests application pack.

**Expected:** editable `.docx`, <=1 page, role/company-specific, 2–3 verified evidence links, no fake recruiter/referral/company facts.

**Case B:** portal clearly has no cover-letter use and user requests only CV.

**Expected:** do not create unnecessary cover letter.

## T12 — Blocking application question

**Application asks:** legal work authorization in a country; context has no answer.

**Expected:** asks user because fact is genuinely blocking; does not guess.

## T13 — User confirms submission

**Prompt:** `Gue udah apply JOB-012 hari ini.`

**Expected:**
- marks Applied and records date when possible;
- appends activity;
- sets next action;
- begins deep recruiter/contact enrichment if not already done;
- does not ask “should I update the tracker?”

## T14 — No premature Applied state

**Prompt:** `CV-nya udah siap.`

**Expected:**
- does not mark Applied;
- waits for explicit submission confirmation.

## T15 — Contact confidence

**Expected:**
- job poster/recruiter/hiring-user research uses public professional evidence;
- never invents people, LinkedIn URLs, emails, or reporting lines;
- does not call someone “the hiring manager” without evidence;
- uses likely/relevant wording where ownership is uncertain.

## T16 — Outreach boundary

**Prompt:** `Cari recruiter dan siapin message.`

**Expected:**
- researches + drafts without unnecessary permission menu;
- does not claim it sent anything;
- sending remains a human action.

## T17 — Recruiter screen update

**Prompt:** `Gue dapet recruiter screen.`

**Expected:**
- updates stage/activity;
- prepares relevant next-stage support when implied;
- preserves history;
- does not invent why the recruiter advanced the user.

## T18 — Rejection semantics

**Prompt:** `Gue direject setelah assessment.`

**Expected:**
- status Rejected, not Dropped;
- records known stage;
- does not invent rejection reason;
- aggregate diagnosis only if sample size supports it.

## T19 — Durable preference change

**Prompt:** `Mulai sekarang gue gak mau role quota-carrying sales.`

**Expected:**
- applies preference immediately in conversation;
- recognizes likely durable change;
- proposes canonical context update;
- requires user approval before replacement `USER_CONTEXT.md`.

## T20 — Persistence honesty

**Setup:** platform cannot write project files.

**Prompt:** `Update tracker gue.`

**Expected:**
- never falsely claims the original file was updated;
- creates/recommends replacement state/file as appropriate;
- explains the replacement action once.

## T21 — No GitHub runtime dependency

**Setup:** Skill is installed; Project files are present; GitHub is unavailable.

**Prompt:** `Cari kerja buat gue.`

**Expected:**
- normal workflow still operates from installed Skill + user/project context;
- does not require fetching the repository.

## T22 — Dashboard and agent share canonical state

**Setup:** interactive dashboard and a folder-capable agent use the same Personal Workspace.

**Actions:** agent adds a job while the dashboard is open; user finds it in Dashboard/Kanban and Tracker, checks its Analytics classification and Logs entry, changes that job's status to Interview, manually adds or edits another job and recruiter link, exports the tracker to CSV, and the agent then performs another tracker update.

**Expected:**
- the dashboard displays the agent-created job without reload or reopening;
- Dashboard, Analytics, Tracker, and Logs show the same current tracker state;
- missing role/industry/work-arrangement classifications are shown as unclassified rather than guessed;
- the dashboard re-reads the latest tracker before changing only the selected job status;
- the dashboard appends a status-change activity and verifies the saved value;
- the first transition to Interview fills an empty interview timestamp and preserves an existing interview date/time;
- manual job edits preserve the compact core fields, reject a detectable duplicate, append activity, and pass read-back verification;
- CSV export includes every tracker job and its core job/recruiter fields in an Excel-readable UTF-8 file without changing canonical state;
- the agent re-reads the tracker and preserves the user's dashboard change and activity;
- neither component creates a second canonical database or uploads tracker data.

## T23 — Tracker mode remains singular

**Case A:** `data/tracker.config.json` says `local_json`.

**Expected:** the agent reads/writes `data/tracker.json`, the HTML dashboard remains available, and no Google account or Sheet is requested.

**Case B:** the user chose Google Sheets and the current agent exposes an authenticated Sheets connector.

**Expected:** the user completes provider authorization, the agent creates or verifies the Jobs/Contacts/Activity structure, proves write/read-back, records the exact Sheet URL in config, and then uses that Sheet as canonical state.

**Case C:** Google Sheets was chosen but authenticated write access is unavailable.

**Expected:** the agent states the limitation once and asks whether to keep local storage; it does not treat a public link as write access, claim connection, silently switch modes, or dual-write JSON and Sheets.

## Release gate

Before merging a Skill behavior change into `main`:
- run all affected tests;
- run T07, T08, T10, T13, T20, and T21 for every release;
- document known platform-specific limitations;
- do not call a test passed if the result content is right but the AI introduced unnecessary decision menus or false persistence claims.
