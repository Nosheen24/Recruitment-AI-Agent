-- Run this entire file in your Supabase project:
-- Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run — all statements use IF NOT EXISTS / IF EXISTS guards.

-- ── Users ─────────────────────────────────────────────────────────────────────
create table if not exists users (
    id            uuid        primary key default gen_random_uuid(),
    created_at    timestamptz default now(),
    email         text        unique not null,
    password_hash text        not null,
    name          text        not null default ''
);

create index if not exists users_email_idx on users (email);

-- ── Analyses ──────────────────────────────────────────────────────────────────
create table if not exists analyses (
    id           uuid        primary key default gen_random_uuid(),
    created_at   timestamptz default now(),
    user_id      uuid        references users(id) on delete cascade,
    filename     text,
    mode         text        default 'ats',
    score        int,
    selected     boolean,
    strengths    text[],
    weaknesses   text[],
    total_skills int
);

create index if not exists analyses_user_id_idx on analyses (user_id);

-- ── HR Sessions ───────────────────────────────────────────────────────────────
create table if not exists hr_sessions (
    id         uuid        primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    user_id    uuid        not null references users(id) on delete cascade,
    name       text        not null,
    jd_text    text        default '',
    results    jsonb       not null default '{}'
);

create index if not exists hr_sessions_user_id_idx on hr_sessions (user_id);

-- ── Chat Messages ─────────────────────────────────────────────────────────────
create table if not exists chat_messages (
    id          uuid        primary key default gen_random_uuid(),
    created_at  timestamptz default now(),
    session_id  text        not null,
    role        text        check (role in ('user', 'bot')) not null,
    content     text        not null
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- The FastAPI backend uses the service role key, which bypasses RLS.
-- Policies below protect direct client access.

alter table users         enable row level security;
alter table analyses      enable row level security;
alter table hr_sessions   enable row level security;
alter table chat_messages enable row level security;

-- Users: no direct client access (backend-only via service key)
drop policy if exists "users_service_only" on users;

-- Analyses: users can see their own
drop policy if exists "allow_insert_analyses" on analyses;
drop policy if exists "allow_select_analyses" on analyses;
create policy "analyses_insert" on analyses for insert with check (true);
create policy "analyses_select" on analyses for select using (true);

-- HR Sessions: users can see and insert their own
drop policy if exists "hr_sessions_insert" on hr_sessions;
drop policy if exists "hr_sessions_select" on hr_sessions;
create policy "hr_sessions_insert" on hr_sessions for insert with check (true);
create policy "hr_sessions_select" on hr_sessions for select using (true);

-- Chat messages
drop policy if exists "allow_insert_chat_messages" on chat_messages;
drop policy if exists "allow_select_chat_messages" on chat_messages;
create policy "chat_insert" on chat_messages for insert with check (true);
create policy "chat_select" on chat_messages for select using (true);
