# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-05-26 10:18:55 - Log of updates made will be appended as footnotes to the end of this file.

-

## Project Goal

- A personal expense tracking application to help users manage their finances by tracking expenses, analyzing spending patterns, and providing insights.

## Key Features

- Track individual expenses with details (amount, category, date, description)
- Categorize expenses for better organization
- View expense history and trends
- Analyze spending patterns with charts
- Secure authentication for user data
- Responsive UI for desktop and mobile

## Overall Architecture

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS
- State Management: React Context
- Charts: (chart.js)
- Single user application
- Data stored locally (no backend), currently use localStorage & planning to migrate to indexedDB
- Browser-based (no mobile app)
- use PWA to allow offline access & shortcut to home screen
