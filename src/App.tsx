import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import ServiceDetail from "./pages/ServiceDetail";
import Demo from "./pages/Demo";
import Contact from "./pages/Contact";
import Platform from "./pages/Platform";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import ChatAssistant from "./components/ChatAssistant";
import BackToTopButton from "./components/BackToTopButton";

// Dashboard sub-pages
import Products from "./pages/dashboard/Products";
import Payments from "./pages/dashboard/Payments";
import Customers from "./pages/dashboard/Customers";
import Messaging from "./pages/dashboard/Messaging";
import Website from "./pages/dashboard/Website";
import Analytics from "./pages/dashboard/Analytics";
import DashboardSettings from "./pages/dashboard/DashboardSettings";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/pricing" element={<Pricing />} />
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
        <ChatAssistant />
        <BackToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
