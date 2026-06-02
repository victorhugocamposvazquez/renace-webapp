-- RENACE — soporte para incremento de day_in_program por actividad diaria
alter table public.profiles
  add column if not exists last_active_date date;

comment on column public.profiles.last_active_date is
  'Última fecha (UTC) en la que el usuario realizó una acción significativa. Usada para incrementar day_in_program.';
