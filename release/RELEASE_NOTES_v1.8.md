# AI Job Search OS v1.8.0

v1.8.0 makes the Personal Workspace easier to understand and gives each user an editable copy of the local dashboard.

The public landing page now begins with common job-search friction, explains setup in plain language, and ends with the developer's purpose: helping people use AI as a thoughtful, creative, and systematic tool while keeping human judgment in control.

## What changes

- The Personal Workspace now includes the dashboard's HTML, CSS, and JavaScript under `dashboard/`.
- `BUKA_DASHBOARD.html` opens that bundled local dashboard; the public GitHub Pages dashboard remains available as a preview.
- Users can ask their folder-capable agent to change colors, simplify layouts, add filters or evidence-grounded charts, and reorganize views.
- The agent edits the existing static files directly and preserves the current tracker, Job IDs, activity history, concurrent-write protection, and read-back verification.
- Ordinary dashboard customization must not introduce a backend, database, account, framework, build system, package manager, hosting, deployment, or DevOps workflow.
- The landing page uses cookie-free aggregate Cloudflare Web Analytics. The local dashboard and Personal Workspace remain outside analytics.

## Data boundary

The local dashboard keeps `connect-src 'none'` and accesses the selected folder only after explicit browser permission. In `local_json` mode, `data/tracker.json` remains the only canonical operational state. Google Sheets remains an optional alternative tracker chosen and authorized by the user; the two stores are never maintained as simultaneous databases.

## Compatibility

The dashboard targets current desktop Chrome and Edge. Automated package, distribution, CSP, and JavaScript checks pass. Fresh manual acceptance from an extracted v1.8.0 Personal Workspace and live customization runs on each named agent remain pending and are recorded in `VALIDATION.md`; static checks do not certify host behavior.
