# KinHarbour Vercel Deployment

Use this checklist to deploy KinHarbour to a staging Vercel URL.

## 1. Connect Repository

- Push the project to GitHub.
- In Vercel, choose **Add New Project**.
- Import the GitHub repository.
- Use the Next.js framework preset.

## 2. Build Settings

Use the defaults:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave default for Next.js
- Development command: `npm run dev`

No custom output setting is required.

## 3. Environment Variables

Add these in Vercel Project Settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

Do not add a Supabase service role key.

No admin-specific, site URL, or auth redirect env vars are required by the current app.

## 4. Supabase Before Deploy

- Run the SQL setup file: [outputs/kinharbour-supabase-setup.sql](../outputs/kinharbour-supabase-setup.sql).
- Enable email/password auth.
- Add local and Vercel redirect URLs in Supabase Auth settings.
- Promote your admin user by setting `profiles.role = 'admin'`.

## 5. Deploy

- Deploy the staging branch or main branch.
- Open the Vercel deployment URL.
- Confirm the homepage loads.
- Confirm `/login` and `/sign-up` load.
- Confirm `/dashboard` redirects to `/login` while logged out.

## 6. Supabase Auth Redirect URL

The sign-up form uses the current browser origin:

```ts
window.location.origin + "/login?confirmed=true"
```

That means Supabase must allow the exact Vercel domain being tested.

Family invitation links are generated from request headers, so the deployed Vercel domain should be used automatically.

## 7. Common Deployment Errors

- **Missing Supabase env vars**: add both public Supabase variables in Vercel and redeploy.
- **Auth redirects back to localhost**: update the Supabase Site URL and redirect URLs.
- **Dashboard says storage is not ready**: run the cumulative Supabase SQL.
- **Admin redirects to dashboard**: set your profile role to `admin`.
- **Provider/resource admin tables are empty**: create records in `/admin`, publish them, then check public pages.
- **Build fails on Vercel but passes locally**: confirm the same Node/npm dependency install path and that no local-only files are required.

## 8. Post-Deploy Smoke Test

- `/`
- `/assessment`
- `/assessment/results`
- `/providers`
- `/compare`
- `/costs`
- `/resources`
- `/login`
- `/sign-up`
- `/dashboard`
- `/admin`
