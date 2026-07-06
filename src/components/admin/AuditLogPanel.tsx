import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { accessService } from "@/services";
import { useAdminData } from "@/hooks/use-admin";
import { Check, X } from "lucide-react";

export function AuditLogPanel() {
  const q = useQuery({
    queryKey: ["module-access-audit"],
    queryFn: () => accessService.listAudit(200),
    staleTime: 15_000,
  });
  const { data: adminData } = useAdminData();

  const bizName = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of adminData?.businesses ?? []) m.set((b as any).id, (b as any).name);
    return m;
  }, [adminData?.businesses]);

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-muted-foreground">
        Every module grant, revoke, or automated subscription sync is recorded here.
      </p>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">When</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Business</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Module</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Change</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">By</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Source</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center font-body text-sm text-muted-foreground">Loading…</td></tr>
            ) : (q.data ?? []).length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center font-body text-sm text-muted-foreground">No activity yet</td></tr>
            ) : q.data!.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-body text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 font-body text-sm text-foreground">{bizName.get(r.business_id) ?? r.business_id.slice(0, 8)}</td>
                <td className="px-4 py-3 font-body text-sm text-foreground capitalize">{r.module}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                    r.is_granted ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {r.is_granted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {r.is_granted ? "Granted" : "Revoked"}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-xs text-muted-foreground">{r.changed_by_email ?? "—"}</td>
                <td className="px-4 py-3 font-body text-xs text-muted-foreground">{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
