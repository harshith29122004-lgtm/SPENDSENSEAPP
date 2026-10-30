# SpendSense — Personal Expense Manager

SpendSense is a React and TypeScript expense-management prototype. It provides a dashboard for recording income and expenses, reviewing transactions, setting a budget, viewing category/monthly charts, and requesting AI-generated spending insights.

> **Prototype and security notice:** This repository is a front-end demonstration, not a production financial application. User profiles, login state, passwords, budgets, and transactions are stored in browser local storage. Passwords are not securely hashed and there is no server-side authentication or authorization. Do not use real passwords, sensitive financial information, or real customer data. The included social/biometric login flows are demonstrations, not real identity-provider or WebAuthn authentication.

## Features in the checked-in code

- Sign-in/sign-up demonstration screens.
- Income and expense transaction management.
- Transaction filtering and date sorting.
- Income, expense, and balance summaries.
- Budget tracking.
- Category and monthly charts using Recharts.
- Gemini-powered expense analysis integration.
- Browser local-storage persistence.

## Technology

- React 19
- TypeScript
- Vite
- Recharts
- Google GenAI SDK

## Run locally

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/harshith29122004-lgtm/SPENDSENSEAPP.git
cd SPENDSENSEAPP
npm install
npm run dev
```

Open the local URL printed by Vite.

Create a local `.env.local` file and set `GEMINI_API_KEY=your_key` if you want to test Gemini analysis. The Vite configuration injects this value into the browser bundle, so the key is visible to users of the built app. This is suitable only for local experimentation with a restricted/test key. **Do not deploy this configuration with a private API key.** A production version should call Gemini through a server-side API that keeps credentials secret and enforces authentication, authorization, validation, and rate limits.

## Build

```bash
npm run build
npm run preview
```

## Data and privacy

- Data is stored in the current browser's local storage.
- Clearing browser storage can remove saved demo data.
- Local storage is not a secure credential store.
- Do not enter real financial or personal information into this prototype.

## Repository

[View source code](https://github.com/harshith29122004-lgtm/SPENDSENSEAPP)
