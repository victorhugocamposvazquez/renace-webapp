-- RENACE — esquema inicial
-- Convenciones:
--   * Toda tabla con datos privados lleva user_id y RLS estricta = auth.uid().
--   * Tablas de catálogo (job_offers, live_events) permiten SELECT a authenticated.
--   * Las claves primarias son uuid v4 generadas por gen_random_uuid().

create extension if not exists "pgcrypto";

-- =========================================================================
-- profiles (1-1 con auth.users)
-- =========================================================================
create type public.area_id as enum (
  'emocional',
  'fisica',
  'juridica',
  'laboral',
  'comunidad'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  alias text not null check (char_length(alias) between 1 and 60),
  area_focus public.area_id[] not null default array['emocional','fisica']::public.area_id[],
  aria_name text not null default 'Aria' check (char_length(aria_name) between 1 and 30),
  aria_persist boolean not null default false,
  day_in_program int not null default 1 check (day_in_program >= 1),
  city text,
  age int check (age is null or (age between 14 and 110)),
  is_mentor boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Perfil del usuario. id = auth.users.id';

-- =========================================================================
-- mood_logs
-- =========================================================================
create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now()
);
create index mood_logs_user_created_idx on public.mood_logs (user_id, created_at desc);

-- =========================================================================
-- journal_entries
-- =========================================================================
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 5000),
  sentiment text check (sentiment in ('positive','neutral','negative','mixed')),
  created_at timestamptz not null default now()
);
create index journal_entries_user_created_idx on public.journal_entries (user_id, created_at desc);

-- =========================================================================
-- triggers (disparadores de recaída)
-- =========================================================================
create table public.triggers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 80),
  severity smallint not null default 2 check (severity between 1 and 3),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index triggers_user_idx on public.triggers (user_id, severity desc);

-- =========================================================================
-- area_progress (1 fila por usuario y area)
-- =========================================================================
create table public.area_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  area public.area_id not null,
  percent smallint not null default 0 check (percent between 0 and 100),
  status text not null default 'on_track' check (status in ('on_track','attention','blocked','done')),
  updated_at timestamptz not null default now(),
  primary key (user_id, area)
);

-- =========================================================================
-- legal_cases (un caso abierto por usuario máx; permitimos varios y filtramos en query)
-- =========================================================================
create table public.legal_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  lawyer_name text,
  next_meeting_at timestamptz,
  created_at timestamptz not null default now()
);
create index legal_cases_user_idx on public.legal_cases (user_id, status);

-- =========================================================================
-- consult_requests (formulario "Solicitar consulta")
-- =========================================================================
create type public.consult_category as enum (
  'debt',
  'custody',
  'complaint',
  'aid',
  'docs',
  'other'
);

create table public.consult_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category public.consult_category not null,
  body text not null check (char_length(body) between 5 and 2000),
  status text not null default 'submitted' check (status in ('submitted','reviewing','scheduled','closed')),
  created_at timestamptz not null default now()
);
create index consult_requests_user_idx on public.consult_requests (user_id, created_at desc);

-- =========================================================================
-- Catálogo: cursos y ofertas
-- =========================================================================
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  hours_min smallint not null,
  hours_max smallint not null,
  exit_market text not null,
  demand text not null check (demand in ('alta','muy_alta','transversal')),
  format text not null default 'pdf',
  emoji text,
  description text
);

create table public.job_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  match_score smallint not null default 70 check (match_score between 0 and 100),
  partner_company boolean not null default false,
  schedule text default 'jornada_completa',
  created_at timestamptz not null default now()
);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  offer_id uuid not null references public.job_offers(id) on delete cascade,
  status text not null default 'interested' check (status in ('interested','applied','interview','rejected','hired')),
  created_at timestamptz not null default now(),
  unique (user_id, offer_id)
);

-- =========================================================================
-- Comunidad
-- =========================================================================
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);
create index community_posts_created_idx on public.community_posts (created_at desc);

create type public.reaction_kind as enum ('like','comment_count');

create table public.community_reactions (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind public.reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, kind)
);

-- =========================================================================
-- Live events
-- =========================================================================
create table public.live_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default 'support_group' check (kind in ('support_group','class','workshop','sport')),
  starts_at timestamptz not null,
  capacity smallint not null default 50,
  description text
);

create table public.event_attendees (
  event_id uuid not null references public.live_events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- =========================================================================
-- Timeline / recorrido
-- =========================================================================
create table public.timeline_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week smallint not null,
  title text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','done')),
  order_index smallint not null default 0,
  created_at timestamptz not null default now()
);
create index timeline_user_order_idx on public.timeline_milestones (user_id, order_index);

-- =========================================================================
-- Aria messages (opt-in persistence)
-- =========================================================================
create table public.aria_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
create index aria_messages_user_created_idx on public.aria_messages (user_id, created_at desc);

-- =========================================================================
-- Trusted contacts (SOS)
-- =========================================================================
create table public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  relation text,
  created_at timestamptz not null default now()
);
create index trusted_contacts_user_idx on public.trusted_contacts (user_id);

-- =========================================================================
-- Trigger: updated_at automático en profiles
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- Auto-crear profile vacío al registrar un usuario
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, alias)
  values (new.id, coalesce(split_part(new.email, '@', 1), 'Usuario'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
