# Admin API Phase 3 Review

## Summary

Added Vercel serverless API endpoints for admin login, logout, protected game-data loading, and a protected publish validation stub. The admin UI now uses a signed HttpOnly session cookie instead of the Phase 2 password check in browser code.

This phase does not connect to GitHub Contents API and does not update `src/data/game-data.json`.

## Files changed

- `api/_lib/auth.ts`
- `api/_lib/gameData.ts`
- `api/_lib/http.ts`
- `api/admin/login.ts`
- `api/admin/logout.ts`
- `api/admin/game-data.ts`
- `api/admin/publish.ts`
- `src/pages/AdminPage.tsx`
- `eslint.config.js`
- `tsconfig.node.json`
- `docs/review/admin-api-phase-3-2026-06-18.md`

## Features implemented

- `POST /api/admin/login`
  - validates the submitted password on the server
  - compares SHA-256 hashes with timing-safe comparison
  - creates a signed HttpOnly session cookie
- `POST /api/admin/logout`
  - clears the session cookie
- `GET /api/admin/game-data`
  - requires a valid signed session cookie
  - returns the bundled JSON question bank
- `POST /api/admin/publish`
  - requires a valid signed session cookie
  - validates the submitted game data on the server
  - intentionally returns `501 PHASE_4_REQUIRED` without writing to GitHub
- Session cookie properties:
  - HttpOnly
  - SameSite=Strict
  - Secure on Vercel
  - no Max-Age, so it is a browser-session cookie
- Admin UI changes:
  - checks the existing server session on page load
  - logs in through the API
  - logs out through the API
  - loads the server-provided JSON data after authentication
  - adds a Phase 3 publish button that displays the Phase 4-required response
- API files are included in TypeScript build checking and Node-specific ESLint configuration.

## Required environment variables

Set these in Vercel for Preview and Production as required:

```text
ADMIN_PASSWORD_HASH
SESSION_SECRET
```

`ADMIN_PASSWORD_HASH` must be the lowercase SHA-256 hexadecimal hash of the chosen admin password. The optional `sha256:` prefix is accepted.

Example PowerShell command to generate the hash locally:

```powershell
$password = "replace-with-your-password"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$hash = [System.Security.Cryptography.SHA256]::HashData($bytes)
[System.Convert]::ToHexString($hash).ToLower()
```

Generate a long random `SESSION_SECRET`; do not commit either value to Git.

## Test results

Pending local verification:

```text
npm run lint
npm run build
```

For API testing, use a Vercel Preview deployment or `vercel dev`. Plain `npm run dev` only starts Vite and does not provide the `/api/admin/*` functions.

## Build result

Pending local verification.

## Known limitations

- The publish endpoint validates data but deliberately does not persist it.
- GitHub token, owner, repository, and branch settings are not used until Phase 4.
- Password hashing uses a pre-generated SHA-256 hash. This is appropriate for the agreed single fixed admin password flow, but it is not a general multi-user password storage system.
- There is no rate limiting or failed-login lockout, matching the agreed unlimited retry requirement.
- The session has no idle timeout and ends when the browser session cookie is discarded or logout is used.

## Manual testing steps

1. Configure `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` in the Vercel Preview environment.
2. Deploy the Phase 3 branch.
3. Open `/admin` and confirm the login screen appears.
4. Enter an incorrect password and confirm the API returns a login error.
5. Enter the correct password and confirm the admin question bank loads.
6. Refresh `/admin` and confirm the HttpOnly session keeps the user logged in during the browser session.
7. Log out and confirm protected game data can no longer be loaded.
8. Open `/api/admin/game-data` without a session and confirm it returns HTTP 401.
9. Add or edit local admin data and click Publish.
10. Confirm valid data returns the Phase 4-required message and does not change repository JSON.
11. Make a question blank and click Publish; confirm server-side validation rejects it.
12. Confirm normal game routes, timer, sessionStorage, PWA, and offline game behaviour remain unchanged.
