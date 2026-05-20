import { CardSkeleton } from "@/components/Skeleton";

export default function PerfilLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <div className="skeleton h-8 w-24 rounded-full" aria-hidden />

      <header className="flex flex-col items-center gap-2 pt-2 text-center">
        <div className="skeleton h-24 w-24 rounded-full" aria-hidden />
        <div className="skeleton h-5 w-32 rounded-full" aria-hidden />
        <div className="skeleton h-3 w-40 rounded-full" aria-hidden />
        <div className="mt-1 flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" aria-hidden />
        </div>
      </header>

      <div className="skeleton mt-2 h-3 w-24 rounded-full" aria-hidden />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton aspect-square rounded-2xl" aria-hidden />
        ))}
      </div>

      <div className="skeleton mt-2 h-3 w-24 rounded-full" aria-hidden />
      <CardSkeleton lines={2} />

      <div className="skeleton mt-2 h-3 w-16 rounded-full" aria-hidden />
      <CardSkeleton lines={3} />
    </div>
  );
}
