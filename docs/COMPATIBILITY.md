# Capability-based compatibility

AI Job Search OS v1.7 prefers a local Personal Workspace. Product names are routing hints; observed capabilities determine the result.

| Observed environment | Setup path | Limit |
| --- | --- | --- |
| Codex with local-project access | Open extracted Personal Workspace as a local project | Recommended ChatGPT desktop route; availability depends on the account and app |
| Claude Code | Open the extracted Personal Workspace in its desktop interface or start it from that folder | Prefer the graphical route for nontechnical users |
| Antigravity IDE | Open the extracted Personal Workspace as the current folder/workspace | Recommended Google/Gemini route; reads the included local instructions |
| Cursor | File → Open Folder, then use Agent | Graphical fallback with direct local-file access |
| Optional Google Sheets tracker | Authenticated connector inside the local agent | Must prove create/read/write; public link alone is insufficient |
| Work, Cowork, cloud Projects, Sources, or chat attachments | Unsupported as the local-workspace runtime | No verified direct write-back to the workspace |
| Native Skill host without folder access | Exact-version Skill import | Persistent operational state may remain unavailable |
| Markdown chat only | Portable workflow | User must retain replacement state; no automatic local persistence |

The local agent must prove write access by creating and reading back `data/SETUP_STATUS.json`, then verify the one tracker mode recorded in `data/tracker.config.json`. Browsing, Google Sheets access, and DOCX generation remain separate capabilities. A connected folder does not grant permission to submit applications, send outreach, handle credentials, use Git, or publish files.

No named host is certified by documentation review. Run the setup acceptance scenarios and fresh-session recovery test, then record observed evidence in `VALIDATION.md`.
