import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings, User, Building2, Shield, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardSettings = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserEmail(session.user.email || "");

      const [bizRes, profileRes] = await Promise.all([
        supabase.from("businesses").select("*").eq("user_id", session.user.id).limit(1),
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
      ]);

      if (bizRes.data && bizRes.data.length > 0) {
        const biz = bizRes.data[0];
        setBusinessId(biz.id);
        setBusinessName(biz.name);
        setBusinessType(biz.type || "both");
        setBusinessDescription(biz.description || "");
      }

      if (profileRes.data) {
        setProfileId(profileRes.data.id);
        setFullName(profileRes.data.full_name || "");
      }
    };
    load();
  }, []);

  const handleSaveBusiness = async () => {
    if (!businessId) return;
    setLoading(true);
    const { error } = await supabase.from("businesses").update({
      name: businessName, type: businessType, description: businessDescription,
    }).eq("id", businessId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Business settings saved!" });
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!profileId) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profileId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile saved!" });
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="font-body text-sm text-muted-foreground">Manage your business and account settings.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-foreground mb-1">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block font-body text-sm text-foreground mb-1">Email</label>
            <input value={userEmail} disabled className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-muted-foreground font-body text-sm cursor-not-allowed" />
          </div>
        </div>
        <button onClick={handleSaveProfile} disabled={loading} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Business Section */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Business</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-foreground mb-1">Business Name</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block font-body text-sm text-foreground mb-1">Business Type</label>
            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="products">Sell Products</option>
              <option value="services">Offer Services</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-body text-sm text-foreground mb-1">Description</label>
          <textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} rows={3} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Tell customers about your business" />
        </div>
        <button onClick={handleSaveBusiness} disabled={loading} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">
          {loading ? "Saving..." : "Save Business Settings"}
        </button>
      </div>

      {/* Integrations Preview */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Integrations</h2>
        </div>
        <div className="space-y-3">
          {[
            { name: "Peach Payments", description: "Accept card, EFT, and mobile money payments", status: "Coming Soon" },
            { name: "Zoho CRM", description: "Sync customers, deals, and contacts", status: "Coming Soon" },
            { name: "Meta Business Suite", description: "WhatsApp, Facebook & Instagram integration", status: "Coming Soon" },
            { name: "Amazon Web Services", description: "Cloud infrastructure, analytics, and hosting", status: "Active" },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between bg-muted/50 border border-border/50 rounded-lg p-4">
              <div>
                <p className="font-subheading text-sm font-semibold text-foreground">{integration.name}</p>
                <p className="font-body text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full font-body text-xs font-medium shrink-0 ${integration.status === "Active" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"}`}>
                {integration.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
