# Onboarding Workflow

## Goal

Create accurate, human-approved durable career context without assuming the user's past CV defines their future direction.

## Mode trigger

Use this workflow when approved `USER_CONTEXT.md` is absent or the user explicitly asks to rebuild their durable career context.

## Inputs

Required:
- sanitized latest CV if available.

Optional:
- prior tracker history;
- user-supplied portfolio/project evidence;
- explicit career constraints.

If no CV is available, ask for a sanitized latest CV. This is a blocking input.

## Interview behavior

Use the CV only as factual career history. Interview conversationally and adaptively; do not send a long questionnaire.

Learn enough to establish:
- current professional positioning;
- verified career history;
- strengths;
- preferred work;
- work to avoid;
- target roles: Priority / Conditional / Avoid;
- employer and sector preferences;
- geography and practical constraints;
- desired career capital;
- strongest verified experience/project evidence;
- explicit durable constraints.

Compensation and availability are optional unless relevant.

Do not infer a future career goal solely from previous job titles.

## Approval checkpoint

When enough information exists:
1. present a concise proposed understanding;
2. separate facts, preferences, and constraints;
3. label uncertain interpretations;
4. ask the user to correct inaccuracies;
5. revise until the user explicitly approves.

This approval is consequential and must not be skipped.

Do not create canonical persistent context before approval.

## Output after approval

Generate an editable Markdown file named exactly:

`profile/USER_CONTEXT.md` in a Personal Workspace, otherwise `USER_CONTEXT.md` for portable mode.

Use:

```markdown
---
system: AI_JOB_SEARCH_OS
context_version: 1
user_approved: true
---

# USER CONTEXT

## Professional Positioning
## Career Objective
## Verified Career History
## Strengths
## Preferred Work
## Work To Avoid
## Target Roles
### Priority
### Conditional
### Avoid
## Employer & Sector Preferences
## Geography & Practical Constraints
## Career Capital Goal
## Experience Evidence
### E01 — [name]
- Context
- Verified facts
- What the user did
- Tools/methods
- Safe competency signals
- Verified outcome
- Do not claim
## Durable Constraints
## Decision Memory
## Workflow Setup
<!-- Observed mode/version and where current files are kept; no credentials. -->
```

Keep it concise. Preserve conclusions and evidence, not the onboarding transcript.

In a verified Personal Workspace, save the approved file directly under `profile/`, read it back, and do not ask the user to re-upload it. In portable mode, tell the user to add `USER_CONTEXT.md` to the same persistent Project/workspace context.

Follow `startup.md` for persistence. If authorized direct project writes are available, save and verify instead of asking for re-upload. Otherwise distinguish generated output from a saved Project source. Do not claim cross-session readiness until the context is accessible there.

## Completion criteria

Onboarding approval is complete when:
- the user's durable profile has been explicitly approved;
- `USER_CONTEXT.md` has been generated;
- the context has been saved and read back when authorized persistent writes are available, or the user has been told the single save/upload action still required.

If saving is pending, state that explicitly; approval alone is not evidence of cross-session readiness.

Do not immediately start personalized job discovery before the durable context is available unless the user explicitly asks to continue temporarily with the approved in-conversation context.
