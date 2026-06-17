@'
# AGENTS.md

## Project

This repository contains a tablet-first Preteen category challenge game.

## Primary specification

Before making changes, read:

- docs/specs/preteen-game-mvp-spec.md

The specification is the source of truth for the MVP.

## MVP restrictions

Do not add any of the following unless explicitly requested:

- Supabase
- External database
- Admin dashboard
- Authentication
- User accounts
- Scoring system
- Analytics
- External APIs

Use a local TypeScript question bank for the MVP.

## Development requirements

- Use React, TypeScript and Vite.
- Design primarily for landscape tablets.
- Keep the interface in Traditional Chinese.
- Keep components reasonably separated.
- Avoid unnecessary dependencies.
- Preserve accessibility and large touch targets.
- Game questions must not repeat within the same game session.
- Refreshing the page must preserve the current question and timer state.
- Closing the browser may clear the current session.
- The game should remain playable offline after the initial load.

## Verification

After every code change:

1. Run the relevant tests.
2. Run:

   npm run build

3. Fix all TypeScript and build errors.
4. Create a review file under:

   docs/review/

The review file must include:

- Summary
- Files changed
- Features implemented
- Test results
- Build result
- Known limitations
- Manual testing steps

Print the exact review file path in the final response.

## Git safety

- Do not commit directly to main unless instructed.
- Create a focused feature branch.
- Do not overwrite unrelated user changes.
- Do not add secrets or environment files.
'@ | Set-Content -Encoding UTF8 AGENTS.md