-- RENACE — actividad piloto: logs unificados, antojos, activaciones de triggers

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (char_length(kind) between 1 and 40),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index activity_logs_user_created_idx on public.activity_logs (user_id, created_at desc);
create index activity_logs_user_kind_idx on public.activity_logs (user_id, kind);

create table public.craving_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  intensity smallint not null check (intensity between 1 and 5),
  note text check (note is null or char_length(note) <= 500),
  trigger_id uuid references public.triggers(id) on delete set null,
  created_at timestamptz not null default now()
);
create index craving_logs_user_created_idx on public.craving_logs (user_id, created_at desc);

create table public.trigger_activations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trigger_id uuid not null references public.triggers(id) on delete cascade,
  intensity smallint check (intensity is null or intensity between 1 and 3),
  note text check (note is null or char_length(note) <= 300),
  created_at timestamptz not null default now()
);
create index trigger_activations_user_created_idx on public.trigger_activations (user_id, created_at desc);

-- RLS
alter table public.activity_logs enable row level security;
alter table public.craving_logs enable row level security;
alter table public.trigger_activations enable row level security;

create policy "activity_logs_select_own" on public.activity_logs
  for select to authenticated using (user_id = auth.uid());
create policy "activity_logs_insert_own" on public.activity_logs
  for insert to authenticated with check (user_id = auth.uid());
create policy "activity_logs_delete_own" on public.activity_logs
  for delete to authenticated using (user_id = auth.uid());

create policy "craving_logs_select_own" on public.craving_logs
  for select to authenticated using (user_id = auth.uid());
create policy "craving_logs_insert_own" on public.craving_logs
  for insert to authenticated with check (user_id = auth.uid());

create policy "trigger_activations_select_own" on public.trigger_activations
  for select to authenticated using (user_id = auth.uid());
create policy "trigger_activations_insert_own" on public.trigger_activations
  for insert to authenticated with check (user_id = auth.uid());

-- Perfil piloto: motivos de onboarding para copy de racha
alter table public.profiles
  add column if not exists onboarding_reasons text[] not null default '{}'::text[];

comment on column public.profiles.onboarding_reasons is
  'Motivos elegidos en onboarding (adiccion, no-recaer, etc.) para personalizar copy.';
