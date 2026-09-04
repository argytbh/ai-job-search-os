# Security & Privacy

AI Job Search OS distributes a chat Migration Coach, a private local Personal Workspace, an instruction-only Skill, and a portable fallback. It requires no repository credentials or telemetry.

## Files

- `MULAI_DI_SINI.md` guides the user's current chat toward an official folder-capable desktop agent.
- The Personal Workspace stores canonical operational state in `data/tracker.json`.
- `PORTABLE_WORKFLOW.md` remains a limited-persistence fallback.
- The workspace contains no `.git`, GitHub remote, executable application, credential, or maintainer script.
- Workspace instructions prohibit Git initialization, remotes, pushes, publishing, and personal-data uploads.

Users are encouraged to inspect the repository and verify SHA-256 checksums before use.

Checksums detect file mismatches; they do not independently authenticate a publisher. Development packages may refer to an unpublished tag. Do not replace a missing release with source code, another branch, clone, or fork. Maintainer Python scripts are excluded from the Personal Workspace.

## Sensitive information

Use a sanitized CV copy and avoid storing unnecessary personal identifiers.

Never place the following in the workspace or job-search memory:

- passwords;
- OTPs;
- bank/account information;
- national ID numbers;
- passport numbers;
- tax identification numbers;
- employer-portal credentials.

Sensitive application data should be entered directly on the employer's official application site.

## Public professional data

Recruiter and hiring-user enrichment should use legitimate public professional information. The system must not invent identities, LinkedIn URLs, email addresses, or reporting lines.

## Reporting issues

If you find a security or privacy problem, please open a GitHub issue describing the concern without including sensitive personal data.
