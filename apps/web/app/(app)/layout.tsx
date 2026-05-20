import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col pb-2">{children}</div>
      <BottomNav />
    </div>
  );
}
