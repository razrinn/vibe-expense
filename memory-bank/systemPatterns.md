# System Patterns

## UI Patterns

### Expense Card Design

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

1. **Delete Flow**:

   - First tap: Highlight item
   - Second tap: Show confirmation
   - Slide-out animation on confirm

2. **Quick Edit**:

   - Double-tap to enter edit mode
   - Inline form fields
   - Save/cancel buttons

3. **Swipe Actions**:
   - Left swipe: Edit
   - Right swipe: Delete

## Component Architecture

### ExpenseCard (New)

```tsx
interface ExpenseCardProps {
  expense: Expense;
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}
```

### Implementation Timeline

1. Day 1: Create ExpenseCard component
2. Day 2: Update ExpenseList
3. Day 3: Update DailyGroupedExpenseList
4. Day 4: Update ExpenseFilters
5. Day 5: Testing and polish

2025-05-28 14:34:25 - Created UI revamp plan

[2024-05-28 15:29:55] - Currency Handling Pattern

- Currency selection is now type-safe throughout the application
- All currency symbols and display names are defined in a single source (CURRENCY_DISPLAY_NAMES)
- Input fields automatically adjust padding for different currency symbol widths
- Currency preferences persist via SettingsContext and localStorage
