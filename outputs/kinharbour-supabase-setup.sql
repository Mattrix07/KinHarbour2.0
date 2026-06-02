-- KinHarbour cumulative Supabase setup
-- Run this in the Supabase SQL editor for the project connected to your app.
-- Use only NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the app.
-- Do not put the Supabase service role key in the frontend app.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text,
  email text,
  role text not null default 'family_user'
);

alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists role text not null default 'family_user';

create table if not exists public.family_cases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  care_recipient_name text not null,
  relationship_to_user text not null,
  care_recipient_suburb text,
  care_recipient_state text,
  current_living_situation text not null,
  current_status text not null,
  primary_pathway text,
  urgency_level text
);

alter table public.family_cases add column if not exists created_at timestamptz not null default now();
alter table public.family_cases add column if not exists updated_at timestamptz not null default now();
alter table public.family_cases add column if not exists created_by uuid references public.profiles(id) on delete cascade;
alter table public.family_cases add column if not exists care_recipient_name text;
alter table public.family_cases add column if not exists relationship_to_user text;
alter table public.family_cases add column if not exists care_recipient_suburb text;
alter table public.family_cases add column if not exists care_recipient_state text;
alter table public.family_cases add column if not exists current_living_situation text;
alter table public.family_cases add column if not exists current_status text;
alter table public.family_cases add column if not exists primary_pathway text;
alter table public.family_cases add column if not exists urgency_level text;

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  family_case_id uuid not null references public.family_cases(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member'
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  family_case_id uuid not null references public.family_cases(id) on delete cascade,
  invited_email text not null,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  status text not null default 'pending',
  expires_at timestamptz
);

create table if not exists public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  family_case_id uuid not null references public.family_cases(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  result jsonb not null default '{}'::jsonb,
  primary_pathway text not null,
  secondary_pathways text[] not null default '{}',
  urgency_level text not null,
  risk_flags text[] not null default '{}',
  recommended_next_steps text[] not null default '{}',
  consent_given boolean not null default false
);

create table if not exists public.shortlisted_providers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  family_case_id uuid not null references public.family_cases(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider_id text not null,
  notes text,
  status text not null default 'considering'
);

create table if not exists public.family_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  family_case_id uuid not null references public.family_cases(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo',
  due_date date,
  category text default 'general'
);

create table if not exists public.family_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  family_case_id uuid not null references public.family_cases(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text,
  body text not null,
  note_type text not null default 'general'
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  suburb text,
  state text,
  postcode text,
  care_types text[] not null default '{}',
  room_types text[] not null default '{}',
  dementia_support boolean not null default false,
  respite_available boolean not null default false,
  palliative_care boolean not null default false,
  couples_accommodation boolean not null default false,
  star_rating numeric not null default 0,
  compliance_rating numeric not null default 0,
  staffing_rating numeric not null default 0,
  resident_experience_rating numeric not null default 0,
  quality_measures_rating numeric not null default 0,
  estimated_rad numeric not null default 0,
  estimated_dap numeric not null default 0,
  description text,
  features text[] not null default '{}',
  contact_phone text,
  website text,
  last_verified_at date,
  data_source_note text,
  is_published boolean not null default false,
  is_demo_data boolean not null default true
);

create table if not exists public.resource_articles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  category text not null default 'getting_started',
  summary text,
  reading_time_minutes integer not null default 5,
  audience text,
  last_reviewed_at date,
  content_sections jsonb not null default '[]'::jsonb,
  related_links jsonb not null default '[]'::jsonb,
  disclaimer text,
  is_published boolean not null default false
);

