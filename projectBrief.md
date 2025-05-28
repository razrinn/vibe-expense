# Vibe Expense - Project Brief

## Overview

Vibe Expense is a progressive web application (PWA) for personal expense tracking and budget management. It provides users with tools to record expenses, analyze spending patterns, and manage budgets across categories.

## Core Features

### Expense Management

- Add, edit, and delete expense records
- Categorize expenses with customizable categories
- Filter expenses by date, category, and amount
- Daily grouped expense lists

### Budget Tracking

- Set budget limits per category
- Visual budget overview with progress indicators
- Budget vs actual spending comparisons

### Analytics & Insights

- Spending trends over time
- Category-wise expense breakdowns
- Personalized spending habit insights

### Authentication & Security

- PIN-based local authentication
- All data stored locally in IndexedDB
- No cloud synchronization (offline-first)

### Progressive Web App

- Installable on mobile/desktop
- Works offline
- Push notification support (future)

## Technical Stack

### Frontend

- React with TypeScript
- Vite build tool
- Tailwind CSS for styling
- IndexedDB for local storage
- Service Worker for PWA capabilities

### Development Tools

- ESLint for code quality
- Prettier for code formatting
- TypeScript strict type checking
- PNPM for package management

## Limitations

1. **Data Portability**: Currently no export/import functionality
2. **Multi-device Sync**: No cloud sync capability
3. **Reporting**: Limited to basic charts and metrics
4. **Backup**: No automatic backup system

## Future Possibilities

- Cloud synchronization
- Receipt scanning via camera
- Recurring expenses
- Shared budgets (multi-user)
- CSV/Excel export
- Automated categorization
