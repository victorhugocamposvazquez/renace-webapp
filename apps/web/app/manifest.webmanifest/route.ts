/**
 * Devolvemos el manifest desde un route handler para evitar caché agresiva
 * en plataformas como Vercel y mantener un único color de marca en código.
 */
export const dynamic = "force-static";

const manifest = {
  name: "RENACE",
  short_name: "RENACE",
  description: "Tu proceso de recuperación, paso a paso.",
  start_url: "/home",
  scope: "/",
  display: "standalone",
  background_color: "#EAEFEA",
  theme_color: "#13924C",
  orientation: "portrait",
  lang: "es-ES",
  icons: [
    { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
    { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
    { src: "/icons/maskable-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" }
  ],
  categories: ["health", "lifestyle", "education"]
};

export function GET() {
  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600, immutable"
    }
  });
}
