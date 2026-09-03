# AI Job Search OS v1.6 — Skill-First Architecture

## Design goal

Move runtime behavior out of one monolithic system prompt and into an Agent Skill bundle while preserving the human-in-the-loop operating model.

## Layers

```text
GitHub repository
  development + distribution only
        |
        v
Installed Agent Skill (preferred runtime)
  HOW the AI operates
        |
        +--------------------------+
        |                          |
        v                          v
USER_CONTEXT.md              JOB_TRACKER.xlsx
WHO + WHY                    WHAT + NOW
        \                          /
         \                        /
          +---- sanitized CV -----+
                factual evidence
```

After installation, normal job-search use should not require repeated repository access.

## Canonical runtime

`skill/ai-job-search-os/SKILL.md`

The Skill entry point contains:
- purpose;
- global execution/autonomy rules;
- state detection;
- human checkpoints;
- workflow routing;
- universal truthfulness/privacy rules.

Detailed behavior is modularized under `references/`:

- `onboarding.md`
- `discovery.md`
- `shortlist.md`
- `application.md`
- `ats-documents.md`
- `contacts-outreach.md`
- `recruitment.md`
- `persistence.md`

The runtime should load the relevant module instead of treating every detailed procedure as always-active prose.

## Portable compatibility

When Agent Skills are not supported, use:

- `portable/SYSTEM.md`
- `portable/JOB_TRACKER.xlsx`
- sanitized user CV

Portable mode is a compatibility fallback, not the canonical source of future behavior changes.

## Repository instructions

- `AGENTS.md` tells development/coding agents how to modify the repository.
- `INSTALL.md` tells setup agents how to choose Skill-first vs Portable mode.
- `manifest.json` identifies canonical paths/version/runtime characteristics.
- `tests/BEHAVIOR_TESTS.md` defines behavioral release gates.

## Autonomy boundary

### AI executes without unnecessary permission menus

Reversible internal work:
- job discovery;
- freshness/official-source verification;
- fit review;
- duplicate/history checks;
- tracker maintenance when possible;
- application drafting;
- ATS document generation/QA;
- recruiter research at the correct stage;
- outreach drafting;
- interview/assessment prep;
- pipeline analysis.

### Human controls

Consequential decisions/actions:
- pursue/apply/hold/drop;
- actual application submission;
- sending messages/emails;
- sensitive personal/application data;
- offer decision;
- durable context updates.

## Application artifact contract

Default CV behavior:
- editable DOCX;
- ATS-safe;
- single column;
- early/mid-career default one page when evidence allows;
- two pages only when experience/seniority genuinely warrants it;
- no PDF-only default;
- no formatting choice menu when defaults already determine the result;
- no invented metrics/outcomes/experience to improve fit or page count.

## Update model

v1.6 initially uses a deterministic installed Skill snapshot.

Do not make GitHub HEAD a silent per-prompt runtime dependency.

A future update mechanism may be added only after platform-specific Skill update/sync behavior is tested. Repository version checks, if introduced, should be a distribution concern rather than a requirement for every job-search action.

## Release philosophy

Before v1.6 reaches `main`:
1. validate installation/import behavior in a clean supported environment;
2. run behavioral acceptance tests;
3. ensure portable fallback remains semantically aligned;
4. rebuild distribution artifacts;
5. update Pages/README to make Skill-first the recommended path;
6. keep Portable Mode clearly available for unsupported environments.
