# Preteen Game MVP Review

## Summary

Completed the tablet-first Preteen category challenge game MVP using React, TypeScript and Vite. The implementation uses local TypeScript data only and does not add Supabase, databases, authentication, admin routes, scoring, analytics or external APIs.

## Files changed

- `index.html`
- `public/manifest.webmanifest`
- `public/sw.js`
- `src/App.css`
- `src/App.tsx`
- `src/index.css`
- `src/main.tsx`
- `src/components/CategoryCard.tsx`
- `src/components/CountdownRing.tsx`
- `src/components/GameControls.tsx`
- `src/components/QuestionText.tsx`
- `src/components/ResetGameButton.tsx`
- `src/data/categories.ts`
- `src/data/questions.ts`
- `src/hooks/useGameSession.ts`
- `src/pages/CategoryPage.tsx`
- `src/pages/GameCompletePage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/QuestionPage.tsx`
- `src/types/game.ts`
- `src/utils/gameRules.ts`
- `src/utils/storage.ts`

## Features implemented

- Home page with only a large `新遊戲` button.
- Category page with five Traditional Chinese categories, large touch targets and landscape tablet 3 + 2 card layout.
- Local TypeScript category and question bank with 30 enabled MVP questions.
- Random question selection from the selected category.
- Same-session non-repeat logic using `usedQuestionIds`, recorded immediately when a question is shown.
- Question page with category label, large question text, 60-second countdown ring and state-based controls.
- Timer states for ready, running, paused and expired.
- Timer based on real timestamps through `endTimestamp`, so reloads and tab switching recalculate remaining time correctly.
- Session persistence with `sessionStorage` under `preteen-game-session-v1`.
- Complete page shown when all enabled questions are used.
- Basic PWA manifest and service worker for app-shell/runtime asset caching after first load.
- Responsive CSS for landscape tablets, portrait tablets, phones and desktop.

## Test results

- `npm run lint` passed.
- Browser manual checks passed on `1024x768`:
  - Home page showed only `新遊戲`.
  - Category page showed the five expected categories and reset button.
  - Selecting `動作` opened a question page in ready state with 60 seconds and `開始 / 跳過 / 返回分類`.
  - Starting the timer changed controls to `完成 / 暫停 / 跳過 / 返回分類`.
  - Pausing changed the main timer control to `繼續`.
  - Refreshing while running preserved the current question and recalculated remaining time.
  - Skipping selected a different question in the same category, reset to 60 seconds and stayed in ready state.

## Build result

- `npm run build` passed.
- TypeScript build completed successfully.
- Vite production build completed successfully.

## Known limitations

- Offline support is a basic app-shell/runtime cache. The app is playable offline after assets have been loaded once, but there is no update prompt or background sync.
- The MVP has no scoring, history, admin tools, user accounts, database or multi-device sync by design.
- Fullscreen is requested from the home `新遊戲` tap only; browsers may reject it silently and the game continues normally.

## Manual testing steps

1. Run `npm run dev -- --host 127.0.0.1 --port 5173`.
2. Open `http://127.0.0.1:5173/` in a landscape tablet-sized viewport.
3. Tap `新遊戲` and confirm `/game` shows five category cards.
4. Tap a category and confirm `/game/question` shows a question, 60 seconds and the ready controls.
5. Tap `開始`, wait a few seconds, refresh the page and confirm the same question remains with the timer reduced by real elapsed time.
6. Tap `暫停`, wait, confirm the timer does not keep decreasing, then tap `繼續`.
7. Tap `跳過` and confirm a new question appears with 60 seconds and does not repeat the previous question.
8. Tap `返回分類` and confirm the current question does not reappear in the same game session.
9. Continue using questions until all are exhausted and confirm the complete page appears.
10. Turn off network after a successful first load and reload the app to confirm the cached shell loads.
