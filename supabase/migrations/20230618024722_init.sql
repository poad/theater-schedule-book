-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

create extension if not exists "uuid-ossp";

create table if not exists
  theaters (
    id uuid default gen_random_uuid () primary key,
    name text not null unique,
    user_id uuid references auth.users default auth.uid ()
  );

create table if not exists
  casts (
    id uuid  default gen_random_uuid () primary key,
    name text not null,
    role text not null,
    user_id uuid references auth.users default auth.uid ()
  );

create table if not exists
  shows (
    id uuid  default gen_random_uuid () primary key,
    show_date bigint not null unique,
    theater_id uuid not null references theaters on delete cascade,
    user_id uuid references auth.users default auth.uid ()
  );

create table if not exists
  titles (
    id uuid  default gen_random_uuid () primary key,
    name text not null,
    year smallint not null,
    url text,
    constraint titles_unique_key unique (name, year),
    user_id uuid references auth.users default auth.uid ()
  );

-- join table
create table if not exists
  titles_shows (
    title_id uuid not null references titles,
    show_id uuid not null references shows,
    user_id uuid references auth.users default auth.uid (),
    -- both foreign keys must be part of a composite primary key
    primary key (title_id, show_id),
  );

create table if not exists
  shows_casts (
    show_id uuid not null references shows,
    cast_id uuid not null references casts,
    user_id uuid references auth.users default auth.uid (),
    -- both foreign keys must be part of a composite primary key
    primary key (show_id, cast_id)
  );

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table theaters enable row level security;

create policy "Authenticated users can select theaters" on theaters for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own theaters" on theaters for insert to authenticated
with
  check (auth.uid () = user_id);

alter table titles enable row level security;

create policy "Authenticated users can select titles" on titles for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own titles" on titles for insert to authenticated
with
  check (auth.uid () = user_id);

create policy "Authenticated users can update titles" on titles for
update
  to authenticated using (true);

create policy "Authenticated users can delete titles" on titles for
delete
  to authenticated using (true);


alter table shows enable row level security;

create policy "Authenticated users can select shows" on shows for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own shows" on shows for insert to authenticated
with
  check (auth.uid () = user_id);

create policy "Authenticated users can update shows" on shows for
update
  to authenticated using (true);

create policy "Authenticated users can delete shows" on shows for
delete
  to authenticated using (true);

alter table casts enable row level security;

create policy "Authenticated users can select casts" on casts for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own casts" on casts for insert to authenticated
with
  check (auth.uid () = user_id);

create policy "Authenticated users can update casts" on casts for
update
  to authenticated using (true);

create policy "Authenticated users can delete casts" on casts for
delete
  to authenticated using (true);


alter table titles_shows enable row level security;
create policy "Authenticated users can select titles_shows" on titles_shows for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own titles_shows" on titles_shows for insert to authenticated
with
  check (auth.uid () = user_id);

create policy "Authenticated users can update titles_shows" on titles_shows for
update
  to authenticated using (true);

create policy "Authenticated users can delete titles_shows" on titles_shows for
delete
  to authenticated using (true);

alter table shows_casts enable row level security;
create policy "Authenticated users can select shows_casts" on shows_casts for
select
  to authenticated using (true);

create policy "Authenticated users can insert their own shows_casts" on shows_casts for insert to authenticated
with
  check (auth.uid () = user_id);

create policy "Authenticated users can update casts" on shows_casts for
update
  to authenticated using (true);

create policy "Authenticated users can delete casts" on shows_casts for
delete
  to authenticated using (true);
