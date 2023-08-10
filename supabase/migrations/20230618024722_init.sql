create table if not exists theaters (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  user_id uuid references auth.users default auth.uid()
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table theaters
  enable row level security;

create policy "Authenticated users can select theaters" on theaters
  for select to authenticated using (true);

create policy "Authenticated users can insert their own theaters" on theaters
  for insert to authenticated with check (auth.uid() = user_id);
