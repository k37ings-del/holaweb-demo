import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessService, productService } from "@/services";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Briefcase,
  Layers,
  Globe,
  CreditCard,
  MessageSquare,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Rocket,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/HW_Logo.png";

type BusinessType = "products" | "services" | "both";
type SetupPriority = "website" | "payments" | "messaging" | "crm";
type RequestedModule = "ecommerce" | "meta" | "crm";

const steps = [
  { id: "business", label: "Business Setup" },
  { id: "type", label: "Business Type" },
  { id: "priorities", label: "Setup Priorities" },
  { id: "modules", label: "Requested Modules" },
  { id: "details", label: "First Steps" },
  { id: "complete", label: "You're Live" },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [priorities, setPriorities] = useState<SetupPriority[]>([]);
  const [requestedModules, setRequestedModules] = useState<RequestedModule[]>([]);
  const [firstProductName, setFirstProductName] = useState("");
  const [firstProductPrice, setFirstProductPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const togglePriority = (p: SetupPriority) =>
    setPriorities((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const toggleModule = (m: RequestedModule) =>
    setRequestedModules((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleComplete = async () => {
    if (!userId || !businessName || !businessType) return;
    setLoading(true);
    try {
      const business = await businessService.createBusiness({
        user_id: userId,
        name: businessName,
        type: businessType,
        setup_priorities: priorities,
        onboarding_completed: true,
      });

      // Persist requested modules for super-admin review.
      if (business && requestedModules.length > 0) {
        await supabase
          .from("businesses")
          .update({ requested_modules: requestedModules } as any)
          .eq("id", business.id);
      }

      if (firstProductName && business) {
        await productService.createProduct(business.id, userId, {
          name: firstProductName,
          price: parseFloat(firstProductPrice) || 0,
          type: businessType === "services" ? "service" : "product",
        });
      }

      setCurrentStep(5);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return businessName.trim().length > 0;
      case 1: return businessType !== null;
      case 2: return priorities.length > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 4) handleComplete();
    else setCurrentStep((prev) => Math.min(prev + 1, 5));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <h1 className="sr-only">Set up your Holaweb business workspace</h1>
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <img src={logo} alt="Holaweb" className="h-8" />
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={step.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentStep ? "bg-primary w-8" : "bg-muted w-4"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div key="business" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">What's your business called?</h2>
                  <p className="font-body text-muted-foreground">This is how customers will see you.</p>
                </div>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-4 text-foreground font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Mama's Kitchen" autoFocus />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">What do you do?</h2>
                  <p className="font-body text-muted-foreground">We'll customize your setup based on this.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "products" as BusinessType, icon: ShoppingBag, label: "Sell Products", desc: "Physical or digital goods" },
                    { value: "services" as BusinessType, icon: Briefcase, label: "Offer Services", desc: "Consulting, repairs, etc." },
                    { value: "both" as BusinessType, icon: Layers, label: "Both", desc: "Products and services" },
                  ].map((option) => (
                    <button key={option.value} onClick={() => setBusinessType(option.value)}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                        businessType === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${businessType === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-subheading text-sm font-semibold text-foreground">{option.label}</p>
                        <p className="font-body text-xs text-muted-foreground">{option.desc}</p>
                      </div>
                      {businessType === option.value && <Check className="w-5 h-5 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="priorities" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">What do you want to set up first?</h2>
                  <p className="font-body text-muted-foreground">Pick one or more. You can always add the rest later.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "website" as SetupPriority, icon: Globe, label: "Website" },
                    { value: "payments" as SetupPriority, icon: CreditCard, label: "Payments" },
                    { value: "messaging" as SetupPriority, icon: MessageSquare, label: "Messaging" },
                    { value: "crm" as SetupPriority, icon: Users, label: "CRM" },
                  ].map((option) => {
                    const selected = priorities.includes(option.value);
                    return (
                      <button key={option.value} onClick={() => togglePriority(option.value)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-lg border transition-all ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <option.icon className="w-6 h-6" />
                        </div>
                        <span className="font-subheading text-sm font-semibold text-foreground">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="modules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Any advanced modules you need?</h2>
                  <p className="font-body text-muted-foreground">
                    Pick what applies. Requested modules are reviewed by our team before being unlocked on your dashboard.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "ecommerce" as RequestedModule, icon: ShoppingBag, label: "eCommerce platform", desc: "Full product catalog & storefront" },
                    { value: "meta" as RequestedModule, icon: MessageSquare, label: "META integrations", desc: "WhatsApp, Instagram & Facebook messaging" },
                    { value: "crm" as RequestedModule, icon: BarChart3, label: "CRM / Analytics", desc: "Customer insights and reporting" },
                  ].map((opt) => {
                    const selected = requestedModules.includes(opt.value);
                    return (
                      <button key={opt.value} onClick={() => toggleModule(opt.value)}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <opt.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-subheading text-sm font-semibold text-foreground">{opt.label}</p>
                          <p className="font-body text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                        {selected && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  These pages stay in a <em>Pending approval</em> state on your dashboard until an admin activates them after your subscription is confirmed.
                </p>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                    Add your first {businessType === "services" ? "service" : "product"}
                  </h2>
                  <p className="font-body text-muted-foreground">Optional — you can skip this and add later.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-sm text-foreground mb-1.5">
                      {businessType === "services" ? "Service" : "Product"} name
                    </label>
                    <input type="text" value={firstProductName} onChange={(e) => setFirstProductName(e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={businessType === "services" ? "e.g. Hair Braiding" : "e.g. T-Shirt (Large)"} />
                  </div>
                  <div>
                    <label className="block font-body text-sm text-foreground mb-1.5">Price (ZAR)</label>
                    <input type="number" value={firstProductPrice} onChange={(e) => setFirstProductPrice(e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="0.00" min="0" step="0.01" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  Your business is <span className="text-primary">live!</span>
                </h2>
                <p className="font-body text-muted-foreground max-w-sm mx-auto">
                  {businessName} is set up and ready. Head to your dashboard to start building.
                </p>
                <button onClick={() => navigate("/dashboard")}
                  className="btn-cherry inline-flex items-center gap-2 rounded-lg px-8 py-4 font-subheading text-sm font-semibold">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {currentStep < 5 && (
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <button onClick={prevStep} disabled={currentStep === 0}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={nextStep} disabled={!canProceed() || loading}
            className="btn-cherry flex items-center gap-2 rounded-lg px-6 py-3 font-subheading text-sm font-semibold disabled:opacity-50">
            {loading ? "Setting up..." : currentStep === 4 ? "Launch Business" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
