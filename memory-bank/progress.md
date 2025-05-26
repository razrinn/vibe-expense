# Progress

This file tracks the project's progress using a task list format.
2025-05-26 10:19:05 - Log of updates made.

-

## Completed Tasks

-

## Current Tasks

-

## Next Steps

-

[2025-05-26 22:26:41] - Added splash screen configuration to public/manifest.json.
[2025-05-26 22:29:14] - Incremented APP_VERSION in public/sw.js to v1.0.8 and added favicon.ico and apple-touch-icon.png to urlsToCache.
[2025-05-26 22:43:07] - Completed IndexedDB migration: Dexie.js installed, `src/utils/indexedDB.ts` created with IndexedDB setup and migration logic, and `src/context/ExpenseContext.tsx` updated to use IndexedDB for expense and category CRUD operations.

[2025-05-26 22:57:38] - Task Completed: Implemented cookie-based session management in `AuthContext.tsx` and updated `AuthState` in `types/index.ts`.

[2025-05-26 23:04:34] - Modified `handleClearData` in `src/pages/SettingsPage.tsx` to use IndexedDB for clearing data and added the necessary import for `db`.

[2025-05-26 23:19:04] - Disabled right-click/long-press on links by adding a global `contextmenu` event listener in `src/main.tsx`.
