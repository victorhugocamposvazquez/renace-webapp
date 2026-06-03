-- RENACE — métricas de adherencia para piloto
-- Ejecutar en SQL Editor de Supabase (requiere tablas activity_logs, craving_logs)

-- Resumen por usuario: días activos, moods, acciones, antojos (últimos 30 días)
select
  p.id,
  p.alias,
  p.day_in_program,
  count(distinct (m.created_at::date)) as mood_days_30d,
  count(distinct (a.created_at::date)) as activity_days_30d,
  count(*) filter (where a.kind = 'micro_action') as micro_actions_30d,
  count(*) filter (where a.kind = 'breathing') as breathing_sessions_30d,
  (select count(*) from public.craving_logs c where c.user_id = p.id and c.created_at > now() - interval '30 days') as cravings_30d
from public.profiles p
left join public.mood_logs m on m.user_id = p.id and m.created_at > now() - interval '30 days'
left join public.activity_logs a on a.user_id = p.id and a.created_at > now() - interval '30 days'
where p.onboarding_completed = true
group by p.id, p.alias, p.day_in_program
order by p.day_in_program desc;

-- Detonantes y check-ins semanales por usuario (últimos 30 días)
select
  p.id,
  p.alias,
  (select count(*) from public.trigger_activations ta
     where ta.user_id = p.id and ta.created_at > now() - interval '30 days') as trigger_activations_30d,
  (select count(*) from public.activity_logs w
     where w.user_id = p.id and w.kind = 'weekly_checkin'
       and w.created_at > now() - interval '30 days') as weekly_checkins_30d
from public.profiles p
where p.onboarding_completed = true
order by trigger_activations_30d desc;

-- Retención D7: de los usuarios registrados hace >= 7 días, cuántos
-- tuvieron actividad (mood o activity_logs) en una ventana en torno al día 7
-- (días 6–8 tras el alta). Aproxima la retención a una semana.
with cohort as (
  select p.id, p.alias, p.created_at::date as signup_date
  from public.profiles p
  where p.onboarding_completed = true
    and p.created_at <= now() - interval '7 days'
),
active_dates as (
  select user_id, created_at::date as d from public.mood_logs
  union
  select user_id, created_at::date as d from public.activity_logs
),
retained as (
  select c.id, c.alias,
    exists (
      select 1 from active_dates ad
      where ad.user_id = c.id
        and ad.d between c.signup_date + 6 and c.signup_date + 8
    ) as active_d7
  from cohort c
)
select
  count(*) as cohort_size,
  count(*) filter (where active_d7) as retained_d7,
  round(100.0 * count(*) filter (where active_d7) / nullif(count(*), 0), 1) as retention_d7_pct
from retained;
