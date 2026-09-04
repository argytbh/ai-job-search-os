# AI Job Search OS v1.7.0 — development draft

v1.7.0 adds a local-first interactive Job Desk for people who want to see and update their pipeline without repeatedly prompting the agent.

During the friendly chat-led setup, users can keep the default local JSON + HTML dashboard without connecting Google, or optionally choose a user-owned Google Sheet for cross-device access. Google authorization happens only in a capable local agent through the provider's official UI. The modes are alternatives, and the workspace records one verified canonical tracker.

The setup chat presents the complete matching route in clearly labeled sections. It groups the minimum questions and pauses only when the user must choose, authorize an external account, or confirm an interface result.

## What changes

- Open `BUKA_DASHBOARD.html` from the Personal Workspace.
- In a current Chrome or Edge browser, select the Personal Workspace folder and approve local read/write access.
- New or changed jobs appear automatically while the dashboard remains open, normally within about 1.5 seconds.
- Use the left navigation to open Dashboard/Kanban, Analytics, Tracker/table, or activity Logs.
- Search and filter the Tracker, inspect job/recruiter links, change status inline, add or edit a lowongan manually, and export all jobs to an Excel-readable CSV.
- Review pipeline and work-arrangement composition in donut charts plus role, industry, location, source, and active-job age comparisons in ranked bars.
- In local mode, dashboard status changes update the canonical `data/tracker.json` and append an activity record, so the agent sees the same state. The first change to Interview also timestamps an empty interview field without overwriting a date/time that is already known.
- Onboarding uses a bounded set of focused questions, while application preparation saves truthful tailored documents per Job ID, verifies the files, and records preparation without claiming submission.

## Data boundary

The hosted page contains the interface only. It does not upload the tracker, create an account, or use a cloud database. In local mode, browser permission applies only to the folder the user chooses and the tracker remains on that computer. If the user explicitly chooses Google Sheets, tracker data lives in the user's own Google account and the dashboard routes them to that verified Sheet.

## Compatibility

The direct local-folder workflow targets current desktop Chrome and Edge. Other browsers show an unsupported-browser message when the required File System Access API is unavailable. Browser permission may need to be granted again in a later session.

This document is a development draft until S19 and T22 have been exercised in a real supported browser and the v1.7.0 release is published.
