/**
 * Bloques esqueleto reutilizables. Server-friendly (no necesitan "use client").
 * Animan con la regla `.skeleton` definida en globals.css.
 */
export function SkeletonBlock({
  className = "",
  style
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden />;
}

export function SkeletonText({
  lines = 1,
  className = ""
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3 rounded-full"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Esqueleto del header de área (eyebrow + título + descripción + back link).
 */
export function AreaHeaderSkeleton() {
  return (
    <>
      <div className="skeleton h-8 w-24 rounded-full" aria-hidden />
      <div className="flex items-center gap-3">
        <div className="skeleton h-9 w-1.5 rounded-full" aria-hidden />
        <div className="flex flex-col gap-2">
          <div className="skeleton h-3 w-20 rounded-full" aria-hidden />
          <div className="skeleton h-7 w-40 rounded-full" aria-hidden />
        </div>
      </div>
      <div className="skeleton h-4 w-3/4 rounded-full" aria-hidden />
    </>
  );
}

/**
 * Esqueleto de una card básica.
 */
export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="card flex flex-col gap-3" aria-hidden>
      <div className="flex items-center gap-2.5">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-3 w-32 rounded-full" />
        </div>
      </div>
      <SkeletonText lines={lines} />
    </div>
  );
}
