import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import {
  CreditCard,
  MessageSquare,
  Users,
  ShoppingBag,
  Plus,
} from "lucide-react";
import { useBusinessStats } from "@/hooks/use-business";
import { useModuleAccess, HREF_TO_MODULE } from "@/hooks/use-module-access";
import {
  DashboardSidebar,
  DashboardHeader,
  StatCard,
  QuickActionCard,
  PendingApprovalBanner,
} from "@/components/dashboard";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { session, isLoading: sessionLoading, signOut } = useAuth();
  const { business, isLoading: businessLoading } = useBusiness();
  const { data: stats } = useBusinessStats(business?.id ?? null);
  const { canAccessHref, isLoading: accessLoading } = useModuleAccess();

  // Route-guard: if user lands on a page they don't have access to, bounce to Overview.
  useEffect(() => {
    if (accessLoading) return;
    const path = location.pathname;
    // Only guard the managed sub-routes (not /dashboard itself).
    if (path === "/dashboard") return;
    const knownHref = Object.keys(HREF_TO_MODULE).find((h) => h !== "/dashboard" && path.startsWith(h));
    if (knownHref && !canAccessHref(knownHref)) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, canAccessHref, accessLoading, navigate]);

  useEffect(() => {
    if (!sessionLoading && !session) navigate("/auth");
  }, [session, sessionLoading, navigate]);

  useEffect(() => {
    if (business?.onboarding_completed === false) navigate("/onboarding");
  }, [business, navigate]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  const isActive = useCallback(
    (href: string) =>
      href === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(href),
    [location.pathname],
  );

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const isOverview = location.pathname === "/dashboard";

  const statCards = useMemo(
    () => [
      { label: "Products", value: stats?.products ?? 0, icon: ShoppingBag, href: "/dashboard/products" },
      { label: "Customers", value: stats?.customers ?? 0, icon: Users, href: "/dashboard/customers" },
      { label: "Orders", value: stats?.orders ?? 0, icon: CreditCard, href: "/dashboard/payments" },
      { label: "Payment Links", value: stats?.paymentLinks ?? 0, icon: CreditCard, href: "/dashboard/payments" },
    ],
    [stats],
  );

  const quickActions = useMemo(
    () => [
      { label: "Add Product", icon: Plus, href: "/dashboard/products" },
      { label: "Create Payment Link", icon: CreditCard, href: "/dashboard/payments" },
      { label: "Add Customer", icon: Users, href: "/dashboard/customers" },
      { label: "Send Message", icon: MessageSquare, href: "/dashboard/messaging" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        onNavigate={closeSidebar}
        onSignOut={handleSignOut}
        isActive={isActive}
        businessName={business?.name ?? null}
        canAccessHref={canAccessHref}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/50 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      <div className="flex-1 lg:ml-64">
        <DashboardHeader onOpenSidebar={openSidebar} />

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

              <PendingApprovalBanner />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s) => (
                  <StatCard key={s.label} {...s} />
                ))}
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((a) => (
                    <QuickActionCard key={a.label} {...a} />
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
