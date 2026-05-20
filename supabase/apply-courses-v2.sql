-- =========================================================================
-- RENACE · Aplica cursos v2 + seed de catálogo en un solo paso.
-- Idempotente: puedes ejecutarlo varias veces sin riesgo.
--
-- Uso:
--   1. Abre tu proyecto Supabase → SQL Editor → New query.
--   2. Pega TODO este archivo.
--   3. Pulsa "Run" (Ctrl/Cmd + Enter).
-- =========================================================================

-- =========================================================================
-- PARTE 1 · Migración de schema
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

-- =========================================================================
-- PARTE 2 · Seed del catálogo (cursos y clases en directo)
-- =========================================================================

-- Cursos · LABORAL
insert into public.courses
  (slug, title, hours_min, hours_max, exit_market, demand, format, emoji,
   description, area, kind, instructor_name, instructor_role, accent_color,
   total_minutes, lessons_count)
values
  ('limpieza-profesional', 'Limpieza profesional', 8, 12,
   'Empresas de limpieza. Sector con vacantes constantes.', 'muy_alta', 'pdf', '🧹',
   'Técnicas de limpieza industrial, productos y protocolos, oficinas y comunidades.',
   'laboral', 'course', 'Marta Iglesias', 'Supervisora 10 años', '#E8A02E', 540, 8),
  ('alfabetizacion-digital', 'Alfabetización digital básica', 8, 10,
   'Cualquier empleo administrativo de entrada hoy lo exige.', 'transversal', 'pdf', '💻',
   'Móvil y correo electrónico, trámites online (SEPE, citas médicas), Google Docs y Word básico.',
   'laboral', 'course', 'Carlos Bermúdez', 'Formador digital', '#2563EB', 480, 6),
  ('jardineria-basica', 'Jardinería básica', 8, 12,
   'Ayuntamientos, contratas y comunidades de vecinos.', 'alta', 'pdf', '🌿',
   'Mantenimiento de jardines, uso de herramientas, riego y poda simple.',
   'laboral', 'course', 'Pedro Lousada', 'Jardinero municipal', '#22A06B', 600, 8),
  ('logistica-almacen', 'Logística y almacén', 10, 15,
   'Amazon, mensajería, distribución local.', 'muy_alta', 'pdf', '📦',
   'Preparación de pedidos · picking, gestión de stock básica, introducción a almacenes.',
   'laboral', 'course', 'Lucía Varela', 'Jefa de almacén', '#6F4FE8', 720, 10),
  ('carnet-carretillero', 'Carnet de carretillero', 12, 20,
   'Almacenes, industria, transporte. Habilita el carnet oficial.', 'muy_alta', 'pdf+examen', '🚛',
   'Manejo de carretilla elevadora, seguridad laboral básica.',
   'laboral', 'course', 'Roberto Mosqueira', 'Instructor oficial', '#DC2626', 960, 12),
  ('mantenimiento', 'Pequeñas reparaciones', 10, 14,
   'Multiservicios, perfil autónomo básico.', 'alta', 'pdf+practica', '🛠',
   'Pintura básica, montaje de muebles, reparaciones domésticas simples.',
   'laboral', 'course', 'Antonio Vázquez', 'Oficial 1ª', '#0EA5E9', 660, 9),
  ('atencion-cliente', 'Atención al cliente', 10, 14,
   'Call centers presenciales y remotos.', 'alta', 'pdf+roleplay', '📞',
   'Gestión de llamadas, resolución de incidencias, comunicación profesional básica.',
   'laboral', 'course', 'Cristina Núñez', 'Manager BPO', '#F59E0B', 600, 7),
  ('teletrabajo', 'Teletrabajo entry-level', 8, 12,
   'Etiquetado, moderación, soporte chat. 100% remoto.', 'muy_alta', 'pdf+tareas', '💻',
   'Etiquetado de datos, moderación de contenido, soporte por chat.',
   'laboral', 'course', 'Javier Carballo', 'Lead remoto', '#8B5CF6', 480, 6),
  ('habitos-reinsercion', 'Hábitos y reinserción laboral', 6, 10,
   'Base que multiplica el rendimiento del resto del catálogo.', 'transversal', 'pdf', '🧠',
   'Rutinas diarias, organización personal, gestión del tiempo, finanzas básicas.',
   'laboral', 'course', 'Eva Martínez', 'Coach laboral', '#0F766E', 420, 6)
on conflict (slug) do update set
  area = excluded.area,
  kind = excluded.kind,
  instructor_name = excluded.instructor_name,
  instructor_role = excluded.instructor_role,
  accent_color = excluded.accent_color,
  total_minutes = excluded.total_minutes,
  lessons_count = excluded.lessons_count;

