import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accessService, MANAGED_MODULES, type DashboardModule } from "@/services";
import { useAdminData } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, MessageSquare, BarChart3, Check, X, Search } from "lucide-react";

const MODULE_META: Record<DashboardModule, { label: string; icon: typeof ShoppingBag; desc: string }> = {
  products: { label: "Products / eCommerce", icon: ShoppingBag, desc: "Product catalog & storefront" },
  messaging: { label: "Meta / Messaging", icon: MessageSquare, desc: "WhatsApp, IG, FB inbox" },
  analytics: { label: "Analytics / CRM", icon: BarChart3, desc: "Reports & customer insights" },
};

function isSubActive(sub: any | null | undefined): boolean {
  if (!sub) return false;
  const status = String(sub.status ?? "").toLowerCase();
  if (!["active", "trial", "trialing"].includes(status)) return false;
  const end = sub.current_period_end ?? sub.trial_end ?? sub.expires_at;
  if (end && new Date(end).getTime() < Date.now()) return false;
  return true;
}

interface Props {
  adminUserId: string | null;
}

export function AccessControlPanel({ adminUserId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: adminData } = useAdminData();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const accessQuery = useQuery({
    queryKey: ["all-module-access"],
    queryFn: () => accessService.listAllModuleAccess(),
    staleTime: 30_000,
  });

  const grantedMap = useMemo(() => {
    const map = new Map<string, Set<DashboardModule>>();
    for (const row of accessQuery.data ?? []) {
      if (!row.is_granted) continue;
      if (!map.has(row.business_id)) map.set(row.business_id, new Set());
      map.get(row.business_id)!.add(row.module);
    }
    return map;
  }, [accessQuery.data]);

  const subsByUser = useMemo(() => {
    const map = new Map<string, any>();
    for (const s of adminData?.subscriptions ?? []) {
      const existing = map.get((s as any).user_id);
      if (!existing || new Date((s as any).created_at) > new Date(existing.created_at)) {
        map.set((s as any).user_id, s);
      }
    }
    return map;
  }, [adminData?.subscriptions]);

  const businesses = useMemo(() => {
    const list = adminData?.businesses ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((b: any) =>
      (b.name ?? "").toLowerCase().includes(q) || (b.type ?? "").toLowerCase().includes(q),
    );
  }, [adminData?.businesses, query]);

  const toggle = async (businessId: string, module: DashboardModule, next: boolean) => {
    if (!adminUserId) return;
    const key = `${businessId}:${module}`;
    setPending(key);
    try {
      await accessService.setModuleAccess({ businessId, module, isGranted: next, adminUserId });
      await qc.invalidateQueries({ queryKey: ["all-module-access"] });
      await qc.invalidateQueries({ queryKey: ["module-access", businessId] });
      toast({ title: next ? "Access granted" : "Access revoked", description: `${MODULE_META[module].label}` });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-body text-sm text-muted-foreground">
          Grant or revoke dashboard modules per client. All clients always see Overview, Payments, Customers, Website and Settings.
          Managed modules below are only visible to the client when granted here <em>and</em> their subscription is active.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients..."
          className="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Business</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Requested</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Subscription</th>
              {MANAGED_MODULES.map((m) => (
                <th key={m} className="text-center px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">
                  {MODULE_META[m].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {businesses.length === 0 ? (
              <tr><td colSpan={3 + MANAGED_MODULES.length} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No clients found</td></tr>
            ) : (
              businesses.map((biz: any) => {
                const sub = subsByUser.get(biz.user_id);
                const active = isSubActive(sub);
                const granted = grantedMap.get(biz.id) ?? new Set<DashboardModule>();
                const requested: string[] = Array.isArray(biz.setup_priorities) ? biz.setup_priorities : [];
                const wantsProducts = biz.type === "products" || biz.type === "both";
                const wantsMessaging = requested.includes("messaging");
                const wantsAnalytics = requested.includes("crm");
                const requestedChips: Array<[string, boolean]> = [
                  ["Products", wantsProducts],
                  ["Messaging", wantsMessaging],
                  ["Analytics/CRM", wantsAnalytics],
                ];
                return (
                  <tr key={biz.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-body text-sm text-foreground">{biz.name}</p>
                      <p className="font-body text-xs text-muted-foreground capitalize">{biz.type}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {requestedChips.filter(([, v]) => v).map(([label]) => (
                          <span key={label} className="bg-primary/10 text-primary px-2 py-0.5 rounded font-body text-[10px] font-medium">{label}</span>
                        ))}
                        {requestedChips.every(([, v]) => !v) && (
                          <span className="text-muted-foreground font-body text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                        active ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {active ? "Active" : sub ? String(sub.status ?? "inactive") : "None"}
                      </span>
                    </td>
                    {MANAGED_MODULES.map((m) => {
                      const isOn = granted.has(m);
                      const key = `${biz.id}:${m}`;
                      const busy = pending === key;
                      return (
                        <td key={m} className="px-4 py-3 text-center">
                          <button
                            disabled={busy}
                            onClick={() => toggle(biz.id, m, !isOn)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-subheading text-xs font-semibold transition-colors ${
                              isOn
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                : "bg-muted text-muted-foreground hover:bg-muted/70"
                            } disabled:opacity-50`}
                            aria-label={`${isOn ? "Revoke" : "Grant"} ${MODULE_META[m].label}`}
                          >
                            {isOn ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {isOn ? "Granted" : "Locked"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="font-body text-xs text-muted-foreground">
        Note: granting access here does not by itself unlock a page for the client — their subscription must also be active. When a subscription lapses, managed modules automatically hide until payment is renewed.
      </p>
    </div>
  );
}
