# Random Category Start Flow Review

## Summary

Updated the game start flow so the production root page opens directly to the category home page instead of the previous separate new game page.

Added a new random category start control on the category page so leaders can start a new round by drawing one available category with a short lottery-style highlight animation.

## Files changed

- `src/App.tsx`
- `src/pages/CategoryPage.tsx`
- `src/components/CategoryCard.tsx`
- `src/randomCategory.css`
- `docs/review/random-category-start-flow-2026-06-18.md`

## Features implemented

- `/` now renders the category home page directly.
- Manual category selection remains available.
- Added a prominent `🎲 開新局` button near the top of the category page.
- Clicking `🎲 開新局` randomly chooses one available, incomplete category.
- Added a lottery / slot-machine style card highlight animation.
- The selected category card is visually emphasized and labelled `今局分類`.
- After a category is selected, users can click `進入這個分類` to start that category.
- Added `再抽一次` after a result is shown.
- Completed categories are excluded from the random draw.
- Existing admin and publish flow are not changed.
- Existing question bank data structure is not changed.

## Notes

- A separate `src/randomCategory.css` file was added instead of rewriting the full existing stylesheet.
- This keeps the random category styling isolated and easier to adjust later.
- The old `HomePage` component is no longer used by the main route, but it was not deleted in this change.

## Local verification

Pending local verification:

```text
npm run lint
npm run build
```

## Manual test plan

1. Open `/` and confirm the category page appears directly.
2. Confirm the `🎲 開新局` button appears above the category cards.
3. Click `🎲 開新局` and confirm category cards highlight one by one.
4. Confirm the animation stops on one category.
5. Confirm the selected card shows `今局分類`.
6. Click `進入這個分類` and confirm the question page opens.
7. Return to categories and confirm manual category selection still works.
8. Complete a category and confirm it is not included in future random draws.
9. Confirm `/admin` still works.
