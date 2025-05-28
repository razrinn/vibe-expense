# Decision Log

This file records architectural and implementation decisions using a standardized format.
2025-05-28 15:58:00 - Updated with new component and formatting decisions.

## Authentication

2025-05-26 22:57:27:

- **Decision**: Implement manual cookie handling for session management
- **Rationale**: User denied installation of `js-cookie` library
- **Implementation**: Custom cookie functions added to `AuthContext.tsx`

## Performance Optimization

2025-05-27 12:13:07:

- **Decision**: Implement dynamic imports for page components
- **Implementation**: Used React.lazy and React.Suspense in src/App.tsx
- **Impact**: Improved initial load performance

## Data Management

2025-05-27 12:39:30:

- **Decision**: Centralize expense data clearing logic
- **Rationale**: Encapsulate state management within ExpenseContext
- **Implementation**: Created `clearAllExpenses` function in ExpenseContext

2025-05-27 14:40:39:

- **Decision**: Persist default categories to IndexedDB
- **Rationale**: Avoid hardcoded UUIDs and ensure session consistency
- **Implementation**: Modified category initialization logic

## UI/UX Improvements

2025-05-27 15:18:38:

- **Decision**: Replace 'Average daily spending' with 'Number of Transactions'
- **Rationale**: User feedback indicated better usefulness
- **Impact**: Updated KeyMetrics.tsx and HomePage.tsx

## CSV Handling

2025-05-27 16:54:05:

- **Decision**: Implement CSV import strategy
- **Rationale**: User preference for record overwrite/creation
- **Implementation**: Used Dexie's `bulkPut()` method

## Budgeting Feature

2025-05-27 18:53:15:

- **Decision**: Implement monthly category budgeting
- **Rationale**: User requested spending tracking feature
- **Implementation**:
  - Added budget to Category interface
  - Updated related components and utilities
  - Modified IndexedDB schema

## Currency System

2025-05-28 15:29:35:

- **Decision**: Standardize currency handling
- **Implementation**:
  - Added type-safe Currency type
  - Updated ExpenseForm and Settings components
  - Centralized currency data source

## New Component: Spending Habits Insight

2025-05-28 15:58:00:

- **Decision**: Add a "Spending Habits Insight" component to the home page.
- **Rationale**: Address the "empty home page" feedback, provide creative, non-visualized insights, and encourage user engagement.
- **Implementation**:
  - Created `src/components/insights/SpendingHabitsInsight.tsx`.
  - Implemented dynamic insight generation based on `ExpenseSummary`.
  - Added trend analysis by comparing current and previous month's spending.
  - Ensured adherence to existing color palette and design language.

## Number Formatting

2025-05-28 15:58:00:

- **Decision**: Standardize number formatting with thousand separators for all numerical displays, including percentages.
- **Rationale**: Improve readability and user experience, addressing direct user feedback.
- **Implementation**:
  - Modified `formatCurrency` in `src/utils/formatters.ts` to explicitly use `useGrouping: true` and set default locale to 'en-US'.
  - Added new `formatNumber` utility in `src/utils/formatters.ts` for general number formatting (used for percentages).
  - Applied `formatNumber` to percentage displays in `SpendingHabitsInsight.tsx`.
