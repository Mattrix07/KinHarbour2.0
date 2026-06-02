# KinHarbour Project Instructions

## What KinHarbour Is

KinHarbour is an Australian aged care navigation and decision platform for families, adult children, spouses, and carers helping an older parent or relative navigate home care, respite care, residential aged care, urgent hospital discharge support, provider comparison, family coordination, and aged care cost understanding.

KinHarbour is not just a directory. It is a personalised aged care decision engine.

## Product Principles

- Build for families and carers first, not aged care providers.
- Providers are listed entities and data sources at MVP stage.
- Do not create provider accounts yet.
- Do not add AI chat yet.
- Do not add payments yet.
- Do not scrape My Aged Care.
- Do not create fake backend calls.
- Keep every change incremental, clean, and easy to reason about.

## Target Users

- Adult children helping an older parent.
- Spouses and partners making care decisions.
- Family carers coordinating support.
- Relatives helping during urgent transitions, including hospital discharge.
- Families comparing home care, respite care, and residential aged care options.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui later, only when a task needs it.
- Supabase later, only when authentication or persistence is deliberately introduced.
- Vercel deployment later.

## Build Order

The first product goal is:

1. Assessment.
2. Pathway recommendation.
3. Action plan.
4. Dashboard.
5. Shortlist and compare providers.

Future work should strengthen this sequence before adding secondary systems.

## Do-Not-Break Rules

- Do not remove the navigation foundation once created.
- Do not remove the assessment flow routes once created.
- Do not remove the dashboard routes once created.
- Do not remove provider shortlist or comparison routes once created.
- Do not add authentication logic until the core assessment and dashboard flow needs persistence.
- Do not add database logic until Supabase is intentionally introduced.
- Do not add mock APIs or pretend network calls.
- Do not make providers the primary users of the MVP.
- Do not introduce provider onboarding, provider dashboards, or provider account features yet.

## Development Guidance

- Prefer small, focused tasks.
- Keep pages and components readable.
- Use shared constants for navigation when it keeps routes consistent.
- Preserve accessible text, calm visual design, and clear spacing.
- Keep disclaimers visible where appropriate.
- Treat My Aged Care, medical, legal, and financial decisions carefully. KinHarbour may provide general navigation support, but it does not determine eligibility or replace professional advice.
