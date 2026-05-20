-- RENACE — políticas RLS

-- Activar RLS en todas las tablas
alter table public.profiles            enable row level security;
alter table public.mood_logs           enable row level security;
alter table public.journal_entries     enable row level security;
alter table public.triggers            enable row level security;
alter table public.area_progress       enable row level security;
alter table public.legal_cases         enable row level security;
alter table public.consult_requests    enable row level security;
alter table public.courses             enable row level security;
alter table public.job_offers          enable row level security;
alter table public.job_applications    enable row level security;
alter table public.community_posts     enable row level security;
alter table public.community_reactions enable row level security;
alter table public.live_events         enable row level security;
alter table public.event_attendees     enable row level security;
alter table public.timeline_milestones enable row level security;
alter table public.aria_messages       enable row level security;
alter table public.trusted_contacts    enable row level security;

-- ----------------------------------------------------------------------
-- profiles: el dueño lee/escribe su perfil; lectura pública limitada
-- ----------------------------------------------------------------------
create policy "profiles_select_self"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- ----------------------------------------------------------------------
-- Macro: tablas privadas por user_id
-- ----------------------------------------------------------------------
do $$
declare
  t text;
  private_tables text[] := array[
    'mood_logs',
    'journal_entries',
    'triggers',
    'area_progress',
    'legal_cases',
    'consult_requests',
    'job_applications',
    'timeline_milestones',
    'aria_messages',
    'trusted_contacts'
  ];
begin
  foreach t in array private_tables loop
    execute format($f$
      create policy "%I_select_own" on public.%I
        for select to authenticated using (user_id = auth.uid());
      create policy "%I_insert_own" on public.%I
        for insert to authenticated with check (user_id = auth.uid());
      create policy "%I_update_own" on public.%I
        for update to authenticated using (user_id = auth.uid())
        with check (user_id = auth.uid());
      create policy "%I_delete_own" on public.%I
        for delete to authenticated using (user_id = auth.uid());
    $f$, t, t, t, t, t, t, t, t);
  end loop;
end$$;

-- ----------------------------------------------------------------------
-- courses: catálogo público para autenticados (no mutable desde la app)
-- ----------------------------------------------------------------------
create policy "courses_select_all"
  on public.courses for select
  to authenticated
  using (true);

-- ----------------------------------------------------------------------
-- job_offers: catálogo público para autenticados
-- ----------------------------------------------------------------------
create policy "job_offers_select_all"
  on public.job_offers for select
  to authenticated
  using (true);

-- ----------------------------------------------------------------------
-- live_events: catálogo público para autenticados
-- ----------------------------------------------------------------------
create policy "live_events_select_all"
  on public.live_events for select
  to authenticated
  using (true);

-- ----------------------------------------------------------------------
-- event_attendees: cualquiera autenticado lee (asistencias visibles),
-- pero solo cada uno se apunta y borra a sí mismo
-- ----------------------------------------------------------------------
create policy "event_attendees_select_all"
  on public.event_attendees for select
  to authenticated
  using (true);

create policy "event_attendees_insert_own"
  on public.event_attendees for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "event_attendees_delete_own"
  on public.event_attendees for delete
  to authenticated
  using (user_id = auth.uid());

-- ----------------------------------------------------------------------
-- community_posts: autenticados leen todo, solo el autor edita/borra
-- ----------------------------------------------------------------------
create policy "community_posts_select_all"
  on public.community_posts for select
  to authenticated
  using (true);

create policy "community_posts_insert_own"
  on public.community_posts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "community_posts_update_own"
  on public.community_posts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "community_posts_delete_own"
  on public.community_posts for delete
  to authenticated
  using (user_id = auth.uid());

-- ----------------------------------------------------------------------
-- community_reactions: leen todos, solo el dueño reacciona y deshace
-- ----------------------------------------------------------------------
create policy "community_reactions_select_all"
  on public.community_reactions for select
  to authenticated
  using (true);

create policy "community_reactions_insert_own"
  on public.community_reactions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "community_reactions_delete_own"
  on public.community_reactions for delete
  to authenticated
  using (user_id = auth.uid());
