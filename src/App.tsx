import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
const ChatAssistant = lazy(() => import("@/components/ChatAssistant"));
import BackToTopButton from "@/components/BackToTopButton";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ErrorBoundary } from "@/components/feedback";

// Wrap dynamic imports to recover from stale chunk hashes after a redeploy.
const lazyWithReload = <T,>(factory: () => Promise<T>) =>
  lazy(() =>
    (factory() as Promise<any>).catch((err) => {
      const msg = String(err?.message || err);
      if (/Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg)) {
        const key = "__chunk_reload_at";
        const last = Number(sessionStorage.getItem(key) || 0);
        if (Date.now() - last > 10000) {
          sessionStorage.setItem(key, String(Date.now()));
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw err;
    }),
  );

const Index = lazyWithReload(() => import("@/pages/Index"));
const About = lazyWithReload(() => import("@/pages/About"));
const ServiceDetail = lazyWithReload(() => import("@/pages/ServiceDetail"));
const Demo = lazyWithReload(() => import("@/pages/Demo"));
const Contact = lazyWithReload(() => import("@/pages/Contact"));
const Platform = lazyWithReload(() => import("@/pages/Platform"));
const Auth = lazyWithReload(() => import("@/pages/Auth"));
const AdminAuth = lazyWithReload(() => import("@/pages/AdminAuth"));
const AdminDashboard = lazyWithReload(() => import("@/pages/AdminDashboard"));
const Onboarding = lazyWithReload(() => import("@/pages/Onboarding"));
const Dashboard = lazyWithReload(() => import("@/pages/Dashboard"));
const Checkout = lazyWithReload(() => import("@/pages/Checkout"));
const NotFound = lazyWithReload(() => import("@/pages/NotFound"));
const Portal = lazyWithReload(() => import("@/pages/Portal"));

const Products = lazyWithReload(() => import("@/pages/dashboard/Products"));
const Payments = lazyWithReload(() => import("@/pages/dashboard/Payments"));
const Customers = lazyWithReload(() => import("@/pages/dashboard/Customers"));
const Messaging = lazyWithReload(() => import("@/pages/dashboard/Messaging"));
const Website = lazyWithReload(() => import("@/pages/dashboard/Website"));
const Analytics = lazyWithReload(() => import("@/pages/dashboard/Analytics"));
const DashboardSettings = lazyWithReload(() => import("@/pages/dashboard/DashboardSettings"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="font-body text-muted-foreground">Loading...</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BusinessProvider>
            <ErrorBoundary>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/platform" element={<Platform />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<AdminAuth />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/checkout/:slug" element={<Checkout />} />
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="products" element={<Products />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="messaging" element={<Messaging />} />
                    <Route path="website" element={<Website />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<DashboardSettings />} />
                  </Route>
                  <Route path="/portal" element={<Portal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Suspense fallback={null}>
                <ChatAssistant />
              </Suspense>
              <BackToTopButton />
            </ErrorBoundary>
          </BusinessProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
