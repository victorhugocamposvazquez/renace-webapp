-- RENACE — cuenta demo para inversores
--
-- PRE-REQUISITO: crear el usuario en Supabase Auth (Dashboard → Authentication → Users):
--   Email:    demo@renace.app
--   Password: DemoRenace2026!
--   Auto Confirm User: sí
--
-- Luego ejecutar este script en el SQL Editor.

do $$
declare
  demo_id uuid;
  course_resp uuid;
  course_alfa uuid;
  course_habitos uuid;
  course_live uuid;
begin
  select id into demo_id from auth.users where email = 'demo@renace.app' limit 1;
  if demo_id is null then
    raise exception 'Usuario demo@renace.app no encontrado. Créalo primero en Auth.';
  end if;

  -- Perfil enriquecido (semana 2)
  insert into public.profiles (
    id, alias, area_focus, aria_name, aria_persist,
    day_in_program, onboarding_completed, last_active_date, city,
    onboarding_reasons
  ) values (
    demo_id,
    'María Demo',
    array['emocional','fisica','laboral']::public.area_id[],
    'Aria',
    true,
    14,
    true,
    current_date,
    'Madrid',
    array['adiccion','no-recaer','estabilidad']::text[]
  )
  on conflict (id) do update set
    alias = excluded.alias,
    area_focus = excluded.area_focus,
    aria_persist = excluded.aria_persist,
    day_in_program = excluded.day_in_program,
    onboarding_completed = true,
    last_active_date = excluded.last_active_date,
    city = excluded.city,
    onboarding_reasons = excluded.onboarding_reasons;

  -- Áreas con progreso visible en el 360
  insert into public.area_progress (user_id, area, percent, status) values
    (demo_id, 'emocional', 42, 'on_track'),
    (demo_id, 'fisica', 28, 'on_track'),
    (demo_id, 'laboral', 55, 'on_track'),
    (demo_id, 'juridica', 18, 'attention'),
    (demo_id, 'comunidad', 12, 'on_track')
  on conflict (user_id, area) do update set
    percent = excluded.percent,
    status = excluded.status,
    updated_at = now();

  -- Mood de hoy + histórico (últimos 14 días del programa)
  delete from public.mood_logs where user_id = demo_id;
  insert into public.mood_logs (user_id, score, note, created_at) values
    (demo_id, 4, 'Mejor que ayer, con ganas de avanzar', now()),
    (demo_id, 3, 'Día tranquilo, sigo el plan', now() - interval '1 day'),
    (demo_id, 2, 'Costó levantarme pero entré', now() - interval '2 days'),
    (demo_id, 4, 'Buen día en el curso de respiración', now() - interval '3 days'),
    (demo_id, 3, 'Neutro, sin sobresaltos', now() - interval '4 days'),
    (demo_id, 5, 'Gran sesión con el grupo de apoyo', now() - interval '5 days'),
    (demo_id, 3, 'Rutina cumplida', now() - interval '6 days'),
    (demo_id, 2, 'Ansiedad por la entrevista', now() - interval '7 days'),
    (demo_id, 4, 'Me siento más fuerte', now() - interval '8 days'),
    (demo_id, 3, 'Día normal', now() - interval '9 days'),
    (demo_id, 4, 'Avancé en alfabetización digital', now() - interval '10 days'),
    (demo_id, 2, 'Día difícil emocionalmente', now() - interval '11 days'),
    (demo_id, 3, 'Primer registro de ánimo', now() - interval '13 days');

  -- Diario
  delete from public.journal_entries where user_id = demo_id;
  insert into public.journal_entries (user_id, content, sentiment) values
    (demo_id, 'Día 1. Quiero recuperar estabilidad y encontrar un trabajo digno.', 'mixed'),
    (demo_id, 'Hoy he respirado antes de una llamada difícil. Pequeño paso, pero cuenta.', 'positive');

  -- Cursos en marcha
  select id into course_resp from public.courses where slug = 'respiracion-478';
  select id into course_alfa from public.courses where slug = 'alfabetizacion-digital';
  select id into course_habitos from public.courses where slug = 'habitos-reinsercion';
  select id into course_live from public.courses where slug = 'live-yoga-suave';

  if course_resp is not null then
    insert into public.course_enrollments (user_id, course_id, progress_percent, current_lesson, last_seen_at)
    values (demo_id, course_resp, 33, 1, now() - interval '2 hours')
    on conflict (user_id, course_id) do update set
      progress_percent = 33, current_lesson = 1, last_seen_at = excluded.last_seen_at;
  end if;

  if course_alfa is not null then
    insert into public.course_enrollments (user_id, course_id, progress_percent, current_lesson, last_seen_at)
    values (demo_id, course_alfa, 17, 1, now() - interval '1 day')
    on conflict (user_id, course_id) do update set
      progress_percent = 17, current_lesson = 1, last_seen_at = excluded.last_seen_at;
  end if;

  if course_habitos is not null then
    insert into public.course_enrollments (user_id, course_id, progress_percent, current_lesson, last_seen_at)
    values (demo_id, course_habitos, 0, 0, now())
    on conflict (user_id, course_id) do update set last_seen_at = excluded.last_seen_at;
  end if;

  if course_live is not null then
    insert into public.course_enrollments (user_id, course_id, reminder_set, last_seen_at)
    values (demo_id, course_live, true, now())
    on conflict (user_id, course_id) do update set reminder_set = true;
  end if;

  -- Caso jurídico
  delete from public.legal_cases where user_id = demo_id;
  insert into public.legal_cases (user_id, title, status, lawyer_name, next_meeting_at)
  values (
    demo_id,
    'Regularización documental',
    'in_progress',
    'Dra. Carmen Ruiz',
    now() + interval '5 days'
  );

  -- Consulta jurídica
  insert into public.consult_requests (user_id, category, body, status)
  select demo_id, 'docs', 'Necesito ayuda para renovar mi DNI caducado.', 'reviewing'
  where not exists (
    select 1 from public.consult_requests where user_id = demo_id limit 1
  );

  -- Ofertas laborales
  insert into public.job_applications (user_id, offer_id, status)
  select demo_id, jo.id, 'interested'
  from public.job_offers jo
  order by jo.match_score desc
  limit 2
  on conflict (user_id, offer_id) do nothing;

  -- Contacto de confianza
  delete from public.trusted_contacts where user_id = demo_id;
  insert into public.trusted_contacts (user_id, name, phone, relation)
  values (demo_id, 'Ana (hermana)', '612 345 678', 'Familia');

  -- Milestones
  delete from public.timeline_milestones where user_id = demo_id;
  insert into public.timeline_milestones (user_id, week, title, body, status, order_index) values
    (demo_id, 1, 'Primeros pasos', 'Completar onboarding y registrar tu ánimo.', 'done', 0),
    (demo_id, 1, 'Contacto de confianza', 'Añade al menos una persona a quien llamar.', 'done', 1),
    (demo_id, 2, 'Primer curso', 'Inscríbete y avanza en una lección.', 'done', 2),
    (demo_id, 2, 'Diario emocional', 'Escribe al menos tres entradas en tu diario.', 'in_progress', 3),
    (demo_id, 3, 'Grupo de apoyo', 'Apúntate o asiste a un evento de la Red.', 'pending', 4),
    (demo_id, 12, 'Primera entrevista', 'Consigue tu primera entrevista laboral.', 'pending', 5);

  -- Triggers + activaciones demo
  delete from public.triggers where user_id = demo_id;
  insert into public.triggers (user_id, label, severity) values
    (demo_id, 'Soledad en casa', 2),
    (demo_id, 'Discusión familiar', 3);

  -- Activity logs piloto (micro-acciones y respiración)
  delete from public.activity_logs where user_id = demo_id;
  insert into public.activity_logs (user_id, kind, payload, created_at) values
    (demo_id, 'micro_action', '{"actionId":"respira","title":"Respira 2 minutos"}'::jsonb, now() - interval '1 day'),
    (demo_id, 'breathing', '{"protocol":"4-7-8","durationSeconds":120}'::jsonb, now() - interval '2 days'),
    (demo_id, 'micro_action', '{"actionId":"diario","title":"Tres líneas en el diario"}'::jsonb, now() - interval '3 days');

  delete from public.craving_logs where user_id = demo_id;
  insert into public.craving_logs (user_id, intensity, note, created_at) values
    (demo_id, 3, 'Ansiedad antes de una llamada', now() - interval '4 days'),
    (demo_id, 4, 'Momento difícil por la tarde', now() - interval '8 days');

  raise notice 'Cuenta demo configurada para user_id=%', demo_id;
end $$;
