/**
 * Herramientas listadas en cada área. Son enlaces internos. Cuando aún no exista
 * la pantalla específica, se aterriza en la pantalla del área correspondiente.
 */
export type AreaTool = {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  badge?: string;
};

export const EMOCIONAL_TOOLS: AreaTool[] = [
  {
    id: "diario",
    label: "Diario personal",
    subtitle: "Escribe en privado, sin juicios",
    href: "/emocional#diario"
  },
  {
    id: "triggers",
    label: "Lo que te cuesta",
    subtitle: "Tus situaciones difíciles",
    href: "/emocional#triggers",
    badge: "Alerta"
  },
  {
    id: "grupos",
    label: "Grupos de apoyo",
    subtitle: "Próxima sesión en vivo",
    href: "/comunidad"
  },
  {
    id: "evolucion",
    label: "Tu evolución",
    subtitle: "Cómo te has sentido",
    href: "/emocional#evolucion"
  }
];

export const FISICA_TOOLS: AreaTool[] = [
  { id: "deporte", label: "Deporte", subtitle: "4 sesiones por semana", href: "/fisica#deporte", badge: "Activo" },
  { id: "nutricion", label: "Nutrición", subtitle: "Plan personalizado", href: "/fisica#nutricion" },
  { id: "antiansiedad", label: "Anti-ansiedad", subtitle: "Rutinas guiadas", href: "/fisica#antiansiedad" },
  { id: "smartwatch", label: "Smartwatch", subtitle: "Sincroniza tus datos", href: "/perfil#smartwatch" }
];
