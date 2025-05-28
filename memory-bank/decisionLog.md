# Decision Log

2025-05-28 17:59:30 - Core architecture decisions

## Decision: IndexedDB for local storage

### Rationale

- Required for offline PWA functionality
- Handles structured data better than localStorage
- Supports large datasets

### Implementation Details

- Using idb wrapper library
- Database versioning strategy
- Schema defined in src/utils/indexedDB.ts
