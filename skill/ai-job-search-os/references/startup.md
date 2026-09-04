# Startup & Session Recovery

Use after setup and at the start of a new session. In Portable Mode every workflow reference is embedded in PORTABLE_WORKFLOW.md; use those sections without fetching separate files.

## Inspect before resuming

1. Identify the usable runtime: the Skill bundled in a verified Personal Workspace, a host-discoverable installed Skill, or a complete readable portable workflow. Loading a document does not prove native installation or local-folder access.
2. Locate accessible `profile/USER_CONTEXT.md`, sanitized CV, `data/tracker.config.json`, and the configured tracker. Check the selected workspace before asking for uploads. Never treat a known but inaccessible file as permanently missing.
3. Use approved context immediately. Do not repeat onboarding because the chat or runtime mode changed. If approval is unclear, confirm the existing profile rather than rebuilding it.
4. Honor the configured `local_json` or `google_sheets` tracker mode. Prefer the latest user-confirmed canonical tracker. If copies conflict and authority is unclear, ask which is current before writing. Never choose a blank template over history or dual-write conflicting stores.
5. Establish actual web, document, spreadsheet, and persistence capabilities. Recheck only when a task needs a capability that remains uncertain.

If no readable runtime is available, return to setup; do not invent missing procedures. If a requested file is inaccessible, ask for it once and continue independent work where possible.

## Capability fallbacks

| Missing capability | Continue with |
| --- | --- |
| Native Skill installation | Complete portable workflow; call this Portable Mode |
| Web browsing | User-provided JD/company text; freshness remains unverified; do not invent jobs or live contacts |
| DOCX creation | Editable single-column text and a clear limitation; no claimed attachment or silent PDF substitution |
| Local workspace unavailable | Chat-only portable mode with user-retained replacement files; automatic local persistence remains unavailable |
| JSON editing unavailable | Updated structured data and a clear save/import limitation; do not claim the tracker was changed directly |
| Persistent writes | Replacement files when possible, otherwise copyable content; user saves/replaces project sources |
| Persistent project context | User retains workflow, approved context, and latest tracker and supplies them in a new session |

Tell the user only the limitation affecting the current action, not a capability questionnaire.

## Persistence handoff

When local workspace writes are available, save only inside the authorized Personal Workspace and verify files can be read back. Never initialize Git or publish personal files. Otherwise provide replacement artifacts/content and state the save/upload action. A generated attachment is not necessarily persisted state.

After approved onboarding, USER_CONTEXT.md may include a small `Workflow Setup` section with observed mode, workflow version (or unknown), and where the latest tracker/context are kept. Use names or project-relative locations, not credentials or unnecessary personal paths. Future-session availability stays unverified until observed. Show this section with the context for approval; do not silently add it to an existing approved file.

No extra setup-state file is required. Host discovery and accessible approved files determine state; a note saying "installed" is only a hint.

## Completion and recovery

- Setup-ready means a usable runtime is loaded; onboarding may still be pending.
- Onboarding-approved means the profile was approved; a generated file may still need saving to Project sources.
- Ready to resume across chats requires accessible approved context and latest operational state, plus an available Skill or portable workflow.

Resume from observed state. Preserve Job IDs and Activity history. Switching runtime modes changes how instructions load, not identity or application status. Do not auto-update from GitHub, reinstall working Skills, or reset records on startup.
