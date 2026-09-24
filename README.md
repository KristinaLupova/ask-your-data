# Ask Your Data

Upload a CSV, ask a question in plain English, and get a streamed answer with a chart and the exact rows behind it. Built with Next.js, TypeScript and the Claude API.

> Status: day 1 of 10. Starter page, tests and CI are in place.

## Run locally

Requires Node 22+.

```bash
npm install
cp .env.example .env.local   # add your Anthropic API key (needed from day 4)
npm run dev                  # http://localhost:3000
```

## Checks

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # Vitest + React Testing Library
npm run build       # production build
```

CI runs all four on every push and pull request (`.github/workflows/ci.yml`).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Vitest · React Testing Library · Vercel

Coming next: Papa Parse (CSV), DuckDB (queries), Anthropic SDK (Claude streaming + tool use), Recharts, TanStack Table.
