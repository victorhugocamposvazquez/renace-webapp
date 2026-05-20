import { BottomNav } from "@/components/BottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage flex min-h-screen flex-col">
      <ScrollToTop />
      <div className="flex flex-1 flex-col pb-2">{children}</div>
      <BottomNav />
    </div>
  );
}
