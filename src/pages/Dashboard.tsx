import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  MessageSquare,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Share2,
  RefreshCw,
} from "lucide-react";
import logo from "@/assets/HW_Logo.png";
import { useBusinessStats } from "@/hooks/use-business";
import SubscriptionBubble from "@/components/SubscriptionBubble";
import NotificationsPanel from "@/components/NotificationsPanel";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingBag, label: "Products", href: "/dashboard/products" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: Share2, label: "Meta Business", href: "/dashboard/messaging" },
  { icon: Globe, label: "Website", href: "/dashboard/website" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { session, isLoading: sessionLoading, signOut } = useAuth();
  const { business, isLoading: businessLoading } = useBusiness();
  const { data: stats } = useBusinessStats(business?.id ?? null);

  const isLoading = sessionLoading || businessLoading;

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/auth");
    }
  }, [session, sessionLoading, navigate]);

  useEffect(() => {
    if (business?.onboarding_completed === false) {
      navigate("/onboarding");
    }
  }, [business, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const isOverview = location.pathname === "/dashboard";

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
            <img src={logo} alt="Holaweb" className="h-7" />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {business && (
            <div className="px-6 py-4 border-b border-sidebar-border">
              <p className="font-subheading text-xs text-sidebar-foreground/60 uppercase tracking-wider">Business</p>
              <p className="font-heading text-sm font-semibold text-sidebar-foreground truncate">{business.name}</p>
            </div>
          )}

          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-sidebar-border">
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

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <SubscriptionBubble />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 font-subheading text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Renew Plan
            </Link>
            <NotificationsPanel />
            <Link
              to="/"
              className="font-body text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View Site <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {isOverview ? (
            <div className="space-y-8">
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
                  Welcome back{business ? `, ${business.name}` : ""}
                </h1>
                <p className="font-body text-sm text-muted-foreground">
                  Here's what's happening with your business.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Products", value: stats?.products ?? 0, icon: ShoppingBag, href: "/dashboard/products" },
                  { label: "Customers", value: stats?.customers ?? 0, icon: Users, href: "/dashboard/customers" },
                  { label: "Orders", value: stats?.orders ?? 0, icon: CreditCard, href: "/dashboard/payments" },
                  { label: "Payment Links", value: stats?.paymentLinks ?? 0, icon: CreditCard, href: "/dashboard/payments" },
                ].map((stat) => (
                  <Link
                    key={stat.label}
                    to={stat.href}
                    className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon className="w-5 h-5 text-muted-foreground" />
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="font-body text-xs text-muted-foreground">{stat.label}</p>
                  </Link>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Add Product", icon: Plus, href: "/dashboard/products" },
                    { label: "Create Payment Link", icon: CreditCard, href: "/dashboard/payments" },
                    { label: "Add Customer", icon: Users, href: "/dashboard/customers" },
                    { label: "Send Message", icon: MessageSquare, href: "/dashboard/messaging" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="flex items-center gap-3 bg-muted border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-body text-sm text-foreground">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
