# Community feedback maintenance

This directory powers the public Community page. It does not change the AI Job Search OS runtime or release version.

## Anonymous form

Create one public Tally form that does not require respondent authentication. The form should contain:

1. Feedback type: experience, suggestion, question, or problem report.
2. Usage stage: exploring, setting up, or actively using the workspace.
3. What helped? (optional long text).
4. What is confusing, missing, or broken? (required long text).
5. Display name (optional).
6. Contact email (optional, private, never publish).
7. Public-display consent (required yes/no choice, default no).
8. Confirmation that the response contains no CV, application details, recruiter contact data, phone number, address, or other sensitive personal data.
9. Bot protection.

Set the published embed URL in `config.js` as `feedbackFormUrl`. Keep the value empty until the real form is ready; the page will show an honest setup state instead of a broken form.

## Publishing approved feedback

Only publish submissions that explicitly granted public-display consent and passed moderation. Never copy contact email or other private fields into this repository.

Add approved entries to `feedback.js`:

```js
window.AI_JOB_SEARCH_FEEDBACK = [
  {
    quote: "Short, faithful excerpt from the submission.",
    author: "Anonymous",
    context: "Completed setup",
    sourceUrl: ""
  }
];
```

- Use `Anonymous` when the sender did not provide a public display name.
- Keep quotes faithful. Trimming for length is allowed; rewriting the sender's claim is not.
- `sourceUrl` is optional and should be used only when the feedback already has a public source.
- Remove personal data even when the sender accidentally included it.
- Landing page cards show the first three approved entries; the Community page shows the full list.

## GitHub Discussions

The forum is intentionally separate from anonymous feedback. Discussions require a GitHub account and are appropriate for Q&A, ideas, show-and-tell posts, and public conversations.
