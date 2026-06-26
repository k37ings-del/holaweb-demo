import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ChatAssistant from "@/components/ChatAssistant";
import BackToTopButton from "@/components/BackToTopButton";

const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Demo = lazy(() => import("@/pages/Demo"));
const Contact = lazy(() => import("@/pages/Contact"));
const Platform = lazy(() => import("@/pages/Platform"));
const Auth = lazy(() => import("@/pages/Auth"));
const AdminAuth = lazy(() => import("@/pages/AdminAuth"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Products = lazy(() => import("@/pages/dashboard/Products"));
const Payments = lazy(() => import("@/pages/dashboard/Payments"));
const Customers = lazy(() => import("@/pages/dashboard/Customers"));
const Messaging = lazy(() => import("@/pages/dashboard/Messaging"));
const Website = lazy(() => import("@/pages/dashboard/Website"));
const Analytics = lazy(() => import("@/pages/dashboard/Analytics"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ChatAssistant />
        <BackToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
