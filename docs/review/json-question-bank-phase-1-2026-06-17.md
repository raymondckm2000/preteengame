# JSON Question Bank Phase 1 Review

## Summary

Migrated the existing local TypeScript category and question records to `src/data/game-data.json` while preserving the existing exported data interfaces used by the game.

No admin dashboard, authentication, database, Supabase integration, GitHub API integration, Vercel Function, scoring, analytics, or external API was added.

## Files changed

- `src/data/game-data.json`
- `src/data/gameData.ts`
- `src/data/categories.ts`
- `src/data/questions.ts`
- `src/types/game.ts`
- `docs/review/json-question-bank-phase-1-2026-06-17.md`

## Features implemented

- Added one JSON source for all five existing categories and all 30 existing questions.
- Preserved all category IDs, question IDs, names, colours, icons, sort orders, enabled flags, category relationships, and question text.
- Kept the existing `sortedCategories` and `enabledQuestions` exports so the current game flow does not need to change.
- Added clear TypeScript interfaces for the complete JSON data structure.
- Added startup validation for:
  - malformed root data
  - missing category or question arrays
  - duplicate category IDs
  - duplicate question IDs
  - blank required strings, including question text
  - invalid number and boolean fields
  - questions referencing a missing category ID
- Added a clear `[Preteen Game] Invalid game-data.json:` console error before rethrowing invalid data errors.

## Test results

The repository execution environment was not available through the connected GitHub file interface, so commands could not be executed in this session.

Required verification commands remain:

```text
npm run lint
npm run build
```

## Build result

Pending execution of `npm run build` in a local checkout, Codex environment, GitHub Actions runner, or Vercel preview build.

## Known limitations

- JSON validation happens when the application module loads. Invalid data stops the application and reports the specific validation failure in the browser console.
- This phase intentionally provides no browser-based editor or publishing workflow.
- The PWA continues to bundle the JSON through Vite; no runtime network request for the question bank was introduced.

## Manual testing steps

1. Run `npm install` if dependencies are not installed.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Start the app and confirm all five categories appear with the existing colours and icons.
5. Open each category and confirm its six questions can be selected.
6. Confirm a displayed question is not selected again during the same session.
7. Refresh on the question page and confirm the current question and timer state are restored.
8. Test start, pause, resume, skip, complete, return to categories, expiry, reset, and full-game completion.
9. Test the production build offline after one successful online load.
10. Temporarily introduce a duplicate ID, blank question text, or invalid category ID in `game-data.json` and confirm the console displays a clear validation error; then revert the test change.
