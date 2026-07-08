import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { accessService, MANAGED_MODULES, adminService, type DashboardModule } from "@/services";
import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";

/** Modules every signed-in dashboard user always sees. */
export const BASIC_MODULES = ["overview", "payments", "customers", "website", "settings"] as const;

/** Full set of href → module identity for the sidebar. */
export const HREF_TO_MODULE: Record<string, DashboardModule | "basic"> = {
  "/dashboard": "basic",
  "/dashboard/payments": "basic",
  "/dashboard/customers": "basic",
  "/dashboard/website": "basic",
  "/dashboard/settings": "basic",
  "/dashboard/products": "products",
  "/dashboard/messaging": "messaging",
  "/dashboard/analytics": "analytics",
};

function isSubscriptionActive(sub: any | null | undefined): boolean {
  if (!sub) return false;
  const status = String(sub.status ?? "").toLowerCase();
  if (!["active", "trial", "trialing"].includes(status)) return false;
  const end = sub.current_period_end ?? sub.trial_end ?? sub.expires_at;
  if (end && new Date(end).getTime() < Date.now()) return false;
  return true;
}

/**
 * Returns the set of managed modules currently available to the business.
 * A managed module is available when: (admin-granted) AND (subscription is active).
 */
export function useModuleAccess() {
  const { businessId, subscription, isLoading: businessLoading } = useBusiness();
  const { user } = useAuth();

  const adminQuery = useQuery({
    queryKey: ["isAdmin", user?.id ?? null],
    queryFn: () => (user?.id ? adminService.checkIsAdmin(user.id) : false),
    enabled: !!user?.id,
    staleTime: 5 * 60_000,
  });
  const isAdmin = adminQuery.data === true;

  const rowsQuery = useQuery({
    queryKey: ["module-access", businessId],
    queryFn: () => (businessId ? accessService.getBusinessModuleAccess(businessId) : []),
    enabled: !!businessId && !isAdmin,
    staleTime: 60_000,
  });

  const availableModules = useMemo(() => {
    const set = new Set<DashboardModule>();
    // Super admins always see every module.
    if (isAdmin) {
      MANAGED_MODULES.forEach((m) => set.add(m));
      return set;
    }
    if (!isSubscriptionActive(subscription)) return set;
    for (const row of rowsQuery.data ?? []) {
      if (row.is_granted && MANAGED_MODULES.includes(row.module)) {
        set.add(row.module);
      }
    }
    return set;
  }, [isAdmin, rowsQuery.data, subscription]);

  const canAccessHref = (href: string): boolean => {
    if (isAdmin) return true;
    const mod = HREF_TO_MODULE[href];
    if (!mod) return true;
    if (mod === "basic") return true;
    return availableModules.has(mod);
  };

  return {
    availableModules,
    canAccessHref,
    isAdmin,
    isLoading: businessLoading || rowsQuery.isLoading || adminQuery.isLoading,
    subscriptionActive: isAdmin || isSubscriptionActive(subscription),
  };
}
