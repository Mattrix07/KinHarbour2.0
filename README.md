# KinHarbour

KinHarbour is an Australian aged care navigation and decision platform for families, adult children, spouses, and carers helping an older parent or relative organise aged care decisions.

The MVP focuses on a practical decision flow: assessment, pathway recommendation, action plan, dashboard, family case, provider shortlist, provider comparison, cost modelling, and plain-English resources.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Supabase tables for user-owned dashboard data
- Local TypeScript fallback data for providers and resources

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

Use the Supabase anon/publishable key only. Do not add a service role key to this app.
Local `.env*` files are ignored by `.gitignore`, except `.env.example`.

Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build Checks

Run lint:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Supabase Setup Notes

Supabase is used for authentication and protected family-dashboard data. Required tables and policies include:

- `profiles`
- `family_cases`
- `family_members`
- `assessment_sessions`
- `shortlisted_providers`
- `invitations`
- `family_tasks`
- `family_notes`
- `providers`
- `resource_articles`

Row Level Security should stay enabled on user-owned tables. Family case data should only be visible to users who are members of that family case. Admin provider and resource management requires a profile with `role = 'admin'`.

## Vercel Deployment Notes

Before deploying, add the same public Supabase environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

In Supabase Auth settings, configure site URL and redirect URLs for the production domain and local development domain.

## MVP Limitations

- KinHarbour does not determine aged care eligibility.
- KinHarbour does not replace My Aged Care, Services Australia, provider verification, medical advice, legal advice, or financial advice.
- Cost outputs are indicative estimates only.
- Provider records are informational. Local fallback provider data is fictional.
- Resource articles are general guidance only, not official government guidance.
- There are no provider accounts, payments, AI chat, or My Aged Care scraping.
- Providers and resources still support local TypeScript fallback data.

## Safety Notes

Keep future work incremental. Do not remove the existing navigation, assessment flow, dashboard, provider shortlist, provider comparison, costs page, resources, or admin content foundation unless a task explicitly asks for a scoped replacement.
