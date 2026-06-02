-- RENACE — escenario piloto 30 días (opcional, tras seed-demo-user)
-- Genera actividad distribuida para probar histórico y métricas.

do $$
declare
  uid uuid;
  d int;
begin
  select id into uid from auth.users where email = 'demo@renace.app' limit 1;
  if uid is null then
    raise notice 'Usuario demo no encontrado';
    return;
  end if;

  for d in 1..30 loop
    if d % 3 = 0 then
      insert into public.mood_logs (user_id, score, note, created_at)
      values (uid, 2 + (d % 4), 'Registro piloto día ' || d, now() - ((30 - d) || ' days')::interval);
    end if;
    if d % 5 = 0 then
      insert into public.activity_logs (user_id, kind, payload, created_at)
      values (
        uid,
        'micro_action',
        jsonb_build_object('actionId', 'respira', 'title', 'Respira 2 minutos'),
        now() - ((30 - d) || ' days')::interval
      );
    end if;
  end loop;

  raise notice 'Escenario piloto 30d aplicado a %', uid;
end $$;
