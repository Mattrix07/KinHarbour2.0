# KinHarbour Staging QA Checklist

Run this checklist against the Vercel staging URL after deployment.

## Public Journey

- Homepage loads.
- Header navigation works.
- Footer navigation works.
- Footer disclaimers are visible.
- `/assessment` starts correctly.
- Assessment questions progress correctly.
- Assessment back/next controls work.
- Assessment validation appears if no answer is selected.
- `/assessment/results` works after completion.
- Anonymous users still get an assessment result.
- `/assessment/results` does not crash if local storage is empty.
- `/providers` loads.
- Provider search/filter/sort works.
- Provider profile pages load.
- `/compare` loads.
- Public compare can add/remove up to five providers.
- `/costs` loads.
- RAD/DAP calculator updates values.
- Cost validation prevents negative values and lump sum greater than RAD.
- `/resources` loads.
- Resource search/filter works.
- Resource article pages load.
- Invalid resource slug shows a friendly not-found state.
- `/privacy`, `/contact`, and `/about` load.

## Auth Journey

- `/sign-up` loads.
- Sign-up validation works.
- New account can be created.
- Email confirmation flow works if enabled.
- `/login` loads.
- Login validation works.
- User can log in.
- User can log out.
- Logged-out user cannot access `/dashboard`.
- Logged-out user cannot access `/admin`.

## Family Dashboard Journey

- Logged-in user can access `/dashboard`.
- User with no family case sees the create-family-case empty state.
- User can create a family case.
- User can edit family case details in `/dashboard/settings`.
- User can complete assessment while logged in.
- Assessment result saves to dashboard.
- `/dashboard/action-plan` shows saved action plan.
- `/dashboard/assessment` shows saved assessment history.

## Provider Shortlist Journey

- Logged-in user with a family case can save provider to shortlist.
- `/dashboard/shortlist` shows saved providers.
- User can add shortlist notes.
- User can change shortlist status.
- `/dashboard/compare` compares shortlisted providers.
- User can remove provider from shortlist.

## Family Collaboration Journey

- `/dashboard/family` loads.
- Owner can generate invite link.
- Invited user can sign up or log in.
- Invited user can accept invite link.
- Family member appears in family list.
- `/dashboard/tasks` loads.
- User can create task.
- User can update task status.
- User can delete task.
- `/dashboard/notes` loads.
- User can create note.
- User can delete note.

## Admin Journey

- Normal family user is blocked from `/admin`.
- Admin user can access `/admin`.
- Admin user can create provider.
- Admin user can publish provider.
- Published provider appears publicly.
- Admin user can unpublish provider.
- Unpublished provider disappears publicly if no fallback is matching that id.
- Admin user can create resource.
- Admin user can publish resource.
- Published resource appears publicly.
- Admin user can unpublish resource.
- Unpublished resource disappears publicly if no fallback is matching that slug.

## Production Safety Wording

- KinHarbour does not claim to determine eligibility.
- KinHarbour does not replace My Aged Care.
- KinHarbour does not provide medical, legal, or financial advice.
- Cost outputs are labelled indicative only.
- Provider information tells families to verify details.
- KinHarbour does not endorse providers.
- Family collaboration does not imply legal decision-making authority.

## Staging Notes

- Record the staging URL tested.
- Record test user emails used.
- Record whether email confirmation was enabled.
- Record any Supabase RLS or redirect issues.
- Record any mobile layout issues separately before changing product scope.
