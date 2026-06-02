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

-- Retención D7: usuarios con actividad en día 1 y día 7 del programa
-- (aproximación por fechas de mood/activity)
