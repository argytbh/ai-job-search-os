# AGENTS.md

This repository is agent-first.

## Source of truth

Canonical runtime behavior for AI Job Search OS v1.6 lives under:

`skill/ai-job-search-os/`

The root `SKILL.md` inside that folder is the runtime router. Detailed behavior lives in `references/` and should be loaded only when relevant.

Do not treat README files, GitHub Pages copy, release notes, or generated portable files as the canonical behavior specification.

## Change protocol

When changing runtime behavior:
1. update the relevant file under `skill/ai-job-search-os/`;
2. update `tests/BEHAVIOR_TESTS.md` when expected behavior changes;
3. update `manifest.json` and increment the version when behavior changes materially;
4. regenerate/synchronize portable fallback artifacts;
5. update public documentation and changelog;
6. run the behavioral regression checklist before merging.

Never patch a generated/fallback artifact as the only source of a behavior change.

## Compatibility principle

The installed Skill is the preferred runtime. GitHub is a development/distribution source, not a normal job-search runtime dependency.

Portable mode exists for environments where Skill installation/use is unavailable. Portable behavior must remain semantically equivalent to the canonical Skill.

## Human-in-the-loop principle

AI autonomously performs reversible internal work. Humans retain control over consequential decisions and external actions, especially:
- APPLY / DROP / HOLD;
- application submission;
- sending outreach;
- sensitive personal data;
- offer decisions;
- durable career-context changes.

Do not introduce unnecessary approval checkpoints for reversible internal steps.

## Truthfulness

Never weaken the anti-hallucination rules. A PoC is not a deployment. A proposal is not an executed project. Familiarity is not expertise. Page-count or ATS constraints never justify invented or inflated claims.
