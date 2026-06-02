# KinHarbour Supabase Setup

This document describes the Supabase configuration needed for KinHarbour staging and production.

## Required Environment Variables

The app only reads these public Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

There are no admin-specific, site URL, or auth redirect environment variables in the current codebase.

Do not expose the Supabase service role key in this app.

## Required SQL

Run the cumulative SQL setup file before staging QA:

[outputs/kinharbour-supabase-setup.sql](../outputs/kinharbour-supabase-setup.sql)

The SQL creates the required tables, indexes, triggers, helper functions, grants, and Row Level Security policies.

## Required Tables

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

## Required RLS Behaviour

- Family users can read only profiles visible through their own family case membership.
- Family users can read and update only family cases where they are family members.
- New family cases automatically add the creator as an owner in `family_members`.
- Family members can read saved assessments, shortlists, tasks, and notes for their family case.
- Family case owners can create invitation links.
- Invited users can view and accept pending invitation links for their email address.
- Public users can read only published provider and resource records.
- Admin users can create, edit, publish, unpublish, and delete provider/resource records.

## Auth Settings

In Supabase, enable:

- Email/password sign-up
- Email confirmation according to your staging preference

Recommended local redirect URLs:

- `http://localhost:3000`
- `http://localhost:3000/login?confirmed=true`
- `http://localhost:3000/dashboard`

Recommended Vercel staging redirect URLs:

- `https://your-staging-domain.vercel.app`
- `https://your-staging-domain.vercel.app/login?confirmed=true`
- `https://your-staging-domain.vercel.app/dashboard`
- `https://your-staging-domain.vercel.app/invite/*`

Recommended Vercel production redirect URLs:

- `https://your-production-domain`
- `https://your-production-domain/login?confirmed=true`
- `https://your-production-domain/dashboard`
- `https://your-production-domain/invite/*`

Set the Supabase Site URL to the active staging or production URL you are testing.

## Create The First Admin User

1. Sign up through `/sign-up`.
2. Confirm the user exists in `auth.users`.
3. Confirm a row exists in `public.profiles`.
4. Run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Confirm Normal Users Cannot Access Admin

1. Sign up as a normal family user.
2. Visit `/admin`.
3. Confirm the user is redirected to `/dashboard`.
4. Confirm no provider or resource admin pages are visible.

## Confirm Family Data Isolation

1. Create two separate test users.
2. Create a family case under user A.
3. Log in as user B without accepting an invite.
4. Confirm user B cannot see user A's dashboard data.
5. Invite user B from user A's family page.
6. Accept the invite as user B.
7. Confirm user B can now see only that invited family case.

## Common Supabase Issues

- Missing tables: run the cumulative SQL file.
- Missing profile row after sign-up: confirm the `on_auth_user_created` trigger exists.
- Family case does not appear after creation: confirm the `add_family_case_owner_after_insert` trigger exists.
- Dashboard data fails to load: confirm RLS policies and helper functions exist.
- Admin access redirects to dashboard: confirm the profile has `role = 'admin'`.
