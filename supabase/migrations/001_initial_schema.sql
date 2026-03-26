-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- HABITS
-- ─────────────────────────────────────────────
create table if not exists public.habits (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  color      text not null default '#22d3ee',
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Users can view own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- LOGS
-- ─────────────────────────────────────────────
create table if not exists public.logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_id    uuid not null references public.habits(id) on delete cascade,
  logged_date date not null default current_date,
  notes       text,
  created_at  timestamptz not null default now(),
  -- Enforce that logs can only be inserted for today
  constraint logs_date_is_today check (logged_date = current_date)
);

alter table public.logs enable row level security;

create policy "Users can view own logs"
  on public.logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on public.logs for insert
  with check (auth.uid() = user_id and logged_date = current_date);

create policy "Users can delete own logs"
  on public.logs for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
