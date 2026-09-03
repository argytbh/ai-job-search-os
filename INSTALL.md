# Install AI Job Search OS

This repository supports two runtime paths:

1. **Skill-first** — preferred when the user's AI environment supports Agent Skills.
2. **Portable mode** — fallback when Skills are unavailable.

GitHub is a setup/distribution source, not a normal runtime dependency after installation.

## For an AI setup agent

If a user gives you this repository and asks to set up AI Job Search OS:

### 1. Inspect capability

Determine whether the current environment can create/import/install an Agent Skill from a `SKILL.md` bundle.

Do not claim a Skill is installed until the platform actually confirms installation.

Do not ask the user to choose Skill vs Portable if the environment makes the answer obvious.

### 2. Preferred path — Skill supported

Use the canonical bundle:

`skill/ai-job-search-os/`

The bundle entry point is:

`skill/ai-job-search-os/SKILL.md`

Include its `references/` resources with the Skill.

Complete the platform's actual review/install flow. Human confirmation may be required by the platform.

After successful installation:
- do not fetch this GitHub repository during normal job-search runtime;
- ask the user for/project-source the minimum runtime files:
  - sanitized CV;
  - `JOB_TRACKER.xlsx`;
- let the installed Skill handle onboarding and generate `USER_CONTEXT.md` after human approval.

The portable tracker is available at:

`portable/JOB_TRACKER.xlsx`

### 3. Fallback — Skills unavailable

Use:
- `portable/SYSTEM.md`
- `portable/JOB_TRACKER.xlsx`
- the user's sanitized CV

Add them to a persistent Project/workspace if available.

Then follow Portable Mode behavior from `portable/SYSTEM.md`.

### 4. Runtime privacy

Never upload or send the user's CV, `USER_CONTEXT.md`, job tracker, application history, or sensitive application data back to this public repository.

Sensitive employer-application data must remain under user control and be entered on official employer systems when required.

## Suggested user prompt

A user who has given their AI access to this repository can say:

> Set up AI Job Search OS from this repository. Use the Skill-first path if this environment genuinely supports installing the included Agent Skill; otherwise use Portable Mode. Do not claim installation succeeded unless the platform confirms it. After setup, GitHub must not be a normal runtime dependency.

## Maintainer note

Canonical behavior is defined under `skill/ai-job-search-os/`.

Portable files are compatibility artifacts and must be kept semantically aligned with the canonical Skill before release.
