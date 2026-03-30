import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardSettings = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: businesses } = await supabase.from("businesses").select("*").eq("user_id", session.user.id).limit(1);
      if (businesses && businesses.length > 0) {
        setBusinessId(businesses[0].id);
        setBusinessName(businesses[0].name);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!businessId) return;
    setLoading(true);
    const { error } = await supabase.from("businesses").update({ name: businessName }).eq("id", businessId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved!" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="font-body text-sm text-muted-foreground">Manage your business settings.</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-lg">
        <div>
          <label className="block font-body text-sm text-foreground mb-1">Business Name</label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default DashboardSettings;