-- Cursos · EMOCIONAL
insert into public.courses
  (slug, title, hours_min, hours_max, exit_market, demand, format, emoji,
   description, area, kind, instructor_name, instructor_role, accent_color,
   total_minutes, lessons_count)
values
  ('mindfulness-iniciacion', 'Mindfulness para empezar', 4, 6,
   'Curso autoguiado de 8 sesiones cortas.', 'transversal', 'audio', '🧘',
   'Práctica de atención plena. Sesiones de 10-15 minutos para integrar en tu día.',
   'emocional', 'course', 'Lola Rocha', 'Instructora MBSR', '#E11D48', 120, 8),
  ('regulacion-emocional', 'Regulación emocional', 6, 8,
   'Herramientas concretas para días difíciles.', 'transversal', 'video', '💗',
   'Reconocer, nombrar y gestionar lo que sientes. Técnica STOP, anclajes, parada activa.',
   'emocional', 'course', 'Iván Quiroga', 'Psicólogo sanitario', '#BE185D', 240, 10),
  ('respiracion-478', 'Respiración 4-7-8', 1, 2,
   'Práctica rápida anti-ansiedad.', 'transversal', 'audio', '🌬️',
   'Una técnica de Andrew Weil para reducir el sistema nervioso simpático en 2 minutos.',
   'emocional', 'course', 'Aria', 'Tu acompañante', '#6F4FE8', 30, 3),
  ('diario-emocional', 'Diario emocional guiado', 3, 5,
   'Aprende a escribirte para ordenar.', 'transversal', 'pdf+audio', '📓',
   'Prompts diarios y técnicas para usar el diario como herramienta de auto-conocimiento.',
   'emocional', 'course', 'Marta Soto', 'Coach narrativa', '#0F766E', 180, 6),
  ('autocompasion', 'Autocompasión consciente', 4, 6,
   'Trabaja la voz interior crítica.', 'transversal', 'video', '🫂',
   'Basado en el trabajo de Kristin Neff. Cinco prácticas para dejar de pelearte contigo.',
   'emocional', 'course', 'Inés Cobas', 'Psicoterapeuta', '#F472B6', 180, 5),
  ('sueno-reparador', 'Sueño reparador', 3, 4,
   'Higiene del sueño y rituales nocturnos.', 'alta', 'pdf+audio', '🌙',
   'Cómo cuidar tu descanso para que el día siguiente no empiece en deuda.',
   'emocional', 'course', 'Aria', 'Tu acompañante', '#5A3DCC', 150, 5)
on conflict (slug) do update set
  area = excluded.area,
  kind = excluded.kind,
  instructor_name = excluded.instructor_name,
  instructor_role = excluded.instructor_role,
  accent_color = excluded.accent_color,
  total_minutes = excluded.total_minutes,
  lessons_count = excluded.lessons_count,
  description = excluded.description;

-- Cursos · FÍSICA (on-demand)
insert into public.courses
  (slug, title, hours_min, hours_max, exit_market, demand, format, emoji,
   description, area, kind, instructor_name, instructor_role, accent_color,
   total_minutes, lessons_count)
values
  ('movimiento-suave', 'Movimiento suave diario', 2, 4,
   'Rutinas de 15 minutos para empezar el cuerpo.', 'transversal', 'video', '🌱',
   'Sin equipamiento. Para días bajos o cuerpos parados. Recuperación gradual.',
   'fisica', 'course', 'Laura Cao', 'Fisioterapeuta', '#22A06B', 180, 9),
  ('caminata-consciente', 'Caminata consciente', 2, 3,
   'Andar como práctica meditativa.', 'transversal', 'audio', '🚶',
   'Audios de 20-30 minutos para acompañarte mientras andas. Cuerpo + cabeza.',
   'fisica', 'course', 'Iván Quiroga', 'Psicólogo sanitario', '#0FA065', 120, 5),
  ('alimentacion-base', 'Alimentación que sostiene', 4, 6,
   'Comer sencillo, barato y nutritivo.', 'transversal', 'pdf', '🥗',
   'Recetas, lista de compra base y horarios. Sin dietas complicadas.',
   'fisica', 'course', 'Patricia Ledo', 'Nutricionista', '#F59E0B', 270, 8),
  ('fuerza-en-casa', 'Fuerza en casa', 6, 8,
   'Plan progresivo de 8 semanas.', 'alta', 'video', '💪',
   'Trabajo de fuerza solo con peso corporal. Tres sesiones de 30 min por semana.',
   'fisica', 'course', 'Tomás Iglesias', 'Entrenador personal', '#DC2626', 720, 24)
