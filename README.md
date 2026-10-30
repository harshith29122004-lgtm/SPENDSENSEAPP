# SpendSense — Smart Expense Manager

SpendSense is an expense-management project focused on helping users record income and expenses and understand their spending.

## Repository implementation note

The current code in this repository is a **React, TypeScript, and Vite web application**. This README describes the checked-in implementation rather than the separate Kotlin/Jetpack Compose Android version described in earlier project notes.

## Current technology

- React 19
- TypeScript
- Vite
- Recharts
- Google GenAI package (dependency present in the project)

## Project focus

- Organize income and expense information.
- Support a clear expense-management interface.
- Present financial information through visual components where implemented.
- Keep the application straightforward to use.

## Run locally

### Prerequisites

- Node.js
- npm

### Setup

```bash
git clone https://github.com/harshith29122004-lgtm/SPENDSENSEAPP.git
cd SPENDSENSEAPP
npm install
npm run dev
```

Open the local development URL printed by Vite.

## Build

```bash
npm run build
```

## Notes

- The application uses browser-side storage in its current implementation; clearing browser data may affect locally stored information.
- Keep API keys and other secrets out of source control.
- The Android/Kotlin implementation should be maintained in its own repository or branch if it is to be showcased separately.

## Repository

[View the source code](https://github.com/harshith29122004-lgtm/SPENDSENSEAPP)
