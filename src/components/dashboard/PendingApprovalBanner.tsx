import { memo } from "react";
import { Link } from "react-router-dom";
import { Clock, ShoppingBag, MessageSquare, BarChart3 } from "lucide-react";
import { useBusiness } from "@/contexts/BusinessContext";
import { useModuleAccess } from "@/hooks/use-module-access";
import type { DashboardModule } from "@/services";

const REQUESTED_TO_MODULE: Record<string, DashboardModule> = {
  ecommerce: "products",
  meta: "messaging",
  crm: "analytics",
};

const META: Record<DashboardModule, { label: string; icon: typeof ShoppingBag }> = {
  products: { label: "eCommerce / Products", icon: ShoppingBag },
  messaging: { label: "META / Messaging", icon: MessageSquare },
  analytics: { label: "CRM / Analytics", icon: BarChart3 },
};

/**
 * Shows the client the modules they requested during onboarding that
 * are still awaiting super-admin approval (or awaiting subscription activation).
 */
export const PendingApprovalBanner = memo(function PendingApprovalBanner() {
  const { business, subscription } = useBusiness();
  const { availableModules, subscriptionActive } = useModuleAccess();

  const requested = (business as any)?.requested_modules as string[] | undefined;
  if (!requested || requested.length === 0) return null;

  const pending = requested
    .map((r) => REQUESTED_TO_MODULE[r])
    .filter((m): m is DashboardModule => !!m && !availableModules.has(m));

  if (pending.length === 0) return null;

  return (
    <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-yellow-500/15 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-subheading text-sm font-semibold text-foreground">Pending approval</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {subscriptionActive
              ? "Our team is reviewing your requested modules. You'll get access as soon as they're approved."
              : subscription
                ? "Your subscription isn't active yet — requested modules will appear once payment is confirmed and an admin approves them."
                : "Start a subscription to unlock these modules once approved by our team."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pending.map((m) => {
              const Icon = META[m].icon;
              return (
                <span key={m} className="inline-flex items-center gap-1.5 bg-card border border-border rounded-lg px-2.5 py-1 font-body text-xs text-foreground">
                  <Icon className="w-3 h-3 text-yellow-500" />
                  {META[m].label}
                </span>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2">
            {!subscriptionActive && (
              <Link to="/contact" className="btn-cherry inline-flex items-center rounded-lg px-3 py-1.5 font-subheading text-xs font-semibold">
                Activate subscription
              </Link>
            )}
            <Link to="/contact" className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 font-subheading text-xs font-semibold text-foreground hover:bg-muted transition-colors">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
