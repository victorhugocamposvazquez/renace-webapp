-- RENACE — extensión del catálogo de formación
-- - courses: ahora soporta área, formato live-class y metadatos visuales
-- - course_enrollments: tracking de progreso por usuario (continuar viendo)
-- - reminders: integrados en course_enrollments con `reminder_set`
-- - Triggers para mantener last_seen_at coherente y limitar inscripciones a
--   cursos del area_focus del usuario (opcional: no aplicado, permitimos libre).

-- =========================================================================
-- 1. Extender courses
-- =========================================================================
alter table public.courses
  add column if not exists area public.area_id not null default 'laboral',
  add column if not exists kind text not null default 'course'
    check (kind in ('course','live_class')),
  add column if not exists instructor_name text,
  add column if not exists instructor_role text,
  add column if not exists accent_color text not null default '#0A8554',
  add column if not exists total_minutes int not null default 60
    check (total_minutes between 5 and 100000),
  add column if not exists lessons_count smallint not null default 1
    check (lessons_count between 1 and 200),
  add column if not exists starts_at timestamptz;

create index if not exists courses_area_kind_idx on public.courses (area, kind);
create index if not exists courses_starts_at_idx on public.courses (starts_at)
  where kind = 'live_class';

-- =========================================================================
-- 2. course_enrollments (continuar viendo + recordatorios)
-- =========================================================================
create table if not exists public.course_enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  progress_percent smallint not null default 0
    check (progress_percent between 0 and 100),
  current_lesson smallint not null default 0
    check (current_lesson >= 0),
  enrolled_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  completed_at timestamptz,
  reminder_set boolean not null default false,
  primary key (user_id, course_id)
);

create index if not exists course_enrollments_user_last_seen_idx
  on public.course_enrollments (user_id, last_seen_at desc);

-- =========================================================================
-- 3. RLS
-- =========================================================================
alter table public.course_enrollments enable row level security;

drop policy if exists "course_enrollments_select_own" on public.course_enrollments;
drop policy if exists "course_enrollments_insert_own" on public.course_enrollments;
drop policy if exists "course_enrollments_update_own" on public.course_enrollments;
drop policy if exists "course_enrollments_delete_own" on public.course_enrollments;

create policy "course_enrollments_select_own"
  on public.course_enrollments for select to authenticated
  using (user_id = auth.uid());

create policy "course_enrollments_insert_own"
  on public.course_enrollments for insert to authenticated
  with check (user_id = auth.uid());

create policy "course_enrollments_update_own"
  on public.course_enrollments for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "course_enrollments_delete_own"
  on public.course_enrollments for delete to authenticated
  using (user_id = auth.uid());
