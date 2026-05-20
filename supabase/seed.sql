-- RENACE — datos seed (catálogo)

-- =========================================================================
-- Cursos PDF del dossier (cap. IV.B)
-- =========================================================================
insert into public.courses
  (slug, title, hours_min, hours_max, exit_market, demand, format, emoji, description)
values
  ('limpieza-profesional', 'Limpieza profesional', 8, 12,
    'Empresas de limpieza. Sector con vacantes constantes.', 'muy_alta', 'pdf', '🧹',
    'Técnicas de limpieza industrial, productos y protocolos, oficinas y comunidades.'),
  ('alfabetizacion-digital', 'Alfabetización digital básica', 8, 10,
    'Cualquier empleo administrativo de entrada hoy lo exige.', 'transversal', 'pdf', '💻',
    'Móvil y correo electrónico, trámites online (SEPE, citas médicas), Google Docs y Word básico.'),
  ('jardineria-basica', 'Jardinería básica', 8, 12,
    'Ayuntamientos, contratas y comunidades de vecinos.', 'alta', 'pdf', '🌿',
    'Mantenimiento de jardines, uso de herramientas, riego y poda simple.'),
  ('logistica-almacen', 'Logística y almacén', 10, 15,
    'Amazon, mensajería, distribución local.', 'muy_alta', 'pdf', '📦',
    'Preparación de pedidos · picking, gestión de stock básica, introducción a almacenes.'),
  ('carnet-carretillero', 'Carnet de carretillero', 12, 20,
    'Almacenes, industria, transporte. Habilita el carnet oficial.', 'muy_alta', 'pdf+examen', '🚛',
    'Manejo de carretilla elevadora, seguridad laboral básica.'),
  ('mantenimiento', 'Pequeñas reparaciones', 10, 14,
    'Multiservicios, perfil autónomo básico.', 'alta', 'pdf+practica', '🛠',
    'Pintura básica, montaje de muebles, reparaciones domésticas simples.'),
  ('atencion-cliente', 'Atención al cliente', 10, 14,
    'Call centers presenciales y remotos.', 'alta', 'pdf+roleplay', '📞',
    'Gestión de llamadas, resolución de incidencias, comunicación profesional básica.'),
  ('teletrabajo', 'Teletrabajo entry-level', 8, 12,
    'Etiquetado, moderación, soporte chat. 100% remoto.', 'muy_alta', 'pdf+tareas', '💻',
    'Etiquetado de datos, moderación de contenido, soporte por chat.'),
  ('habitos-reinsercion', 'Hábitos y reinserción laboral', 6, 10,
    'Base que multiplica el rendimiento del resto del catálogo.', 'transversal', 'pdf', '🧠',
    'Rutinas diarias, organización personal, gestión del tiempo, finanzas básicas.')
on conflict (slug) do nothing;

-- =========================================================================
-- Ofertas mock (consistentes con el prototipo)
-- =========================================================================
insert into public.job_offers
  (title, company, location, match_score, partner_company, schedule)
values
  ('Mozo de almacén', 'Logística Norte', 'A Coruña', 92, true, 'jornada_completa'),
  ('Operario producción', 'IndustriasVal', 'Sada', 81, false, 'jornada_completa'),
  ('Operario limpieza turno mañana', 'CleanGal', 'Oleiros', 78, false, 'media_jornada'),
  ('Atención al cliente remoto', 'Soporte24', 'Remoto', 84, true, 'jornada_completa');

-- =========================================================================
-- Eventos en directo
-- =========================================================================
insert into public.live_events
  (title, kind, starts_at, capacity, description)
values
  ('Grupo de apoyo en directo', 'support_group', now() + interval '6 hours', 50,
    'Sesión semanal abierta. Acompañamiento entre iguales.'),
  ('Movimiento y respiración', 'sport', now() + interval '2 days', 30,
    'Rutina suave de 30 minutos para empezar el día con calma.'),
  ('Taller: tu primer CV', 'workshop', now() + interval '4 days', 40,
    'Cómo presentar tu trayectoria sin esconder ni adornar.');