on conflict (slug) do update set
  area = excluded.area,
  kind = excluded.kind,
  instructor_name = excluded.instructor_name,
  instructor_role = excluded.instructor_role,
  accent_color = excluded.accent_color,
  total_minutes = excluded.total_minutes,
  lessons_count = excluded.lessons_count,
  description = excluded.description;

-- Clases en directo · FÍSICA (starts_at recalculado siempre desde now())
insert into public.courses
  (slug, title, hours_min, hours_max, exit_market, demand, format, emoji,
   description, area, kind, instructor_name, instructor_role, accent_color,
   total_minutes, lessons_count, starts_at)
values
  ('live-yoga-suave', 'Yoga suave en directo', 1, 1,
   'Clase guiada, todos los niveles.', 'transversal', 'live', '🧘‍♀️',
   '45 minutos de yoga restaurativo. No necesitas experiencia ni esterilla profesional.',
   'fisica', 'live_class', 'Laura Cao', 'Profesora yoga', '#22A06B', 45, 1,
   now() + interval '6 hours'),
  ('live-respiracion', 'Sesión de respiración consciente', 1, 1,
   'Reduce ansiedad antes de dormir.', 'transversal', 'live', '🌬️',
   'Trabajo guiado con pranayama y relajación progresiva. 30 minutos.',
   'fisica', 'live_class', 'Aria', 'Tu acompañante', '#6F4FE8', 30, 1,
   now() + interval '1 day'),
  ('live-cardio-bajo', 'Cardio de bajo impacto', 1, 1,
   'Activación cardiovascular suave.', 'transversal', 'live', '🚴',
   'Rutina sin saltos, apta para todos los pesos y edades. 40 minutos.',
   'fisica', 'live_class', 'Tomás Iglesias', 'Entrenador personal', '#DC2626', 40, 1,
   now() + interval '2 days'),
  ('live-fuerza-grupal', 'Fuerza en grupo (peso corporal)', 1, 1,
   'Sesión motivadora con otros usuarios.', 'transversal', 'live', '💪',
   'Entrenamiento funcional en grupo guiado. 50 minutos. Recomendado seguir 6 semanas.',
   'fisica', 'live_class', 'Tomás Iglesias', 'Entrenador personal', '#0F766E', 50, 1,
   now() + interval '5 days')
on conflict (slug) do update set
  area = excluded.area,
  kind = excluded.kind,
  instructor_name = excluded.instructor_name,
  instructor_role = excluded.instructor_role,
  accent_color = excluded.accent_color,
  total_minutes = excluded.total_minutes,
  lessons_count = excluded.lessons_count,
  description = excluded.description,
  starts_at = excluded.starts_at;

-- Clases en directo · EMOCIONAL
insert into public.courses
  (slug, title, hours_min, hours_max, exit_market, demand, format, emoji,
   description, area, kind, instructor_name, instructor_role, accent_color,
   total_minutes, lessons_count, starts_at)
values
  ('live-meditacion-noche', 'Meditación para descansar', 1, 1,
   'Cierra el día con calma.', 'transversal', 'live', '🌙',
   'Guiada en directo. 25 minutos antes de dormir. Plazas limitadas, conexión cercana.',
   'emocional', 'live_class', 'Lola Rocha', 'Instructora MBSR', '#5A3DCC', 25, 1,
   now() + interval '20 hours'),
  ('live-grupo-emocional', 'Encuentro emocional guiado', 1, 1,
   'Hablamos de la semana en grupo seguro.', 'transversal', 'live', '💬',
   'Espacio confidencial. Hablar es opcional. 60 minutos con psicólogo presente.',
   'emocional', 'live_class', 'Iván Quiroga', 'Psicólogo sanitario', '#E11D48', 60, 1,
   now() + interval '3 days')
on conflict (slug) do update set
  area = excluded.area,
  kind = excluded.kind,
  instructor_name = excluded.instructor_name,
  instructor_role = excluded.instructor_role,
  accent_color = excluded.accent_color,
  total_minutes = excluded.total_minutes,
  lessons_count = excluded.lessons_count,
  description = excluded.description,
  starts_at = excluded.starts_at;

-- =========================================================================
-- LISTO ✓
-- Refresca tu app, entra en /fisica o /emocional y verás los cursos
-- y las clases en directo (la primera empieza en ~6 horas).
-- =========================================================================
select 'RENACE courses v2 aplicado correctamente. Refresca la app.' as status;
