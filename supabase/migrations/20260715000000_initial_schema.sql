-- HUB: authentication profiles, weekly status, monthly passes, notes, and comments.
-- Run this migration in the Supabase SQL editor before enabling production auth.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 30),
  role text not null default 'Member' check (char_length(role) between 2 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null check (extract(isodow from week_start) = 1),
  note_submitted boolean not null default false,
  comments_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.monthly_passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  month_start date not null check (month_start = date_trunc('month', month_start)::date),
  week_start date not null check (extract(isodow from week_start) = 1),
  used_at timestamptz not null default now(),
  unique (user_id, month_start)
);

create table public.reading_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null check (extract(isodow from week_start) = 1),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null default '',
  body text not null,
  book_title text not null default '',
  book_author text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.reading_notes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index weekly_checkins_week_start_idx on public.weekly_checkins (week_start);
create index monthly_passes_month_start_idx on public.monthly_passes (month_start);
create index reading_notes_week_start_idx on public.reading_notes (week_start);
create index comments_note_id_idx on public.comments (note_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger weekly_checkins_set_updated_at
before update on public.weekly_checkins
for each row execute function public.set_updated_at();

create trigger reading_notes_set_updated_at
before update on public.reading_notes
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
begin
  -- Serialize signups so concurrent requests cannot exceed the five-member limit.
  perform pg_advisory_xact_lock(hashtext('hub-profile-capacity'));
  if (select count(*) from public.profiles) >= 5 then
    raise exception using message = 'This HUB workspace already has five members.';
  end if;

  requested_name := trim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  if char_length(requested_name) < 2 then
    requested_name := split_part(coalesce(new.email, 'Member'), '@', 1);
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, left(requested_name, 30));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.weekly_checkins enable row level security;
alter table public.monthly_passes enable row level security;
alter table public.reading_notes enable row level security;
alter table public.comments enable row level security;

create policy "Members can view profiles"
on public.profiles for select to authenticated
using (true);

create policy "Members can update their profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Members can view weekly checkins"
on public.weekly_checkins for select to authenticated
using (true);

create policy "Members can create their weekly checkin"
on public.weekly_checkins for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Members can update their weekly checkin"
on public.weekly_checkins for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Members can view monthly passes"
on public.monthly_passes for select to authenticated
using (true);

create policy "Members can use their own monthly pass"
on public.monthly_passes for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Members can view notes"
on public.reading_notes for select to authenticated
using (true);

create policy "Members can create notes"
on public.reading_notes for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Members can update their notes"
on public.reading_notes for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Members can delete their notes"
on public.reading_notes for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Members can view comments"
on public.comments for select to authenticated
using (true);

create policy "Members can create comments"
on public.comments for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Members can update their comments"
on public.comments for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Members can delete their comments"
on public.comments for delete to authenticated
using ((select auth.uid()) = user_id);

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.weekly_checkins to authenticated;
grant select, insert on public.monthly_passes to authenticated;
grant select, insert, update, delete on public.reading_notes to authenticated;
grant select, insert, update, delete on public.comments to authenticated;
