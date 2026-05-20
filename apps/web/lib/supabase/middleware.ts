import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@renace/supabase";

type CookieToSet = { name: string; value: string; options: CookieOptions };

const PUBLIC_PATHS = ["/login", "/signup", "/auth/callback", "/auth/error"];
const PUBLIC_PREFIXES = ["/_next", "/favicon", "/manifest", "/icons", "/api/health"];

/**
 * Cookie de cache para `onboarding_completed`.
 *
 * Sirve para evitar un query a `profiles` en cada navegación del usuario.
 * Se setea cuando el middleware verifica el estado contra la DB y se borra
 * desde la server action que completa onboarding (`completeOnboardingAction`).
 *
 * NO es información sensible: solo guardamos "yes" cuando ya está completado
 * y la usamos como atajo. Si se manipula y dice "yes" falsamente, la app no
 * rompe — el usuario simplemente no será redirigido a /onboarding y verá la
 * home vacía (el flujo se autocorrige cuando vuelva a entrar y profiles diga
 * que no está completo).
 */
const ONBOARDED_COOKIE = "renace_onboarded";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Chequeo de onboarding: solo hace falta cuando el usuario está autenticado,
  // no es la ruta /onboarding ni una ruta pública. Y si ya tenemos la cookie
  // "renace_onboarded=yes", nos saltamos el query a `profiles` por completo.
  const onboardedCookie = request.cookies.get(ONBOARDED_COOKIE)?.value;
  if (
    user &&
    pathname !== "/onboarding" &&
    !isPublic &&
    onboardedCookie !== "yes"
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.onboarding_completed) {
      // Cacheamos en cookie httpOnly de 30 días para no volver a preguntar.
      response.cookies.set(ONBOARDED_COOKIE, "yes", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      });
    } else if (profile && !profile.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return response;
}
