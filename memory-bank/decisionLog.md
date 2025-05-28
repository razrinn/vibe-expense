# Decision Log

2025-05-28 17:59:30 - Core architecture decisions
[2025-05-28 19:02:00] - Decision: Implement income-to-expense ratio tracking
| Rationale: Provide users with spending context relative to their income
| Implementation: Added monthly income field to ExpenseContext and created visualization component

## Decision: IndexedDB for local storage

### Rationale

- Required for offline PWA functionality
- Handles structured data better than localStorage
- Supports large datasets

### Implementation Details

- Using idb wrapper library
- Database versioning strategy
- Schema defined in src/utils/indexedDB.ts
