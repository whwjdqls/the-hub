-- HUB: durable weekly submitted, late, and exempt outcomes.
-- Run once after 20260715010000_add_books.sql.

alter table public.weekly_checkins
add column if not exists note_status text not null default 'pending',
add column if not exists comments_status text not null default 'pending',
add column if not exists note_submitted_at timestamptz,
add column if not exists comments_completed_at timestamptz;

update public.weekly_checkins
set
  note_status = case when note_submitted then 'submitted' else note_status end,
  comments_status = case when comments_completed then 'submitted' else comments_status end;

alter table public.weekly_checkins
drop constraint if exists weekly_checkins_note_status_check;
alter table public.weekly_checkins
add constraint weekly_checkins_note_status_check
check (note_status in ('pending', 'submitted', 'late', 'exempt'));

alter table public.weekly_checkins
drop constraint if exists weekly_checkins_comments_status_check;
alter table public.weekly_checkins
add constraint weekly_checkins_comments_status_check
check (comments_status in ('pending', 'submitted', 'late', 'exempt'));
