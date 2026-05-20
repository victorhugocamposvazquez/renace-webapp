import { AreaHeaderSkeleton, CardSkeleton } from "@/components/Skeleton";

/**
 * Fallback genérico para cualquier ruta del shell (app) mientras se cargan los
 * datos del servidor. Se mantiene el BottomNav y el header global; solo cambia
 * esta zona central.
 */
export default function AppShellLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <AreaHeaderSkeleton />
      <CardSkeleton />
      <CardSkeleton lines={3} />
    </div>
  );
}
