-- HUB: reusable member book shelves.
-- Run once after 20260715000000_initial_schema.sql.

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  author text not null default '' check (char_length(author) <= 120),
  status text not null default 'reading' check (status in ('planned', 'reading', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists books_owner_title_author_idx
on public.books (user_id, lower(title), lower(author));

create index if not exists books_user_status_idx on public.books (user_id, status);

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
before update on public.books
for each row execute function public.set_updated_at();

alter table public.reading_notes
add column book_id uuid references public.books(id) on delete restrict;

create index if not exists reading_notes_book_id_idx on public.reading_notes (book_id);

alter table public.books enable row level security;

drop policy if exists "Members can view books" on public.books;
create policy "Members can view books"
on public.books for select to authenticated
using (true);

drop policy if exists "Members can create their books" on public.books;
create policy "Members can create their books"
on public.books for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Members can update their books" on public.books;
create policy "Members can update their books"
on public.books for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Members can delete their books" on public.books;
create policy "Members can delete their books"
on public.books for delete to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.books to authenticated;

-- A note may only reference a book on its author's own shelf.
drop policy if exists "Members can create notes" on public.reading_notes;
create policy "Members can create notes"
on public.reading_notes for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and book_id is not null
  and exists (
    select 1 from public.books
    where books.id = reading_notes.book_id
      and books.user_id = (select auth.uid())
  )
);

drop policy if exists "Members can update their notes" on public.reading_notes;
create policy "Members can update their notes"
on public.reading_notes for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and book_id is not null
  and exists (
    select 1 from public.books
    where books.id = reading_notes.book_id
      and books.user_id = (select auth.uid())
  )
);
