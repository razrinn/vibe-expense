# Decision Log

This file records architectural and implementation decisions using a list format.
2025-05-26 10:19:10 - Log of updates made.

-

## Decision

-

## Rationale

-

## Implementation Details

-

[2025-05-26 22:57:27] - Decision: Implement manual cookie handling for session management. Rationale: User denied installation of `js-cookie` library. Implications: Custom cookie functions were added to `AuthContext.tsx`.

[2025-05-27 12:13:07] - Implemented dynamic imports for page components in src/App.tsx using React.lazy and React.Suspense to improve initial load performance.

[2025-05-27 12:39:30] - Centralized data clearing logic for expenses.
Rationale: Initially, `db.expenses.clear()` was called directly in `SettingsPage.tsx`, followed by a `refreshExpenses()` call from `ExpenseContext`. This led to a less cohesive design. By moving the `db.expenses.clear()` and `setExpenses([])` into a new `clearAllExpenses` function within `ExpenseContext`, the responsibility for managing expense data state and persistence is fully encapsulated within the context. This improves maintainability, reduces potential for inconsistencies, and provides a cleaner API for components.
Implications: Components needing to clear all expense data now only need to call `clearAllExpenses()` from `useExpenses`, simplifying their logic.

[2025-05-27 14:40:39] - Decision: Instead of hardcoding UUIDs for default categories, the approach was changed to persist default categories to IndexedDB if the category store is initially empty. This ensures consistency across sessions without relying on fixed UUIDs in code.

[2025-05-27 15:18:38] - Decision: Replaced 'Average daily spending' metric with 'Number of Transactions' in 'KeyMetrics.tsx'. Rationale: User feedback indicated 'Average daily spending' was not useful. 'Number of Transactions' provides a more direct and easily understandable metric for activity. Implications: Required updates to 'KeyMetrics.tsx' and 'HomePage.tsx' to remove unused 'period' prop and 'filter' variable.

[2025-05-27 16:54:05] - Decision: CSV Import Strategy
Rationale: User preference is to overwrite existing records if their ID matches, and add new records if the ID does not exist.
Implementation Details: Utilize Dexie's `bulkPut()` method for both expenses and categories during CSV import. This method handles both insertion of new records and updating of existing records based on their primary key (`id`).

[2025-05-27 18:53:15] - Decision: Implemented monthly budgeting feature for categories.
Rationale: User requested a budgeting feature to help track spending per category on a monthly basis.
Implementation Details:

- Added `budget?: number;` to the `Category` interface in `src/types/index.ts`.
- Modified `CategoryManager.tsx` to include input fields for budget and display the budget using `formatCurrency`.
- Updated `getDefaultCategories` in `src/utils/categories.ts` to set a default budget of 0.
- Updated `indexedDB.ts` to include `budget` in the categories store schema and incremented the database version.
- Modified `csvUtils.ts` to handle `budget` during category CSV export and import.

[2025-05-28 12:24:02] - Decision: Moved `dateRange` `useMemo` hook to an earlier position in `CategoryBudgetOverview.tsx` to resolve "used before declaration" errors for `sortedBudgetedCategories`.
