import Link from "next/link";

export default async function AuthErrorPage({
  searchParams
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  return (
    <main className="stage flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-ink-primary">No hemos podido entrar</h1>
      <p className="text-base text-ink-muted">
        {reason ?? "El enlace ha expirado o ya se ha usado. Pide uno nuevo."}
      </p>
      <Link href="/login" className="btn-primary inline-block max-w-xs">
        Volver a entrar
      </Link>
    </main>
  );
}
