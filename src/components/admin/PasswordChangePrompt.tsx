import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

interface Props { onDone: () => void }

/**
 * Forced password change on first login for the seeded super-admin
 * (default password: 1234567). Persists a `password_changed=true` flag
 * in user_metadata so the modal only appears once.
 */
export function PasswordChangePrompt({ onDone }: Props) {
  const { toast } = useToast();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" }); return; }
    if (pw !== confirm) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    if (pw === "1234567") { toast({ title: "Choose a new password", description: "You cannot keep the default password.", variant: "destructive" }); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: pw,
        data: { password_changed: true },
      });
      if (error) throw error;
      toast({ title: "Password updated", description: "You're all set." });
      onDone();
    } catch (err: any) {
      toast({ title: "Could not update password", description: err.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-lg p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Set a new admin password</h2>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          You're signed in with the default password. Please choose a new one to continue.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block font-body text-xs text-foreground mb-1">New password</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} required
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground" />
          </div>
          <div>
            <label className="block font-body text-xs text-foreground mb-1">Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground" />
          </div>
          <button type="submit" disabled={busy}
            className="btn-cherry w-full rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
