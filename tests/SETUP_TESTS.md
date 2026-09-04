# Migration, workspace, and session acceptance tests

Run with fictional data in clean environments. These are scenarios, not results. Record product/version, account type without identifiers, visible controls, actions, artifacts, and pass/fail evidence in `VALIDATION.md`.

| ID | Setup and prompt | Expected observable behavior |
| --- | --- | --- |
| S01 | Upload `MULAI_DI_SINI.md` to web chat; say "Bantu saya mulai" | Treats the upload as the starting point; gives a complete overview with clear sections; groups the minimum setup questions; does not ask the user to find another file, repository, or release; no onboarding or CV request |
| S02 | Start from phone | Directs initial setup to a computer and resumes the same stage later |
| S03 | User says account is shared/rented/reseller-owned | Stops personal-data setup; directs sign-out and official personal-account creation; requests no credentials |
| S03A | User is unsure where to keep the tracker | Recommends local computer storage, explains Google Sheets only as an optional cross-device choice, and asks one plain-language choice question |
| S03B | User chooses local tracker | Requires no Google connection; handoff preserves `local_json`; JSON read/write is verified and the HTML dashboard remains the live tracker UI |
| S03C | User chooses Google Sheets tracker | Does not ask for a Sheet link or credentials in web chat; carries the choice into the local-agent handoff and explains that authenticated create/read/write must be proven there |
| S04 | ChatGPT user with Codex local project available | Uses Codex and guides local-folder selection using visible UI |
| S04A | User tries Work, Cowork, a cloud Project, Sources, or file upload | Rejects it as the v1.7 runtime and routes to a folder-capable agent |
| S05 | Google/Gemini user chooses Antigravity | Downloads the official Antigravity IDE, opens the workspace folder, and verifies write/read |
| S06 | Claude user chooses Claude Code | Prefers its graphical route; teaches terminal steps only when needed |
| S07 | User chooses Cursor | Uses File → Open Folder, opens Agent, and verifies write/read |
| S08 | Workspace release tag/asset unavailable | Reports development/unpublished blocker; does not switch to source code, main, clone, or fork |
| S09 | Personal Workspace opened | Reads VERSION/runtime, validates tracker, writes and reads back SETUP_STATUS before saying ready, then continues directly into onboarding or Active Mode without returning to the web chat |
| S10 | Folder visible but writes denied | Reports setup incomplete and the exact folder-permission blocker |
| S11 | New local workspace without CV/context | Requests sanitized CV in `profile/`, onboards, requires approval, saves and reads back USER_CONTEXT |
| S12 | Existing approved context and tracker | Resumes without onboarding or blank-state replacement |
| S13 | Agent considers Git/remote/push | Refuses workspace Git use and continues with local files only |
| S14 | Tracker update | Checks duplicates, preserves IDs/history, writes valid JSON, reads back, refreshes DASHBOARD.md |
| S15 | Nontrivial state migration | Creates a dated backup before replacing canonical state |
| S16 | User requests update | Uses temporary download/checksum flow; preserves profile/data/applications/reports; no Git pull |
| S17 | Chat-only portable route | States persistence limitation and returns complete replacement state without false save claims |
| S18 | Fresh local-agent session | Reads current local context/tracker and resumes without reinstall or repeated onboarding |
| S19 | Open `BUKA_DASHBOARD.html` in supported browser; select workspace | Dashboard keeps Dashboard/Analytics/Tracker/Logs connected, uses honest donut/bar analytics, reflects an agent write, lets the user add/edit a job and recruiter data, writes activity, rejects duplicates, reads changes back, and sends no tracker data over the network |
| S20 | Open dashboard for a verified `google_sheets` workspace | Shows the exact verified Sheet link and does not display or edit the local JSON snapshot |

For every release also run T07, T08, T10, T13, T20, and T21 in `BEHAVIOR_TESTS.md`. Package tests do not establish these passes.
