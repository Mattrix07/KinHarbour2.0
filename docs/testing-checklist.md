# KinHarbour Manual Testing Checklist

Use this checklist after local changes and again after deployment.

## Public Routes

- Visit `/`, `/about`, `/contact`, `/privacy`.
- Confirm header and footer links navigate correctly.
- Confirm footer disclaimers are visible and accurate.

## Assessment And Results

- Visit `/assessment`.
- Try continuing without selecting an answer and confirm validation appears.
- Complete the assessment using several answer patterns.
- Confirm `/assessment/results` shows a pathway, urgency, reasons, action plan, CTAs, and disclaimer.
- Clear local storage and visit `/assessment/results`; confirm the empty state does not crash.
- While logged in with a family case, complete an assessment and confirm it saves to the dashboard.
- While logged out, complete an assessment and confirm results still render locally.

## Auth

- Visit `/sign-up` and confirm validation/error states.
- Create or use a test user.
- Visit `/login` and confirm validation/error states.
- Log in and confirm redirect to `/dashboard`.
- Log out and confirm redirect to `/login`.
- Visit `/dashboard` while logged out and confirm redirect to `/login?next=/dashboard`.

## Dashboard And Family Case

- Visit `/dashboard` with no family case and confirm the create-family-case empty state.
- Create a family case with valid details.
- Confirm the dashboard overview shows care recipient summary and cards for assessment, action plan, shortlist, compare, family, tasks, notes, and costs.
- Visit `/dashboard/settings`, edit details, and confirm changes save.
- Visit `/dashboard/action-plan` with and without a saved assessment.
- Visit `/dashboard/assessment` with and without saved assessments.
- Visit `/dashboard/shortlist` with and without saved providers.
- Visit `/dashboard/compare` with and without saved providers.
- Visit `/dashboard/family`, create an invitation link, and confirm owner-only messaging.
- Visit `/dashboard/tasks`, add a task, update status, and delete it.
- Visit `/dashboard/notes`, add a note and delete it.
- Log out and back in; confirm dashboard data still loads.

## Providers And Compare

- Visit `/providers`.
- Test search by provider name, suburb, and postcode.
- Test care type and support filters.
- Test sort by star rating, RAD, and suburb.
- Open a provider profile from the directory.
- Add and remove a provider from local compare while logged out.
- Log in with a family case and add/remove providers from the family shortlist.
- Confirm dashboard shortlist notes and status can be updated.
- Add more than five providers to compare and confirm the limit is enforced.
- Visit `/compare` and confirm selected providers render side by side.
- Visit `/dashboard/compare` and confirm shortlist-based selection works.

## Costs

- Visit `/costs`.
- Enter a RAD amount, lump sum, interest rate, and optional daily fees.
- Confirm DAP per day, DAP per month, total daily cost, and total monthly cost update.
- Try negative values and confirm validation.
- Enter a lump sum greater than RAD and confirm validation.
- Confirm the indicative-only disclaimer is visible.

## Resources

- Visit `/resources`.
- Search by title and topic.
- Filter by each resource category.
- Open several resource articles at `/resources/[slug]`.
- Visit an invalid slug and confirm the friendly not-found state.
- Confirm related links, CTAs, and disclaimers are visible.

## Admin

- Visit `/admin` while logged out and confirm redirect to login.
- Visit `/admin` as a normal family user and confirm redirect to dashboard.
- Set a test profile role to `admin` and confirm admin access.
- Create, edit, publish, unpublish, and delete a provider record.
- Create, edit, publish, unpublish, and delete a resource article.
- Try invalid provider rating values and confirm validation.
- Try invalid resource JSON and confirm validation.
- Confirm published provider and resource records appear on public pages.
- Confirm public pages fall back to local TypeScript data when no published records exist.

## Responsive Checks

- Check homepage, assessment, results, providers, compare, costs, resources, dashboard pages, and admin pages at mobile width.
- Confirm tables scroll horizontally where needed.
- Confirm buttons, labels, and cards do not overlap.
