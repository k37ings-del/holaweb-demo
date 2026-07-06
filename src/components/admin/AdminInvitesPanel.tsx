import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accessService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserPlus } from "lucide-react";

interface Props { adminUserId: string | null }

export function AdminInvitesPanel({ adminUserId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const q = useQuery({
    queryKey: ["allowed-admins"],
    queryFn: () => accessService.listAllowedAdmins(),
    staleTime: 30_000,
  });

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await accessService.inviteAdmin(email, adminUserId, notes || undefined);
      toast({ title: "Admin invited", description: `${email} can now register on the admin portal.` });
      setEmail(""); setNotes("");
      await qc.invalidateQueries({ queryKey: ["allowed-admins"] });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const revoke = async (id: string, label: string) => {
    if (!confirm(`Revoke admin access for ${label}?`)) return;
    try {
      await accessService.revokeAdmin(id);
      await qc.invalidateQueries({ queryKey: ["allowed-admins"] });
      toast({ title: "Revoked", description: label });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-muted-foreground">
        Authorize additional emails to sign in to the super-admin dashboard. Registered admins keep access until revoked here.
      </p>

      <form onSubmit={invite} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <label className="block font-body text-xs text-muted-foreground mb-1">Email address</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@holaweb.africa"
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block font-body text-xs text-muted-foreground mb-1">Notes (optional)</label>
          <input
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Role / team"
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button type="submit" disabled={busy}
          className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2 font-subheading text-sm font-semibold disabled:opacity-50">
          <UserPlus className="w-4 h-4" /> Invite
        </button>
      </form>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Email</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Notes</th>
              <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Added</th>
              <th className="text-right px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center font-body text-sm text-muted-foreground">No admins yet</td></tr>
            ) : q.data!.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-body text-sm text-foreground">
                  {row.email_pattern}
                  {row.is_domain_pattern && <span className="ml-2 text-xs text-muted-foreground">(domain)</span>}
                </td>
                <td className="px-4 py-3 font-body text-sm text-muted-foreground">{row.notes ?? "—"}</td>
                <td className="px-4 py-3 font-body text-sm text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => revoke(row.id, row.email_pattern)}
                    className="inline-flex items-center gap-1 text-destructive hover:bg-destructive/10 px-2 py-1 rounded-lg text-xs font-subheading">
                    <Trash2 className="w-3 h-3" /> Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
