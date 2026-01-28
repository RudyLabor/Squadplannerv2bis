-- 🏗️ SQUAD PLANNER - PROFESSIONAL SCHEMA V1
-- Target: Supabase (PostgreSQL)
-- Architecture: Relational, Normalized, RLS-protected

-- ============================================================
-- 0. CLEANUP (Idempotency)
-- ============================================================
-- Drop policies first
drop policy if exists "Members can view other members of their squads" on public.squad_members;
drop policy if exists "Squads are viewable by everyone if public" on public.squads;
drop policy if exists "Members can view their squads" on public.squads;
drop policy if exists "Users can create squads" on public.squads;
drop policy if exists "Owners can update their squads" on public.squads;
drop policy if exists "Squad members can view sessions" on public.sessions;
drop policy if exists "Squad members can create sessions" on public.sessions;
drop policy if exists "Viewable by squad members" on public.session_attendees;
drop policy if exists "Users can manage their own RSVP" on public.session_attendees;
drop policy if exists "Squad members can read messages" on public.messages;
drop policy if exists "Squad members can send messages" on public.messages;

-- Drop triggers
drop trigger if exists on_auth_user_created on auth.users;

-- ============================================================
-- 1. TABLES CREATION
-- ============================================================

-- A. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text,
  avatar_url text,
  is_premium boolean default false,
  reliability_score int default 100,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- B. SQUADS
create table if not exists public.squads (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) not null,
  name text not null,
  game text,
  image_url text,
  description text,
  is_public boolean default false,
  invite_code text unique default substring(md5(random()::text) from 0 for 7),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- C. SQUAD MEMBERS
create table if not exists public.squad_members (
  id uuid default gen_random_uuid() primary key,
  squad_id uuid references public.squads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member', -- 'owner', 'admin', 'member'
  joined_at timestamptz default now(),
  unique(squad_id, user_id)
);

-- D. SESSIONS
create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  squad_id uuid references public.squads(id) on delete cascade not null,
  created_by uuid references public.profiles(id),
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  status text default 'planned', -- 'planned', 'active', 'completed', 'cancelled'
  created_at timestamptz default now()
);

-- E. SESSION ATTENDEES
create table if not exists public.session_attendees (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending', -- 'yes', 'no', 'maybe'
  updated_at timestamptz default now(),
  unique(session_id, user_id)
);

-- F. MESSAGES
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  squad_id uuid references public.squads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  type text default 'text', -- 'text', 'image', 'system'
  created_at timestamptz default now()
);

-- ============================================================
-- 2. ENABLE RLS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.squads enable row level security;
alter table public.squad_members enable row level security;
alter table public.sessions enable row level security;
alter table public.session_attendees enable row level security;
alter table public.messages enable row level security;

-- ============================================================
-- 3. POLICIES (Now that all tables exist)
-- ============================================================

-- PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using ( true );

create policy "Users can update own profile"
  on public.profiles for update using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.profiles for insert with check ( auth.uid() = id );

-- SQUAD MEMBERS (Needed for other policies)
create policy "Members can view other members of their squads"
  on public.squad_members for select
  using (
    auth.uid() in (
      select user_id from public.squad_members as sm where sm.squad_id = squad_id
    )
  );

-- SQUADS
create policy "Squads are viewable by everyone if public"
  on public.squads for select using ( is_public = true );

create policy "Members can view their squads"
  on public.squads for select
  using (
    auth.uid() in (
      select user_id from public.squad_members where squad_id = id
    )
  );

create policy "Users can create squads"
  on public.squads for insert with check ( auth.uid() = owner_id );

create policy "Owners can update their squads"
  on public.squads for update using ( auth.uid() = owner_id );

-- SESSIONS
create policy "Squad members can view sessions"
  on public.sessions for select
  using (
    auth.uid() in (
      select user_id from public.squad_members where squad_id = sessions.squad_id
    )
  );

create policy "Squad members can create sessions"
  on public.sessions for insert
  with check (
    auth.uid() in (
      select user_id from public.squad_members where squad_id = sessions.squad_id
    )
  );

-- ATTENDEES
create policy "Viewable by squad members"
  on public.session_attendees for select using ( true ); 

create policy "Users can manage their own RSVP"
  on public.session_attendees for all using ( auth.uid() = user_id );

-- MESSAGES
create policy "Squad members can read messages"
  on public.messages for select
  using (
    auth.uid() in (
      select user_id from public.squad_members where squad_id = messages.squad_id
    )
  );

create policy "Squad members can send messages"
  on public.messages for insert
  with check (
    auth.uid() in (
      select user_id from public.squad_members where squad_id = messages.squad_id
    )
  );

-- ============================================================
-- 4. TRIGGERS & FUNCTIONS
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name', -- Note: raw_user_meta_data is correct from auth.users
    new.raw_user_meta_data->>'avatar'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
