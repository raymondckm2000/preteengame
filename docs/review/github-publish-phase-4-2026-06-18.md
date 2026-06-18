# GitHub Publish Phase 4 Review

## Summary

Connected the protected admin publish endpoint to GitHub Contents API so validated question bank changes can be committed to `src/data/game-data.json` in the repository.

This phase still does not add a database, Supabase, multi-user accounts, analytics, or external admin dashboard.

## Files changed

- `api/admin/publish.ts`
- `docs/review/github-publish-phase-4-2026-06-18.md`

## Features implemented

- `POST /api/admin/publish` now:
  - requires a valid admin session cookie
  - validates the submitted game data server-side
  - reads `src/data/game-data.json` from GitHub Contents API
  - obtains the current file SHA before update
  - writes the formatted JSON question bank back to GitHub
  - commits with message `chore: update preteen game question bank`
  - returns publish metadata including branch, path, commit SHA, commit URL, and content SHA
- Keeps the Phase 3 server-side validation before any GitHub write.
- Uses Vercel environment variables instead of committed secrets.
- Does not expose the GitHub token to the browser.

## Required environment variables

Set these in Vercel for Preview and Production:

```text
GITHUB_TOKEN
GITHUB_OWNER
GITHUB_REPO
GITHUB_BRANCH
```

Expected values for this project:

```text
GITHUB_OWNER=raymondckm2000
GITHUB_REPO=preteengame
GITHUB_BRANCH=main
```

`GITHUB_TOKEN` should be a fine-grained GitHub Personal Access Token with access only to this repository and permission:

```text
Contents: Read and write
```

Do not commit the token to Git.

## Test results

Pending local verification:

```text
npm run lint
npm run build
```

## Deployment test plan

1. Confirm all required Vercel environment variables exist for Preview.
2. Deploy this branch to Vercel Preview.
3. Open `/admin` and log in.
4. Make a small safe test change, such as adding one clearly marked test question.
5. Click Publish.
6. Confirm the response shows success instead of the Phase 3 message.
7. Confirm GitHub receives a new commit on `main` with message `chore: update preteen game question bank`.
8. Confirm `src/data/game-data.json` contains the new question.
9. Confirm Vercel Production redeploys from the new GitHub commit.
10. Confirm the game loads the updated question bank after deploy.
11. Optionally revert or remove the test question through the admin page and publish again.

## Known limitations

- Publishing commits directly to `main` as configured by `GITHUB_BRANCH`.
- No draft/pending review workflow yet.
- No optimistic concurrency UI; GitHub SHA protection is handled server-side by reading the latest SHA before update.
- No rate limiting or audit log beyond GitHub commit history and Vercel logs.
- The admin page still uses browser memory for edits until Publish is clicked.
