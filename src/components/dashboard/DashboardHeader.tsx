import { memo } from "react";
import { Link } from "react-router-dom";
import { Menu, ArrowUpRight, RefreshCw } from "lucide-react";
import SubscriptionBubble from "@/components/SubscriptionBubble";
import NotificationsPanel from "@/components/NotificationsPanel";

interface Props {
  onOpenSidebar: () => void;
}

export const DashboardHeader = memo(function DashboardHeader({ onOpenSidebar }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onOpenSidebar} className="lg:hidden text-foreground" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <SubscriptionBubble />
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 font-subheading text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Renew Plan
        </Link>
        <NotificationsPanel />
        <Link
          to="/"
          className="font-body text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View Site <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
});
