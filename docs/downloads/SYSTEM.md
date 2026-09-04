# AI JOB SEARCH OS — SYSTEM / SETUP

> Generated from INSTALL.md and manifest.json. Upload this file and say 'Start AI Job Search OS'.

## Distribution

- Version: 1.7.0
- Repository: https://github.com/argytbh/ai-job-search-os
- Exact source ref: v1.7.0
- Manifest: https://raw.githubusercontent.com/argytbh/ai-job-search-os/v1.7.0/manifest.json
- Skill entry: https://raw.githubusercontent.com/argytbh/ai-job-search-os/v1.7.0/skill/ai-job-search-os/SKILL.md
- Portable fallback: https://raw.githubusercontent.com/argytbh/ai-job-search-os/v1.7.0/portable/PORTABLE_WORKFLOW.md
- Same-ZIP fallback: PORTABLE_WORKFLOW.md
- Same-ZIP bundle: skill/ai-job-search-os/ (version in manifest.json)
- Native import archive: AI-Job-Search-OS-Skill-v1.7.0.zip
- The exact ref may be unavailable for an unpublished development package. Use the matching bundled files; never switch to HEAD.

# AI Job Search OS — compatibility setup for chat-only hosts

The recommended v1.6 runtime is the **Personal Workspace** opened in a local AI agent. New users should start by uploading `MULAI_DI_SINI.md` to their current AI chat; its Migration Coach guides them to Codex, Claude Code, Antigravity IDE, Cursor, or another folder-capable agent.

This file remains the compatibility bootstrap behind `SYSTEM.md` for users who cannot use a local agent. Reply in the user's language and do not require GitHub or command-line knowledge.

## 1. Prefer an existing Personal Workspace

If the AI can access a folder containing `AGENTS.md`, `VERSION`, `system/ai-job-search-os/`, and `data/tracker.json`:

1. follow the workspace `AGENTS.md`;
2. read the bundled Skill and startup reference;
3. verify a write by creating and reading back `data/SETUP_STATUS.json`;
4. reuse approved context and current tracker state;
5. never initialize Git, add a remote, push, publish, or upload personal files.

Do not install another copy of the Skill when the complete bundled runtime is readable.

## 2. Native Skill compatibility

When no Personal Workspace exists but the host has a documented native Skill installer, obtain the complete exact-version Skill bundle identified in the generated Distribution section. Verify registration, routed resources, version, and invocation before saying installed. A download or folder is not installation evidence.

Never silently substitute `main`, `HEAD`, or another version. Do not mix files across releases. Follow required human confirmation and do not retry denied installation.

## 3. Portable chat mode

When neither a local folder nor native Skill is available, use the matching `PORTABLE_WORKFLOW.md`. This mode can run the workflow in conversation, but automatic local persistence is unavailable.

- Ask for the complete portable file only when it is not already readable.
- Preserve any approved `USER_CONTEXT.md` and latest tracker supplied by the user.
- Never claim generated attachments replaced persistent project sources.
- When state must persist, return complete replacement structured data and one clear save/upload action.
- If context capacity is insufficient, explain the blocker instead of starting with partial instructions.

## 4. Runtime handoff

Read the startup reference, then:

- approved context accessible: continue the requested workflow;
- no approved context: onboard using a sanitized CV and require approval before durable profile creation;
- known state inaccessible: request the latest copy once rather than resetting history.

Browsing, document generation, and storage are independent capabilities. Without web access, work from user-provided job descriptions and label freshness unverified. Applications, messages, sensitive data entry, and offers remain controlled by the user.

## Privacy

Never request passwords, OTPs, identity numbers, banking data, or employer-portal credentials. Never send a CV, context, tracker, or application history to the public repository. GitHub is distribution infrastructure, not a personal-data store.