-- ---------------------------------------------------------------------------
-- Constraints and indexes
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('family_user', 'admin'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_cases_relationship_check') then
    alter table public.family_cases
      add constraint family_cases_relationship_check
      check (relationship_to_user in ('mum', 'dad', 'partner', 'grandparent', 'other'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_cases_living_situation_check') then
    alter table public.family_cases
      add constraint family_cases_living_situation_check
      check (current_living_situation in ('living_independently', 'living_with_family', 'hospital', 'respite', 'residential_aged_care', 'unsure'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_cases_current_status_check') then
    alter table public.family_cases
      add constraint family_cases_current_status_check
      check (current_status in ('just_starting', 'already_contacted_my_aged_care', 'assessment_booked', 'comparing_providers', 'urgent_transition', 'unsure'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_members_case_user_unique') then
    alter table public.family_members
      add constraint family_members_case_user_unique unique (family_case_id, user_id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_members_role_check') then
    alter table public.family_members
      add constraint family_members_role_check check (role in ('owner', 'member'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'invitations_status_check') then
    alter table public.invitations
      add constraint invitations_status_check check (status in ('pending', 'accepted', 'expired', 'revoked'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'shortlisted_providers_unique_provider') then
    alter table public.shortlisted_providers
      add constraint shortlisted_providers_unique_provider unique (family_case_id, provider_id);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'shortlisted_providers_status_check') then
    alter table public.shortlisted_providers
      add constraint shortlisted_providers_status_check
      check (status in ('considering', 'contacted', 'tour_booked', 'visited', 'rejected', 'preferred'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_tasks_status_check') then
    alter table public.family_tasks
      add constraint family_tasks_status_check check (status in ('todo', 'in_progress', 'done'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_tasks_category_check') then
    alter table public.family_tasks
      add constraint family_tasks_category_check
      check (category in ('my_aged_care', 'provider_call', 'tour', 'financial', 'documents', 'family_discussion', 'urgent', 'general'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'family_notes_type_check') then
    alter table public.family_notes
      add constraint family_notes_type_check
      check (note_type in ('provider_call', 'tour', 'financial', 'my_aged_care', 'family_discussion', 'hospital_discharge', 'general'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_star_rating_check') then
    alter table public.providers
      add constraint providers_star_rating_check check (star_rating >= 0 and star_rating <= 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_compliance_rating_check') then
    alter table public.providers
      add constraint providers_compliance_rating_check check (compliance_rating >= 0 and compliance_rating <= 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_staffing_rating_check') then
    alter table public.providers
      add constraint providers_staffing_rating_check check (staffing_rating >= 0 and staffing_rating <= 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_resident_experience_rating_check') then
    alter table public.providers
      add constraint providers_resident_experience_rating_check check (resident_experience_rating >= 0 and resident_experience_rating <= 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_quality_measures_rating_check') then
    alter table public.providers
      add constraint providers_quality_measures_rating_check check (quality_measures_rating >= 0 and quality_measures_rating <= 5);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_estimated_rad_check') then
    alter table public.providers
      add constraint providers_estimated_rad_check check (estimated_rad >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'providers_estimated_dap_check') then
    alter table public.providers
      add constraint providers_estimated_dap_check check (estimated_dap >= 0);
  end if;
end
$$;

create index if not exists family_cases_created_by_idx on public.family_cases(created_by);
create index if not exists family_members_family_case_idx on public.family_members(family_case_id);
create index if not exists family_members_user_idx on public.family_members(user_id);
create index if not exists invitations_token_idx on public.invitations(token);
create index if not exists invitations_family_case_status_idx on public.invitations(family_case_id, status);
create index if not exists assessment_sessions_family_case_idx on public.assessment_sessions(family_case_id, created_at desc);
create index if not exists shortlisted_providers_family_case_idx on public.shortlisted_providers(family_case_id, updated_at desc);
create index if not exists family_tasks_family_case_idx on public.family_tasks(family_case_id, created_at desc);
create index if not exists family_notes_family_case_idx on public.family_notes(family_case_id, created_at desc);
create index if not exists providers_published_idx on public.providers(is_published);
create index if not exists resource_articles_published_idx on public.resource_articles(is_published);
create index if not exists resource_articles_slug_idx on public.resource_articles(slug);

-- ---------------------------------------------------------------------------
-- Triggers and helper functions
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'family_user'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name, role)
select
  users.id,
  users.email,
  users.raw_user_meta_data ->> 'full_name',
  'family_user'
from auth.users
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  updated_at = now();

create or replace function public.add_family_case_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.family_members (family_case_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (family_case_id, user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists add_family_case_owner_after_insert on public.family_cases;
create trigger add_family_case_owner_after_insert
after insert on public.family_cases
for each row execute function public.add_family_case_owner();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_family_cases_updated_at on public.family_cases;
create trigger set_family_cases_updated_at before update on public.family_cases
for each row execute function public.set_updated_at();

drop trigger if exists set_shortlisted_providers_updated_at on public.shortlisted_providers;
create trigger set_shortlisted_providers_updated_at before update on public.shortlisted_providers
for each row execute function public.set_updated_at();

drop trigger if exists set_family_tasks_updated_at on public.family_tasks;
create trigger set_family_tasks_updated_at before update on public.family_tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_family_notes_updated_at on public.family_notes;
create trigger set_family_notes_updated_at before update on public.family_notes
for each row execute function public.set_updated_at();

drop trigger if exists set_providers_updated_at on public.providers;
create trigger set_providers_updated_at before update on public.providers
for each row execute function public.set_updated_at();

drop trigger if exists set_resource_articles_updated_at on public.resource_articles;
create trigger set_resource_articles_updated_at before update on public.resource_articles
for each row execute function public.set_updated_at();

create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = _user_id
      and role = 'admin'
  );
$$;

create or replace function public.is_family_case_member(_family_case_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_case_id = _family_case_id
      and user_id = _user_id
  );
$$;

create or replace function public.is_family_case_owner(_family_case_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_case_id = _family_case_id
      and user_id = _user_id
      and role = 'owner'
  );
$$;

create or replace function public.has_pending_invitation(_family_case_id uuid, _email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.invitations
    where family_case_id = _family_case_id
      and lower(invited_email) = lower(coalesce(_email, ''))
      and status = 'pending'
      and (expires_at is null or expires_at > now())
  );
$$;

create or replace function public.can_view_family_profile(_profile_id uuid, _viewer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    _profile_id = _viewer_id
    or exists (
      select 1
      from public.family_members viewer
      join public.family_members target
        on target.family_case_id = viewer.family_case_id
      where viewer.user_id = _viewer_id
        and target.user_id = _profile_id
    );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;
grant execute on function public.is_family_case_member(uuid, uuid) to authenticated;
grant execute on function public.is_family_case_owner(uuid, uuid) to authenticated;
grant execute on function public.has_pending_invitation(uuid, text) to authenticated;
grant execute on function public.can_view_family_profile(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.family_cases enable row level security;
alter table public.family_members enable row level security;
alter table public.invitations enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.shortlisted_providers enable row level security;
alter table public.family_tasks enable row level security;
alter table public.family_notes enable row level security;
alter table public.providers enable row level security;
alter table public.resource_articles enable row level security;

drop policy if exists profiles_select_visible on public.profiles;
create policy profiles_select_visible
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or public.can_view_family_profile(id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_cases_select_member on public.family_cases;
create policy family_cases_select_member
on public.family_cases for select
to authenticated
using (
  public.is_family_case_member(id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_cases_insert_creator on public.family_cases;
create policy family_cases_insert_creator
on public.family_cases for insert
to authenticated
with check (created_by = (select auth.uid()));

drop policy if exists family_cases_update_member on public.family_cases;
create policy family_cases_update_member
on public.family_cases for update
to authenticated
using (
  public.is_family_case_member(id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
)
with check (
  public.is_family_case_member(id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_cases_delete_owner on public.family_cases;
create policy family_cases_delete_owner
on public.family_cases for delete
to authenticated
using (
  public.is_family_case_owner(id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_members_select_case_member on public.family_members;
create policy family_members_select_case_member
on public.family_members for select
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_members_insert_invited_user on public.family_members;
create policy family_members_insert_invited_user
on public.family_members for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and (
    public.has_pending_invitation(family_case_id, (select auth.jwt() ->> 'email'))
    or public.is_family_case_owner(family_case_id, (select auth.uid()))
    or public.is_admin((select auth.uid()))
  )
);

drop policy if exists family_members_update_owner on public.family_members;
create policy family_members_update_owner
on public.family_members for update
to authenticated
using (
  public.is_family_case_owner(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
)
with check (
  public.is_family_case_owner(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_members_delete_owner on public.family_members;
create policy family_members_delete_owner
on public.family_members for delete
to authenticated
using (
  public.is_family_case_owner(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists invitations_select_member_or_invited on public.invitations;
create policy invitations_select_member_or_invited
on public.invitations for select
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or lower(invited_email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  or public.is_admin((select auth.uid()))
);

drop policy if exists invitations_insert_owner on public.invitations;
create policy invitations_insert_owner
on public.invitations for insert
to authenticated
with check (
  invited_by = (select auth.uid())
  and public.is_family_case_owner(family_case_id, (select auth.uid()))
);

drop policy if exists invitations_update_owner_or_invited on public.invitations;
create policy invitations_update_owner_or_invited
on public.invitations for update
to authenticated
using (
  public.is_family_case_owner(family_case_id, (select auth.uid()))
  or lower(invited_email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  or public.is_admin((select auth.uid()))
)
with check (
  public.is_family_case_owner(family_case_id, (select auth.uid()))
  or lower(invited_email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  or public.is_admin((select auth.uid()))
);

drop policy if exists invitations_delete_owner on public.invitations;
create policy invitations_delete_owner
on public.invitations for delete
to authenticated
using (
  public.is_family_case_owner(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists assessment_sessions_select_member on public.assessment_sessions;
create policy assessment_sessions_select_member
on public.assessment_sessions for select
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists assessment_sessions_insert_member on public.assessment_sessions;
create policy assessment_sessions_insert_member
on public.assessment_sessions for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_family_case_member(family_case_id, (select auth.uid()))
);

drop policy if exists shortlisted_providers_select_member on public.shortlisted_providers;
create policy shortlisted_providers_select_member
on public.shortlisted_providers for select
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists shortlisted_providers_insert_member on public.shortlisted_providers;
create policy shortlisted_providers_insert_member
on public.shortlisted_providers for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_family_case_member(family_case_id, (select auth.uid()))
);

drop policy if exists shortlisted_providers_update_member on public.shortlisted_providers;
create policy shortlisted_providers_update_member
on public.shortlisted_providers for update
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
)
with check (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists shortlisted_providers_delete_member on public.shortlisted_providers;
create policy shortlisted_providers_delete_member
on public.shortlisted_providers for delete
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_tasks_select_member on public.family_tasks;
create policy family_tasks_select_member
on public.family_tasks for select
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_tasks_insert_member on public.family_tasks;
create policy family_tasks_insert_member
on public.family_tasks for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and public.is_family_case_member(family_case_id, (select auth.uid()))
);

drop policy if exists family_tasks_update_member on public.family_tasks;
create policy family_tasks_update_member
on public.family_tasks for update
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
)
with check (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_tasks_delete_member on public.family_tasks;
create policy family_tasks_delete_member
on public.family_tasks for delete
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_notes_select_member on public.family_notes;
create policy family_notes_select_member
on public.family_notes for select
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists family_notes_insert_member on public.family_notes;
create policy family_notes_insert_member
on public.family_notes for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and public.is_family_case_member(family_case_id, (select auth.uid()))
);

drop policy if exists family_notes_delete_member on public.family_notes;
create policy family_notes_delete_member
on public.family_notes for delete
to authenticated
using (
  public.is_family_case_member(family_case_id, (select auth.uid()))
  or public.is_admin((select auth.uid()))
);

drop policy if exists providers_select_published_or_admin on public.providers;
create policy providers_select_published_or_admin
on public.providers for select
to anon, authenticated
using (
  is_published = true
  or public.is_admin((select auth.uid()))
);

drop policy if exists providers_insert_admin on public.providers;
create policy providers_insert_admin
on public.providers for insert
to authenticated
with check (public.is_admin((select auth.uid())));

drop policy if exists providers_update_admin on public.providers;
create policy providers_update_admin
on public.providers for update
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

drop policy if exists providers_delete_admin on public.providers;
create policy providers_delete_admin
on public.providers for delete
to authenticated
using (public.is_admin((select auth.uid())));

drop policy if exists resource_articles_select_published_or_admin on public.resource_articles;
create policy resource_articles_select_published_or_admin
on public.resource_articles for select
to anon, authenticated
using (
  is_published = true
  or public.is_admin((select auth.uid()))
);

drop policy if exists resource_articles_insert_admin on public.resource_articles;
create policy resource_articles_insert_admin
on public.resource_articles for insert
to authenticated
with check (public.is_admin((select auth.uid())));

drop policy if exists resource_articles_update_admin on public.resource_articles;
create policy resource_articles_update_admin
on public.resource_articles for update
to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

drop policy if exists resource_articles_delete_admin on public.resource_articles;
create policy resource_articles_delete_admin
on public.resource_articles for delete
to authenticated
using (public.is_admin((select auth.uid())));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.profiles to authenticated;

grant select, insert, update, delete on public.family_cases to authenticated;
grant select, insert, update, delete on public.family_members to authenticated;
grant select, insert, update, delete on public.invitations to authenticated;
grant select, insert, update, delete on public.assessment_sessions to authenticated;
grant select, insert, update, delete on public.shortlisted_providers to authenticated;
grant select, insert, update, delete on public.family_tasks to authenticated;
grant select, insert, update, delete on public.family_notes to authenticated;

grant select on public.providers to anon, authenticated;
grant insert, update, delete on public.providers to authenticated;
grant select on public.resource_articles to anon, authenticated;
grant insert, update, delete on public.resource_articles to authenticated;

-- ---------------------------------------------------------------------------
-- Manual admin setup
-- ---------------------------------------------------------------------------
-- After signing up with your own account, run this with your real email:
--
-- update public.profiles
-- set role = 'admin'
-- where email = 'your-email@example.com';
