import Link from "next/link";
import {
  IconQuote,
  IconCalendarStar,
  IconChevronRight
} from "@tabler/icons-react";
import type { JournalEntry } from "@renace/supabase";

/**
 * Card que destaca la "intención inicial" del usuario — la primera entrada
 * de diario que escribió durante el onboarding. La mostramos durante las
 * primeras semanas (≤ 21 días) para que el usuario tenga algo a lo que
 * volver cuando dude.
 *
 * Pasa el entry como prop para que sea trivial decidir en la página padre
 * si renderizarla o no.
 */
export function IntentCard({
  entry,
  dayInProgram
}: {
  entry: JournalEntry;
  dayInProgram: number;
}) {
  // Limpiamos el prefijo "Día 1. Hoy empiezo este camino." si lo tiene,
  // para resaltar las razones del usuario sin redundancia.
  const text = entry.content.trim();
  const reasonsBlock = extractReasonsBlock(text);

  return (
    <article className="relative overflow-hidden rounded-2xl text-ink-inverse shadow-lift">
      <div
        aria-hidden
        className="absolute inset-0 bg-brand-gradient"
        style={{
          background:
            "linear-gradient(135deg, #13924C 0%, #0E7A3F 55%, #6F4FE8 130%)"
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
            <IconCalendarStar size={11} aria-hidden />
            Tu intención
          </span>
          <span className="text-[11px] font-medium opacity-90">
            Día {dayInProgram}
          </span>
        </div>

        <div className="relative mt-3">
          <IconQuote
            size={28}
            aria-hidden
            className="absolute -left-1 -top-1 text-white/30"
            stroke={2.4}
          />
          <p className="relative pl-7 text-base font-medium leading-snug">
            {reasonsBlock || text.slice(0, 200)}
          </p>
        </div>

        <Link
          href="/emocional"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-ink-inverse backdrop-blur transition-colors hover:bg-white/25"
        >
          Volver a mi propósito
          <IconChevronRight size={14} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/**
 * Del texto crudo del journal, extrae las líneas "· …" que listan los
 * motivos y las une en una frase legible. Si no encuentra ninguna,
 * devuelve null y el componente cae al texto plano.
 */
function extractReasonsBlock(text: string): string | null {
  const lines = text.split(/\r?\n/);
  const bullets = lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith("·"))
    .map((l) => l.replace(/^·\s*/, "").replace(/\.$/, ""));
  if (bullets.length === 0) return null;
  if (bullets.length === 1) {
    return `Estoy aquí para ${bullets[0]?.toLowerCase()}.`;
  }
  const last = bullets[bullets.length - 1];
  const head = bullets.slice(0, -1).join(", ");
  return `Estoy aquí para ${head.toLowerCase()} y ${last?.toLowerCase()}.`;
}
