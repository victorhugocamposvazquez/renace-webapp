import { CardSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 pb-4">
      <header className="flex flex-col gap-3 px-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="skeleton h-3 w-32 rounded-full" aria-hidden />
          <div className="flex items-center gap-2">
            <div className="skeleton h-10 w-20 rounded-full" aria-hidden />
            <div className="skeleton h-10 w-10 rounded-full" aria-hidden />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="skeleton h-7 w-32 rounded-full" aria-hidden />
          <div className="skeleton h-9 w-40 rounded-full" aria-hidden />
        </div>
      </header>

      {/* Renace360 skeleton: círculo grande con 5 burbujas */}
      <div className="px-5">
        <div className="relative mx-auto aspect-square w-full max-w-[320px]">
          <div
            className="skeleton absolute inset-0 rounded-full"
            aria-hidden
          />
          <div
            className="absolute left-1/2 top-1/2 grid h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-elevated"
            aria-hidden
          >
            <div className="skeleton h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Recovery progress skeleton */}
      <section className="px-5">
        <div className="rounded-2xl border border-outline-soft/80 bg-elevated p-5 shadow-card">
          <div className="skeleton mb-2 h-3 w-24 rounded-full" aria-hidden />
          <div className="skeleton h-10 w-32 rounded-full" aria-hidden />
          <div className="skeleton mt-4 h-2.5 w-full rounded-full" aria-hidden />
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-md" aria-hidden />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5">
        <CardSkeleton lines={2} />
      </section>

      <section className="px-5">
        <CardSkeleton lines={2} />
      </section>
    </div>
  );
}
