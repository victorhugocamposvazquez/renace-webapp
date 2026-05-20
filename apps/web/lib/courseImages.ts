/**
 * Mapping de slug de curso/clase en directo a foto de fondo profesional.
 *
 * Usamos URLs estables de Unsplash CDN (no `source.unsplash.com`, que es
 * el endpoint random ya deprecado). Cada URL pide la imagen a 640x400 y
 * con compresión + auto-format para minimizar peso en mobile.
 *
 * Si un curso no está mapeado aquí, `CourseThumbnail` cae al fallback de
 * gradient + emoji que ya existía.
 *
 * Para añadir nuevos cursos: busca una foto neutra y aspiracional en
 * unsplash.com, copia su `photo-XXXX` y añádelo aquí. La licencia de
 * Unsplash permite uso comercial sin atribución obligatoria.
 */

const UNSPLASH_PARAMS = "?auto=format&fit=crop&w=720&q=80";

function unsplash(id: string): string {
  return `https://images.unsplash.com/${id}${UNSPLASH_PARAMS}`;
}

/**
 * Foco visual + tono profesional. Cada imagen tiene composición simple
 * para que el overlay de color y el texto encima se lean bien.
 */
export const COURSE_IMAGES: Record<string, string> = {
  /* ---------------- LABORAL ---------------- */
  "limpieza-profesional": unsplash("photo-1581578731548-c64695cc6952"),
  "alfabetizacion-digital": unsplash("photo-1517694712202-14dd9538aa97"),
  "jardineria-basica": unsplash("photo-1466692476868-aef1dfb1e735"),
  "logistica-almacen": unsplash("photo-1586528116311-ad8dd3c8310d"),
  "carnet-carretillero": unsplash("photo-1553413077-190dd305871c"),
  mantenimiento: unsplash("photo-1581094271901-8022df4466f9"),
  "atencion-cliente": unsplash("photo-1486312338219-ce68d2c6f44d"),
  teletrabajo: unsplash("photo-1593642632559-0c6d3fc62b89"),
  "habitos-reinsercion": unsplash("photo-1505672678657-cc7037095e60"),

  /* ---------------- EMOCIONAL ---------------- */
  "mindfulness-iniciacion": unsplash("photo-1506126613408-eca07ce68773"),
  "regulacion-emocional": unsplash("photo-1499209974431-9dddcece7f88"),
  "respiracion-478": unsplash("photo-1518609878373-06d740f60d8b"),
  "diario-emocional": unsplash("photo-1455390582262-044cdead277a"),
  autocompasion: unsplash("photo-1518837695005-2083093ee35b"),
  "sueno-reparador": unsplash("photo-1455642305367-68834a1da9f4"),

  /* ---------------- FÍSICA (on-demand) ---------------- */
  "movimiento-suave": unsplash("photo-1518611012118-696072aa579a"),
  "caminata-consciente": unsplash("photo-1502536571036-b4ba03c4f137"),
  "alimentacion-base": unsplash("photo-1490645935967-10de6ba17061"),
  "fuerza-en-casa": unsplash("photo-1517836357463-d25dfeac3438"),

  /* ---------------- LIVE CLASSES ---------------- */
  "live-yoga-suave": unsplash("photo-1545205597-3d9d02c29597"),
  "live-respiracion": unsplash("photo-1474418397713-2f1091953b14"),
  "live-cardio-bajo": unsplash("photo-1571019613454-1cb2f99b2d8b"),
  "live-fuerza-grupal": unsplash("photo-1571019614242-c5c5dee9f50b"),
  "live-meditacion-noche": unsplash("photo-1505693416388-ac5ce068fe85"),
  "live-grupo-emocional": unsplash("photo-1573497019940-1c28c88b4f3e")
};

/**
 * Devuelve la URL de imagen para un curso, o null si no hay match (para
 * activar el fallback gradient + emoji).
 */
export function getCourseImage(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return COURSE_IMAGES[slug] ?? null;
}
