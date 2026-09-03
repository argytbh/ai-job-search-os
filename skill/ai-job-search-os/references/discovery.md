# Job Discovery & Fit Review

## Goal

Return a decision-ready set of relevant, sufficiently verified opportunities for human sorting. Optimize for useful recall without filling the tracker with obvious noise.

## Discovery workflow

When the user asks to find jobs:
1. read approved user context and durable constraints;
2. read tracker history to avoid duplicates and repeated rejected/dropped postings;
3. search broadly enough to produce useful recall;
4. eliminate obvious hard-constraint violations and irrelevant noise;
5. prefer current opportunities;
6. verify important opportunities on the employer's official career site when possible;
7. map JD requirements to verified user evidence;
8. identify real gaps;
9. score/review fit;
10. return a compact shortlist ready for the user to sort.

Do not perform expensive deep recruiter/contact enrichment for every discovered role before the user shows intent to pursue it.

## User-supplied links

A user-pasted link is a first-class discovery source.

Automatically:
1. identify the source;
2. check whether it appears live/current;
3. look for the official employer posting;
4. review fit;
5. check duplicate/history;
6. add/update a viable opportunity in the tracker when persistence is available.

The user should not need to ask separately for verification, fit review, or duplicate checking.

## Stale / closed / inaccessible postings

If a LinkedIn or job-board result is stale, missing, inaccessible, or closed:
1. search the employer's official careers site for the same role/requisition;
2. if unavailable, search the same employer for plausible live equal-or-better alternatives;
3. label alternatives clearly;
4. never present the original role as confirmed live;
5. never silently replace the original role with a different role.

## Default fit score

Unless the user has approved another framework:
- Core work match: 30
- Verified evidence match: 25
- Seniority plausibility: 15
- Company / career capital: 15
- Domain / tools: 10
- Practical fit: 5

Default interpretation:
- 80–100: Priority Apply
- 70–79: Apply
- 60–69: Conditional
- below 60: Usually Drop

Hard constraints override numerical scores.

## Compact review output

For each surfaced role, prioritize:
- Company + role
- Verified/live status and official link when available
- Verdict + score
- Why it fits
- Material gaps
- Strongest evidence to use
- Duplicate/prior-decision note if relevant

Avoid verbose generic JD summaries.

## Tracker behavior

Discovery may create/update candidate opportunity rows when technically possible, but the user still owns PURSUE / HOLD / DROP.

Do not mark a job Applied during discovery.

## Completion criteria

A discovery batch is complete when the returned roles are:
- relevant enough for human review;
- sufficiently deduplicated;
- freshness-checked where practical;
- fit-reviewed;
- ready for a human shortlist decision.

The next human action is to sort the returned roles. Do not ask whether to run the standard discovery substeps that have already been completed.
