export default function AriaLoading() {
  return (
    <div className="flex h-[100dvh] flex-1 flex-col bg-canvas">
      <header className="flex items-center gap-3 border-b border-outline-soft bg-elevated px-4 py-3">
        <div className="skeleton h-10 w-10 rounded-full" aria-hidden />
        <div className="skeleton h-10 w-10 rounded-full" aria-hidden />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="skeleton h-3 w-24 rounded-full" aria-hidden />
          <div className="skeleton h-2.5 w-40 rounded-full" aria-hidden />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="skeleton h-16 w-16 rounded-2xl" aria-hidden />
        <div className="flex flex-col items-center gap-2">
          <div className="skeleton h-5 w-32 rounded-full" aria-hidden />
          <div className="skeleton h-3 w-56 rounded-full" aria-hidden />
        </div>
      </div>

      <div className="flex gap-2 border-t border-outline-soft bg-elevated px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <div className="skeleton h-11 flex-1 rounded-full" aria-hidden />
        <div className="skeleton h-11 w-11 rounded-full" aria-hidden />
      </div>
    </div>
  );
}
