# RENACE

WebApp mobile-first para personas en recuperación. Construida con Next.js 15, Supabase y Vercel AI Gateway, sobre un monorepo Turborepo preparado para añadir React Native en el futuro sin reescribir lógica de dominio.

## Estructura

```
renace/
├── apps/web/                 Next.js 15 (App Router, RSC, Server Actions)
├── packages/
│   ├── core/                 Tipos, schemas Zod, contenido y dominio puro
│   ├── supabase/             Cliente y queries puras por dominio
│   ├── ai/                   System prompt de Aria + tools del agente
│   ├── tokens/               Paleta y tipografía RENACE (web + futuro RN)
│   ├── tsconfig/             Configs base / nextjs / library
│   └── eslint-config/        Configs ESLint base
├── supabase/
│   ├── migrations/           Esquema + RLS estricta por user_id
│   └── seed.sql              9 cursos del dossier, ofertas y eventos
└── turbo.json
```

## Stack

- **Web**: Next.js 15, React 19, TypeScript estricto, Tailwind CSS, `@tabler/icons-react`.
- **Backend**: Supabase (Postgres + Auth + RLS + Realtime + Storage) con `@supabase/ssr`.
- **IA — Aria**: Vercel AI SDK (`ai`) sobre AI Gateway, con streaming, tools y persistencia opcional.
- **Monorepo**: Turborepo + pnpm workspaces.

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Copiar variables de entorno:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

3. Crear un proyecto en [Supabase](https://supabase.com) y rellenar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.

4. Aplicar las migrations al proyecto Supabase (CLI o panel SQL). Los archivos están en `supabase/migrations/`. Después correr `supabase/seed.sql` para poblar catálogos.

5. (Opcional) Configurar [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) y poner la API key en `AI_GATEWAY_API_KEY`. Sin esta variable la app arranca en modo demo y Aria responde con texto pre-grabado.

6. Arrancar en desarrollo:

   ```bash
   pnpm dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en el navegador. Usa devtools en modo móvil para la experiencia real.

## Mapa de pantallas

- `/login` — magic link, email/password y registro.
- `/onboarding` — alias, áreas de foco y nombre de Aria (3 pasos).
- `/(app)/home` — círculo 360, micro-acción del día, teaser de Aria, SOS.
- `/(app)/emocional` — mood, diario, prevención de recaídas, evolución.
- `/(app)/fisica` — métricas, plan, anti-ansiedad CTA → Aria.
- `/(app)/juridica` — caso activo, 6 categorías, formulario que crea `consult_requests`.
- `/(app)/laboral` — fase, ofertas con match, progreso, catálogo de cursos del dossier.
- `/(app)/comunidad` — feed, live events, badges de mentor.
- `/(app)/perfil` — perfil 360, contactos de confianza, ajustes.
- `/(app)/recorrido` — milestones con marcado de estado.
- `/(app)/aria` — chat full-screen con streaming.

## Por qué monorepo desde día uno

Cuando llegue React Native, `apps/native` reutilizará `@renace/core`, `@renace/supabase`, `@renace/ai` y `@renace/tokens`. Las vistas (`apps/web/components`) **no** se comparten — cada plataforma tiene UI propia. Esto evita el sufrimiento de `react-native-web` con Server Components y mantiene cada UX nativa.

## Convenciones de portabilidad

- Cero `window`, `document` ni `next/*` dentro de `packages/*`.
- Las queries de Supabase son funciones puras `(client, args) => Promise<T>`.
- Las Server Actions validan con Zod (de `@renace/core`), llaman a queries y hacen `revalidatePath`. La lógica vive en los paquetes.
- Tokens en `@renace/tokens` exportados como objetos TS para consumirlos desde Tailwind hoy y NativeWind mañana.

## Deploy

Pensado para Vercel + Supabase administrado:

1. `vercel link` desde `apps/web`.
2. Configurar las variables de entorno en el dashboard de Vercel (mismas que `.env.example`).
3. Para Supabase, integración nativa del Marketplace de Vercel o conexión manual.

## Lo que NO entra en este MVP

- Vista desktop real (mobile-first puro con preview centrado en desktop).
- Embeddings reales para match de ofertas (mock score primero).
- Pagos / suscripciones de los 3 niveles del dossier.
- Streaming de clases en directo (solo placeholder).
- `apps/native` real (terreno preparado, no creado).
