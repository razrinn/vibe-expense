# System Patterns

This file documents recurring patterns and standards used in the project.
2025-05-28 15:44:00 - Last updated during memory bank cleanup.

## UI Patterns

### Expense Card

- **Layout**: Two-column (70/30 split)
- **Typography**:
  - Amount: 1.25rem semibold
  - Description: 1rem medium
  - Metadata: 0.875rem regular
- **Colors**:
  - Primary: Green-600 (light), Green-400 (dark)
  - Secondary: Gray-700 (light), Gray-300 (dark)
- **Spacing**: 16px padding, 8px gap between elements
- **States**:
  - Hover: subtle shadow elevation
  - Focus: ring-2 ring-green-500
  - Active: slight scale transform

### Interaction Patterns

- **Delete Flow**:
  - First tap: Highlight item
  - Second tap: Show confirmation
  - Slide-out animation on confirm
- **Quick Edit**:
  - Double-tap to enter edit mode
  - Inline form fields
  - Save/cancel buttons
- **Swipe Actions**:
  - Left swipe: Edit
  - Right swipe: Delete

## Component Architecture

### ExpenseCard

```tsx
interface ExpenseCardProps {
  expense: Expense;
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}
```

### Currency Handling

- Type-safe currency system with 16 supported currencies
- Dynamic symbol display in forms
- Centralized currency data source (CURRENCY_DISPLAY_NAMES)
- SettingsContext integration for persistence
