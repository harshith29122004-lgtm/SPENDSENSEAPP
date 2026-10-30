# SpendSense — Personal Expense Manager

SpendSense is a React and TypeScript expense-management prototype. It provides a dashboard for recording income and expenses, reviewing transactions, setting a budget, viewing category/monthly charts, and requesting AI-generated spending insights.

> **Prototype and privacy notice:** This is not a production financial application. User profiles, login state, passwords, budgets, and transactions are stored in browser local storage. Passwords are not securely hashed and there is no server-side authentication or authorization. The social/biometric login flows are demonstrations, not real identity-provider or WebAuthn authentication. Do not use real passwords, sensitive financial information, or customer data.

## Features

- Sign-in/sign-up demonstration screens.
- Income and expense transaction management.
- Transaction filtering and date sorting.
- Income, expense, and balance summaries.
- Budget tracking and Recharts visualizations.
- Gemini-powered expense insights through a server-side API.
- Browser local-storage persistence with cross-tab synchronization.

## Technology

- React 19 and TypeScript
- Vite 6
- Recharts
- Node.js API server
- Google GenAI SDK (server-side only)

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```bash
git clone https://github.com/harshith29122004-lgtm/SPENDSENSEAPP.git
cd SPENDSENSEAPP
npm install
```

Copy `.env.example` to `.env` and set your server-side Gemini key:

```dotenv
GEMINI_API_KEY=your_api_key
API_PORT=8787
```

Start both the Vite frontend and API server:

```bash
npm run dev
```

Open the local URL printed by Vite. The Vite development server proxies `/api` requests to the local Node API.

## Tests and production build

```bash
npm test
npm run build
npm run preview
```

To run the API separately:

```bash
npm run start:api
```

Deploy the frontend and API behind the same-origin reverse proxy (route `/api/*` to the Node API). Set `GEMINI_API_KEY` as a server environment secret in the hosting platform. Never add the key to frontend environment variables or commit it to Git.

## Security boundaries

- The Gemini key is read only by the Node API and is no longer injected into the Vite browser bundle.
- The API validates transaction fields, caps request size and transaction count, and applies a basic in-memory per-IP rate limit.
- The rate limiter is per process; production deployments with multiple instances should use a shared rate-limit store and platform-level abuse protection.
- The API does not implement user authentication. Anyone who can reach the endpoint may request analysis, subject to rate limits. Add authenticated server-side sessions and per-user authorization before public deployment.
- The app's demo sign-in is not secure authentication. Passwords and application data remain in browser local storage. Do not reuse real passwords or enter real financial data.
- Local storage is client-side convenience storage, not encrypted storage. The hook handles functional React updates and malformed cross-tab events but does not make stored data private or tamper-proof.
- AI output is informational and may be inaccurate. Review it rather than treating it as financial advice.

## Repository

[View source code](https://github.com/harshith29122004-lgtm/SPENDSENSEAPP)
