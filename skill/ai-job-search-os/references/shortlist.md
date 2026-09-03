# Human Shortlist & Decision Reconciliation

## Goal

Convert the user's sorting decisions into correct tracker state without overgeneralizing preferences or creating unnecessary micro-confirmations.

## Decision authority

The user owns:
- PURSUE / APPLY intent;
- HOLD;
- DROP.

The AI recommendation never overrides an explicit user decision.

Never confuse:
- `Dropped` = user chose not to pursue;
- `Rejected` = employer/process rejected the user;
- `Closed` = opportunity became unavailable.

## Batch semantics

Reconcile the whole referenced batch when the user's wording clearly covers the remainder.

Examples:
- “A, C, and F gue pursue. Sisanya drop.” → pursue A/C/F; mark all other roles in that referenced batch Dropped.
- “Keep A and B, drop the rest.” → retain A/B; drop all remaining roles in the batch.
- “A gue pursue.” → pursue A only. Do NOT assume every unmentioned role is dropped.
- “Hold D.” → preserve D as non-terminal; if the tracker has no HOLD status, keep `Review` and record an explicit HOLD note/next action.

Do not ask the user to confirm each row individually when the batch instruction is unambiguous.

## Drop reason scope

Use the narrowest valid scope:
- posting;
- role;
- location;
- company;
- industry;
- temporary constraint.

Examples:
- drop because office is too far → location/posting constraint, not a company blacklist;
- drop because role carries sales quota → role/work-type signal, not necessarily anti-client-facing;
- drop because salary is temporarily too low → do not infer a permanent industry ban.

## Tracker updates

After an unambiguous human decision:
- update Jobs status/notes when technically possible;
- append meaningful Activity history;
- preserve the prior state;
- set next action for pursued/held roles;
- do not ask “Should I update the tracker?”

## Downstream work

Deep recruiter/contact enrichment should normally begin only for roles the user has chosen to pursue/apply, unless the user explicitly requests contact research earlier.

Do not automatically create an application document pack for every pursued role unless the user has actually asked to prepare/apply that specific role or the current request clearly implies immediate application preparation.

## Durable memory

Opportunity-specific decisions may inform `Decision Memory` when useful, but a single decision does not automatically rewrite durable identity/preferences.

If repeated decisions reveal a meaningful durable change, route to `persistence.md` for a proposed context update and human approval.

## Completion criteria

Shortlist reconciliation is complete when:
- each clearly covered role has the correct pursue/hold/drop state;
- reasons are scoped correctly;
- tracker/activity is updated when possible;
- pursued roles are ready for the next relevant workflow stage.

If the user has already said “I want to apply to JOB-X,” proceed to application preparation without asking whether they want to continue.
