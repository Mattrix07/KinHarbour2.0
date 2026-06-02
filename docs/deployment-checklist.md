# KinHarbour Deployment Checklist

Use this before the first Vercel deployment and after any Supabase schema changes.

## Supabase

- Create a Supabase project.
- Enable email/password authentication.
- Add the required SQL tables, helper functions, triggers, and Row Level Security policies.
- Confirm these tables exist:
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
- Confirm RLS is enabled on user-owned and admin-managed tables.
- Confirm family case policies only allow access to users in `family_members`.
- Confirm public provider/resource select policies only expose `is_published = true` records to public users.
- Confirm admin insert/update/delete policies require `profiles.role = 'admin'`.
- Confirm profile creation works for newly signed-up users.
- Promote the intended admin account:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Environment Variables

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

Add the same variables to Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not add a Supabase service role key to the frontend app.

## Auth Redirect URLs

In Supabase Auth settings, configure:

- Site URL: production Vercel URL
- Redirect URL: production Vercel URL
- Redirect URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/login?confirmed=true`
- Redirect URL: production `/login?confirmed=true`

## Local Preflight

Run:

```bash
npm run lint
npm run build
```

Manually test:

- `/`
- `/assessment`
- `/assessment/results`
- `/providers`
- `/compare`
- `/costs`
- `/resources`
- `/sign-up`
- `/login`
- `/dashboard`
- `/admin`

## Vercel

- Connect the repository to Vercel.
- Confirm framework preset is Next.js.
- Add environment variables.
- Deploy.
- Open the production URL.
- Confirm no required environment variable is missing.
- Confirm protected routes redirect correctly.

## Post-Deployment Smoke Test

- Sign up with a fresh test account.
- Create a family case.
- Complete an assessment and confirm it saves.
- Add at least one provider to the shortlist.
- Open dashboard shortlist and compare pages.
- Add a family task and note.
- Log out and confirm dashboard routes are protected.
- Log in as an admin user and create a draft provider.
- Publish the provider and confirm it appears on `/providers`.
- Create a draft resource.
- Publish the resource and confirm it appears on `/resources`.

## Safety Review

- Confirm the footer disclaimer appears on public pages.
- Confirm costs remain labelled as indicative only.
- Confirm provider pages say families should verify details.
- Confirm resources do not claim official government status.
- Confirm family collaboration does not imply legal authority.
