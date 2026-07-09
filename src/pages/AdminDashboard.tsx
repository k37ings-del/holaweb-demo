import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminService, authService } from "@/services";
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
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  ClipboardList,
  FileText,
  Building2,
  Plug,
  LineChart,
} from "lucide-react";
import logo from "@/assets/HW_Logo.png";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/hooks/use-admin";
import { AccessControlPanel } from "@/components/admin/AccessControlPanel";
import { AdminInvitesPanel } from "@/components/admin/AdminInvitesPanel";
import { AuditLogPanel } from "@/components/admin/AuditLogPanel";
import { PasswordChangePrompt } from "@/components/admin/PasswordChangePrompt";
import NotificationsPanel from "@/components/NotificationsPanel";
const AdminAnalytics = lazy(() => import("@/pages/dashboard/Analytics"));

type Tab = "overview" | "clients" | "access" | "subscriptions" | "pricing" | "analytics" | "settings";
type SettingsTab = "account" | "kyc" | "company" | "integrations";

const AFRICAN_REGIONS: Record<string, string[]> = {
  "Eastern Africa": ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia", "Somalia", "Burundi", "South Sudan", "Eritrea", "Djibouti", "Comoros", "Mauritius", "Seychelles", "Madagascar", "Mozambique"],
  "Southern Africa": ["South Africa", "Botswana", "Namibia", "Zimbabwe", "Zambia", "Malawi", "Lesotho", "Eswatini", "Angola"],
  "Western Africa": ["Nigeria", "Ghana", "Senegal", "Ivory Coast", "Mali", "Burkina Faso", "Niger", "Guinea", "Sierra Leone", "Liberia", "Togo", "Benin", "Gambia", "Cape Verde", "Guinea-Bissau", "Mauritania"],
  "Central Africa": ["Democratic Republic of Congo", "Republic of Congo", "Cameroon", "Central African Republic", "Chad", "Gabon", "Equatorial Guinea", "São Tomé and Príncipe"],
  "Northern Africa": ["Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Sudan"],
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("account");
  const [accessSubTab, setAccessSubTab] = useState<"clients" | "invites">("clients");
  const [pricingSubTab, setPricingSubTab] = useState<"plans" | "referrals">("plans");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewCode, setShowNewCode] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: adminData, isLoading, refetch } = useAdminData();

  useEffect(() => {
    const check = async (session: any) => {
      if (!session) { navigate("/admin"); return; }
      setUser(session.user);
      const isAdmin = await adminService.checkIsAdmin(session.user.id);
      if (!isAdmin) { navigate("/admin"); return; }
      // Force password change if still on the default seed password.
      const changed = Boolean(session.user?.user_metadata?.password_changed);
      setNeedsPasswordChange(!changed);
    };
    const { data: { subscription } } = authService.onAuthStateChange((_, session) => check(session));
    authService.getSession().then(({ data: { session } }) => check(session));
    return () => subscription.unsubscribe();
  }, [navigate]);

  const [newCode, setNewCode] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    max_uses: 100,
    valid_from: "",
    valid_until: "",
    valid_region: "",
  });

  const handleSignOut = async () => {
    await authService.signOut();
    navigate("/");
  };

  const createReferralCode = async () => {
    if (!newCode.code.trim() || !user) return;
    const regionValue = selectedCountry || selectedRegion || newCode.valid_region || null;
    try {
      await adminService.createReferralCode({
        code: newCode.code.toUpperCase(),
        discount_type: newCode.discount_type,
        discount_value: newCode.discount_value,
        max_uses: newCode.max_uses,
        created_by: user.id,
        ...(newCode.valid_from && { valid_from: newCode.valid_from }),
        ...(newCode.valid_until && { valid_until: newCode.valid_until }),
        ...(regionValue && { valid_region: regionValue }),
      });
      toast({ title: "Created!", description: `Promo code ${newCode.code.toUpperCase()} created and saved.` });
      setNewCode({
        code: "",
        discount_type: "percentage",
        discount_value: 10,
        max_uses: 100,
        valid_from: "",
        valid_until: "",
        valid_region: "",
      });
      setSelectedRegion("");
      setSelectedCountry("");
      setShowNewCode(false);
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteReferralCode = async (id: string) => {
    try {
      await adminService.deleteReferralCode(id);
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePlanActive = async (planId: string, currentActive: boolean) => {
    try {
      await adminService.togglePlanActive(planId, currentActive);
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const savePlanEdit = async () => {
    if (!editingPlan) return;
    try {
      await adminService.updatePlan(editingPlan.id, {
        name: editingPlan.name,
        price: editingPlan.price,
        trial_days: editingPlan.trial_days,
        billing_period: editingPlan.billing_period,
      });
      toast({ title: "Updated!", description: `Plan "${editingPlan.name}" updated.` });
      setEditingPlan(null);
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const sidebarItems = [
    { icon: BarChart3, label: "Overview", id: "overview" as Tab },
    { icon: Users, label: "Clients", id: "clients" as Tab },
    { icon: Shield, label: "Access Control", id: "access" as Tab },
    { icon: UserPlus, label: "Admin Invites", id: "invites" as Tab },
    { icon: ClipboardList, label: "Audit Log", id: "audit" as Tab },
    { icon: CreditCard, label: "Subscriptions", id: "subscriptions" as Tab },
    { icon: DollarSign, label: "Pricing", id: "pricing" as Tab },
    { icon: Tag, label: "Referral Codes", id: "referrals" as Tab },
    { icon: Share2, label: "META Business", id: "meta" as Tab },
    { icon: Settings, label: "Settings", id: "settings" as Tab },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {needsPasswordChange && (
        <PasswordChangePrompt onDone={() => setNeedsPasswordChange(false)} />
      )}
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
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-lg font-bold text-foreground truncate">
              {sidebarItems.find((i) => i.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.mycoza.com/clients/dologin.php"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 font-subheading text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <ArrowUpRight className="w-3 h-3" /> MyCoza
            </a>
            <a
              href="https://client.holaweb.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/40 font-subheading text-xs font-semibold text-foreground hover:bg-accent/10 transition-colors"
            >
              <ArrowUpRight className="w-3 h-3" /> FOSSBilling
            </a>
            <NotificationsPanel />
          </div>
        </header>

        <main className="p-6">
          {/* Overview */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {[
                  { label: "Total Clients", value: adminData?.stats.totalUsers ?? 0, icon: Users },
                  { label: "Active Subscriptions", value: adminData?.stats.activeSubscriptions ?? 0, icon: CreditCard },
                  { label: "Referral Codes", value: adminData?.stats.referralCodes ?? 0, icon: Tag },
                  { label: "Revenue (ZAR)", value: `R${(adminData?.stats.totalRevenue ?? 0).toLocaleString()}`, icon: BarChart3 },
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

          {/* Clients */}
          {tab === "clients" && (
            <div className="space-y-4">
              <p className="font-body text-sm text-muted-foreground">All registered businesses on the platform. Integrated with Zoho CRM for customer management.</p>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-subheading text-sm font-semibold text-foreground">Zoho CRM Integration</p>
                  <p className="font-body text-xs text-muted-foreground">Customer data syncs with Zoho CRM for advanced lead management, segmentation, and pipeline tracking.</p>
                </div>
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-body text-xs font-medium shrink-0">Coming Soon</span>
              </div>
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
                    {adminData?.businesses.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No clients yet</td></tr>
                    ) : (
                      adminData?.businesses.map((biz) => (
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

          {/* Access Control */}
          {tab === "access" && (
            <AccessControlPanel adminUserId={user?.id ?? null} />
          )}

          {tab === "invites" && (
            <AdminInvitesPanel adminUserId={user?.id ?? null} />
          )}

          {tab === "audit" && (
            <AuditLogPanel />
          )}



          {/* Subscriptions */}
          {tab === "subscriptions" && (
            <div className="space-y-4">
              <p className="font-body text-sm text-muted-foreground">Active and past subscriptions across all clients.</p>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Region</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData?.subscriptions.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No subscriptions yet</td></tr>
                    ) : (
                      adminData?.subscriptions.map((sub: any) => (
                        <tr key={sub.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-body text-sm text-foreground">{sub.subscription_plans?.name || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                              sub.status === "active" ? "bg-green-500/10 text-green-500" : sub.status === "trial" ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{sub.region || "—"}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{new Date(sub.started_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pricing Management */}
          {tab === "pricing" && (
            <div className="space-y-6">
              <p className="font-body text-sm text-muted-foreground">Manage subscription plans, pricing, and independent services.</p>

              {/* Edit modal */}
              {editingPlan && (
                <div className="bg-card border border-primary/20 rounded-lg p-6 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-foreground">Edit Plan: {editingPlan.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Plan Name</label>
                      <input
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Price (ZAR)</label>
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Trial Days</label>
                      <input
                        type="number"
                        value={editingPlan.trial_days}
                        onChange={(e) => setEditingPlan({ ...editingPlan, trial_days: Number(e.target.value) })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs text-foreground mb-1">Billing Period</label>
                      <select
                        value={editingPlan.billing_period}
                        onChange={(e) => setEditingPlan({ ...editingPlan, billing_period: e.target.value })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      >
                        <option value="once-off">Once-off</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={savePlanEdit} className="btn-cherry rounded-lg px-6 py-2 font-subheading text-xs font-semibold">
                      Save Changes
                    </button>
                    <button onClick={() => setEditingPlan(null)} className="border border-border rounded-lg px-6 py-2 font-subheading text-xs font-semibold text-foreground hover:bg-muted">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Bundled Plans */}
              <div>
                <h3 className="font-heading text-base font-bold text-foreground mb-3">Bundled Packages</h3>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Price</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Period</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Trial</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="text-right px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                       {adminData?.plans.filter(p => p.plan_type === "bundled").map((plan) => (
                        <tr key={plan.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-body text-sm font-medium text-foreground">{plan.name}</td>
                          <td className="px-4 py-3 font-body text-sm text-foreground">R{plan.price.toLocaleString()}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground capitalize">{plan.billing_period}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{plan.trial_days > 0 ? `${plan.trial_days} days` : "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                              plan.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                            }`}>
                              {plan.is_active ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingPlan(plan)}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => togglePlanActive(plan.id, plan.is_active)}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title={plan.is_active ? "Disable" : "Enable"}
                              >
                                {plan.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Independent Services */}
              <div>
                <h3 className="font-heading text-base font-bold text-foreground mb-3">Independent Services</h3>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Service</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Price</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Period</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Trial</th>
                        <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="text-right px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                       {adminData?.plans.filter(p => p.plan_type === "independent").map((plan) => (
                        <tr key={plan.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-body text-sm font-medium text-foreground">{plan.name}</td>
                          <td className="px-4 py-3 font-body text-sm text-foreground">R{plan.price.toLocaleString()}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground capitalize">{plan.billing_period}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{plan.trial_days > 0 ? `${plan.trial_days} days` : "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-subheading text-xs font-semibold ${
                              plan.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                            }`}>
                              {plan.is_active ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingPlan(plan)}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => togglePlanActive(plan.id, plan.is_active)}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title={plan.is_active ? "Disable" : "Enable"}
                              >
                                {plan.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Referral Codes */}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 font-body text-xs text-foreground mb-1">
                        <Calendar className="w-3 h-3" /> Valid From (optional)
                      </label>
                      <input
                        type="date"
                        value={newCode.valid_from}
                        onChange={(e) => setNewCode({ ...newCode, valid_from: e.target.value })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 font-body text-xs text-foreground mb-1">
                        <Calendar className="w-3 h-3" /> Valid Until (optional)
                      </label>
                      <input
                        type="date"
                        value={newCode.valid_until}
                        onChange={(e) => setNewCode({ ...newCode, valid_until: e.target.value })}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 font-body text-xs text-foreground mb-1">
                        <MapPin className="w-3 h-3" /> African Region (optional)
                      </label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCountry(""); }}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                      >
                        <option value="">All Regions</option>
                        {Object.keys(AFRICAN_REGIONS).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    {selectedRegion && (
                      <div>
                        <label className="flex items-center gap-1.5 font-body text-xs text-foreground mb-1">
                          <MapPin className="w-3 h-3" /> Country (optional)
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full bg-muted border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground"
                        >
                          <option value="">Entire {selectedRegion}</option>
                          {AFRICAN_REGIONS[selectedRegion]?.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <button onClick={createReferralCode} className="btn-cherry rounded-lg px-6 py-2 font-subheading text-xs font-semibold">
                    Save Promo Code
                  </button>
                </div>
              )}

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Code</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Discount</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Region</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Uses</th>
                      <th className="text-left px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Status</th>
                      <th className="text-right px-4 py-3 font-subheading text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                       {adminData?.referralCodes.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No promo codes yet</td></tr>
                    ) : (
                       adminData?.referralCodes.map((rc: any) => (
                        <tr key={rc.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-mono text-sm text-foreground font-semibold">{rc.code}</td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                            {rc.discount_type === "percentage" ? `${rc.discount_value}%` : `R${rc.discount_value}`}
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-muted-foreground">{rc.valid_region || "Global"}</td>
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

          {/* META Business */}
          {tab === "meta" && (
            <div className="space-y-6">
              <p className="font-body text-sm text-muted-foreground">Meta Business Suite integrations and services management.</p>

              <div className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-subheading text-sm font-semibold text-foreground">Meta Business Suite Integration</p>
                  <p className="font-body text-xs text-muted-foreground">Connect Facebook, Instagram, and WhatsApp Business for all clients.</p>
                </div>
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-body text-xs font-medium shrink-0">Coming Soon</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "WhatsApp Business API", desc: "Manage WhatsApp catalogues, automated messaging, and broadcast lists for client businesses." },
                  { title: "Facebook & Instagram Ads", desc: "Create and monitor ad campaigns, boost posts, and manage audiences across Meta platforms." },
                  { title: "Product Catalogue Sync", desc: "Sync client products to Facebook Shops, Instagram Shopping, and WhatsApp catalogues automatically." },
                  { title: "Messenger & Instagram DMs", desc: "Unified inbox for managing customer conversations from Facebook Messenger and Instagram DMs." },
                  { title: "Audience Insights", desc: "Detailed analytics on ad reach, engagement, and conversion metrics across Meta platforms." },
                  { title: "Automated Messaging", desc: "Set up welcome messages, order confirmations, and payment receipts via WhatsApp and Messenger." },
                ].map((feature) => (
                  <div key={feature.title} className="bg-card border border-border rounded-lg p-5 space-y-2">
                    <p className="font-subheading text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">Admin Account</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Signed in as {user?.email}
                </p>
                <button
                  onClick={async () => {
                    const newPass = prompt("Enter new password:");
                    if (!newPass) return;
                    const { error } = await supabase.auth.updateUser({ password: newPass });
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
                <p className="font-body text-sm text-muted-foreground">
                  Admin access is provisioned server-side from the
                  <span className="font-mono text-xs mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground">admin_allowed_emails</span>
                  table. Contact a system administrator to add or remove an authorized address.
                </p>
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
