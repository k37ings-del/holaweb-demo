import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  Users,
  CreditCard,
  Tag,
  BarChart3,
  LogOut,
  Menu,
  X,
  Plus,
  Copy,
  Trash2,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import logo from "@/assets/HW_Logo.png";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "clients" | "subscriptions" | "referrals" | "settings";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscriptions: 0, totalRevenue: 0, referralCodes: 0 });
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [referralCodes, setReferralCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState({ code: "", discount_type: "percentage", discount_value: 10, max_uses: 100 });
  const [showNewCode, setShowNewCode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) { navigate("/admin"); return; }
      setUser(session.user);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) navigate("/admin");
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/admin"); return; }
      setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [bizRes, subRes, refRes] = await Promise.all([
      supabase.from("businesses").select("*"),
      supabase.from("user_subscriptions").select("*, subscription_plans(name, price, currency)"),
      supabase.from("referral_codes").select("*"),
    ]);

    // For admin, we use the RLS policies that allow admin to see all
    // If businesses returns empty due to RLS, we show what we can
    setBusinesses(bizRes.data || []);
    setSubscriptions(subRes.data || []);
    setReferralCodes(refRes.data || []);
    setStats({
      totalUsers: (bizRes.data || []).length,
      activeSubscriptions: (subRes.data || []).filter((s: any) => s.status === "active" || s.status === "trial").length,
      totalRevenue: 0,
      referralCodes: (refRes.data || []).length,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const createReferralCode = async () => {
    if (!newCode.code.trim()) return;
    const { error } = await supabase.from("referral_codes").insert({
      code: newCode.code.toUpperCase(),
      discount_type: newCode.discount_type,
      discount_value: newCode.discount_value,
      max_uses: newCode.max_uses,
      created_by: user.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Created!", description: `Promo code ${newCode.code.toUpperCase()} created.` });
      setNewCode({ code: "", discount_type: "percentage", discount_value: 10, max_uses: 100 });
      setShowNewCode(false);
      loadData();
    }
  };

  const deleteReferralCode = async (id: string) => {
    await supabase.from("referral_codes").delete().eq("id", id);
    loadData();
  };

  const sidebarItems = [
    { icon: BarChart3, label: "Overview", id: "overview" as Tab },
    { icon: Users, label: "Clients", id: "clients" as Tab },
    { icon: CreditCard, label: "Subscriptions", id: "subscriptions" as Tab },
    { icon: Tag, label: "Referral Codes", id: "referrals" as Tab },
    { icon: Settings, label: "Settings", id: "settings" as Tab },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Holaweb" className="h-7" />
              <span className="bg-primary/10 text-primary font-subheading text-[10px] font-bold uppercase px-2 py-0.5 rounded">Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors w-full text-left ${
                  tab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
            >
              <ArrowUpRight className="w-4 h-4" />
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground mr-4">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold text-foreground">
            {sidebarItems.find((i) => i.id === tab)?.label}
          </h1>
        </header>

        <main className="p-6">
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Clients", value: stats.totalUsers, icon: Users },
                  { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: CreditCard },
                  { label: "Referral Codes", value: stats.referralCodes, icon: Tag },
                  { label: "Revenue (ZAR)", value: `R${stats.totalRevenue.toLocaleString()}`, icon: BarChart3 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
                    <stat.icon className="w-5 h-5 text-muted-foreground mb-3" />
                    <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="font-body text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "clients" && (
            <div className="space-y-4">
              <p className="font-body text-sm text-muted-foreground">All registered businesses on the platform.</p>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Business</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Type</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Created</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No clients yet</td></tr>
                    ) : (
                      businesses.map((biz) => (
                        <tr key={biz.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-body text-sm text-foreground">{biz.name}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground capitalize">{biz.type}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{new Date(biz.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                              biz.onboarding_completed ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                            }`}>
                              {biz.onboarding_completed ? "Active" : "Onboarding"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "subscriptions" && (
            <div className="space-y-4">
              <p className="font-body text-sm text-muted-foreground">Active and past subscriptions across all clients.</p>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No subscriptions yet</td></tr>
                    ) : (
                      subscriptions.map((sub: any) => (
                        <tr key={sub.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-body text-sm text-foreground">{sub.subscription_plans?.name || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                              sub.status === "active" ? "bg-green-500/10 text-green-500" : sub.status === "trial" ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{new Date(sub.started_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "referrals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-body text-sm text-muted-foreground">Manage promo codes and discounts.</p>
                <button
                  onClick={() => setShowNewCode(!showNewCode)}
                  className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2 font-subheading text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Promo Code
                </button>
              </div>

              {showNewCode && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Code</label>
                      <input
                        value={newCode.code}
                        onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground uppercase"
                        placeholder="WELCOME10"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Discount Type</label>
                      <select
                        value={newCode.discount_type}
                        onChange={(e) => setNewCode({ ...newCode, discount_type: e.target.value })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (ZAR)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Discount Value</label>
                      <input
                        type="number"
                        value={newCode.discount_value}
                        onChange={(e) => setNewCode({ ...newCode, discount_value: Number(e.target.value) })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Max Uses</label>
                      <input
                        type="number"
                        value={newCode.max_uses}
                        onChange={(e) => setNewCode({ ...newCode, max_uses: Number(e.target.value) })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                  </div>
                  <button onClick={createReferralCode} className="btn-cherry rounded-lg px-6 py-2 font-subheading text-xs font-semibold">
                    Create Code
                  </button>
                </div>
              )}

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Code</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Discount</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Uses</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                      <th className="text-right px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralCodes.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No promo codes yet</td></tr>
                    ) : (
                      referralCodes.map((rc: any) => (
                        <tr key={rc.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-mono text-sm text-foreground font-semibold">{rc.code}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                            {rc.discount_type === "percentage" ? `${rc.discount_value}%` : `R${rc.discount_value}`}
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                            {rc.current_uses}/{rc.max_uses || "∞"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                              rc.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                            }`}>
                              {rc.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { navigator.clipboard.writeText(rc.code); toast({ title: "Copied!", description: `Code ${rc.code} copied.` }); }}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteReferralCode(rc.id)}
                                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Admin Account</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Signed in as {user?.email}
                </p>
                <button
                  onClick={async () => {
                    const { error } = await supabase.auth.updateUser({ password: prompt("Enter new password:") || "" });
                    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                    else toast({ title: "Updated!", description: "Password changed successfully." });
                  }}
                  className="border border-border rounded-lg px-4 py-2 font-subheading text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Change Password
                </button>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Authorized Admin Emails</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  The following emails are authorized for admin access:
                </p>
                <ul className="space-y-2 font-body text-sm text-foreground/80">
                  <li>• k37.ings@gmail.com</li>
                  <li>• holaweb.africa@gmail.com</li>
                  <li>• siya@holaweb.co.za</li>
                  <li>• Any @holaweb.co.za email</li>
                </ul>
                <p className="font-body text-xs text-muted-foreground mt-3">Maximum 10 admin accounts allowed.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
