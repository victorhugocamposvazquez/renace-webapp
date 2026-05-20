import { AreaHeaderSkeleton, CardSkeleton } from "@/components/Skeleton";

export default function ComunidadLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <AreaHeaderSkeleton />

      {/* Evento destacado */}
      <div className="skeleton h-28 rounded-3xl" aria-hidden />

      <div className="skeleton mt-2 h-3 w-16 rounded-full" aria-hidden />

      {/* Composer */}
      <div className="skeleton h-24 rounded-2xl" aria-hidden />

      <div className="flex flex-col gap-2.5">
        <CardSkeleton lines={3} />
        <CardSkeleton lines={2} />
        <CardSkeleton lines={4} />
      </div>
    </div>
  );
}
