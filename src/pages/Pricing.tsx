import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, Zap, Building2, Crown, Globe, CreditCard, Users, Share2, Cloud, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";
import { supabase } from "@/integrations/supabase/client";

const bundledPlans = [
  {
    name: "Starter",
    price: "R299",
    period: "/mo",
    trial: "7-day free trial",
    icon: Zap,
    description: "Perfect for solo entrepreneurs and micro businesses just getting started.",
    features: [
      "1 Payment link",
      "Basic website template",
      "Up to 50 customers",
      "WhatsApp sharing",
      "Email support",
    ],
    cta: "Start 7-Day Free Trial",
    highlighted: false,
    slug: "starter",
  },
  {
    name: "Growth",
    price: "R599",
    period: "/mo",
    trial: "14-day free trial",
    icon: Star,
    description: "Everything you need to grow and manage a thriving small business.",
    features: [
      "Unlimited payment links",
      "Full website builder",
      "Unlimited customers",
      "WhatsApp + Email + SMS",
      "Analytics dashboard",
      "Priority support",
      "Custom domain",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
    slug: "growth",
  },
  {
    name: "Business",
    price: "R1,499",
    period: "/mo",
    trial: null,
    icon: Building2,
    description: "Advanced tools for established businesses ready to scale operations.",
    features: [
      "Everything in Growth",
      "Meta Business Suite integration",
      "Advanced CRM & segmentation",
      "Team collaboration (3 users)",
      "API access",
      "Dedicated onboarding",
    ],
    cta: "Get Started",
    highlighted: false,
    slug: "business",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    trial: null,
    icon: Crown,
    description: "Tailored solutions for large organizations with complex requirements.",
    features: [
      "Everything in Business",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label options",
    ],
    cta: "Contact Sales",
    highlighted: false,
    slug: "enterprise",
  },
];

const independentServices = [
  {
    icon: Globe,
    name: "Custom Websites",
    price: "R199",
    period: "/mo",
    trial: "7-day free trial",
    description: "Responsive, mobile-optimised websites with custom domain, SSL certificate, and monthly maintenance.",
    features: ["Responsive website design", "Mobile optimised", "Custom domain setup", "SSL certificate", "Monthly maintenance"],
    slug: "service-websites",
  },
  {
    icon: CreditCard,
    name: "Payment Processing",
    price: "R149",
    period: "/mo",
    trial: "7-day free trial",
    description: "Accept payments instantly with shareable payment links, checkout pages, and detailed transaction reports.",
    features: ["Payment link generator", "Checkout pages", "Transaction reports", "Multi-currency support"],
    slug: "service-payments",
  },
  {
    icon: Users,
    name: "CRM & Customer Management",
    price: "R199",
    period: "/mo",
    trial: "7-day free trial",
    description: "Track customers, segment audiences, and drive repeat business with smart engagement tools.",
    features: ["Customer profiles", "Tags & segmentation", "Purchase history tracking", "Notes & engagement logs"],
    slug: "service-crm",
  },
  {
    icon: Share2,
    name: "Meta Business Solutions",
    price: "R349",
    period: "/mo",
    trial: null,
    description: "Run targeted ads on Facebook & Instagram, automate WhatsApp conversations, and manage everything from Meta Business Suite.",
    features: ["WhatsApp Business API", "Facebook & Instagram Ads", "Automated messaging", "Audience insights"],
    slug: "service-meta",
  },
  {
    icon: Cloud,
    name: "Cloud & Hosting",
    price: "R249",
    period: "/mo",
    trial: null,
    description: "Enterprise-grade AWS managed hosting with SSL, CDN, daily backups, and 99.9% uptime guarantee.",
    features: ["AWS managed hosting", "SSL & CDN", "Daily backups", "99.9% uptime SLA"],
    slug: "service-cloud",
  },
  {
    icon: BarChart3,
    name: "Analytics & Reporting",
    price: "R149",
    period: "/mo",
    trial: "7-day free trial",
    description: "Real-time dashboards showing revenue, customer insights, and exportable reports for data-driven decisions.",
    features: ["Real-time dashboards", "Revenue tracking", "Customer insights", "Export reports"],
    slug: "service-analytics",
  },
];

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<"bundled" | "independent">("bundled");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoError, setPromoError] = useState("");

  const applyPromo = async () => {
    setPromoError("");
    setPromoApplied(null);
    if (!promoCode.trim()) return;
    const { data, error } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", promoCode.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      setPromoError("Invalid or expired promo code.");
      return;
    }
    if (data.max_uses && data.current_uses >= data.max_uses) {
      setPromoError("This promo code has reached its maximum uses.");
      return;
    }
    setPromoApplied(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        {/* Hero */}
        <section className="relative pt-32 lg:pt-40 pb-16">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block bg-primary/10 border border-primary/20 text-primary font-subheading text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
                Pricing
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Plans that grow <span className="text-primary">with you</span>
              </h1>
              <p className="font-body font-light text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Choose a bundled package for the complete Business OS experience, or pick individual services that match your needs. No hidden fees. Cancel anytime.
              </p>

              {/* Tab switcher */}
              <div className="inline-flex bg-muted border border-border rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("bundled")}
                  className={`px-6 py-2.5 rounded-md font-subheading text-sm font-semibold transition-all ${
                    activeTab === "bundled" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Bundled Packages
                </button>
                <button
                  onClick={() => setActiveTab("independent")}
                  className={`px-6 py-2.5 rounded-md font-subheading text-sm font-semibold transition-all ${
                    activeTab === "independent" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Independent Services
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Promo Code */}
        <section className="pb-8">
          <div className="container mx-auto px-6 max-w-lg">
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground uppercase"
                placeholder="Enter promo code"
              />
              <button onClick={applyPromo} className="btn-cherry rounded-lg px-5 py-2.5 font-subheading text-xs font-semibold">
                Apply
              </button>
            </div>
            {promoError && <p className="font-body text-xs text-destructive mt-2">{promoError}</p>}
            {promoApplied && (
              <p className="font-body text-xs text-green-500 mt-2">
                ✓ Code <strong>{promoApplied.code}</strong> applied — {promoApplied.discount_type === "percentage" ? `${promoApplied.discount_value}% off` : `R${promoApplied.discount_value} off`}!
              </p>
            )}
          </div>
        </section>

        {/* Bundled Packages */}
        {activeTab === "bundled" && (
          <section className="py-8 pb-24">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {bundledPlans.map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    className={`relative bg-card border rounded-lg p-6 flex flex-col ${
                      plan.highlighted ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" : "border-border"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {plan.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-subheading text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <plan.icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mb-4">{plan.description}</p>
                    <div className="mb-1">
                      <span className="font-heading text-3xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && <span className="font-body text-muted-foreground text-sm">{plan.period}</span>}
                    </div>
                    {plan.trial && (
                      <p className="font-subheading text-xs text-primary font-semibold mb-4">{plan.trial}</p>
                    )}
                    {!plan.trial && <div className="mb-4" />}
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 font-body text-xs text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={plan.slug === "enterprise" ? "/contact" : "/auth"}
                      className={`text-center rounded-lg px-4 py-2.5 font-subheading text-xs font-semibold transition-all ${
                        plan.highlighted
                          ? "btn-cherry"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Independent Services */}
        {activeTab === "independent" && (
          <section className="py-8 pb-24">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {independentServices.map((service, i) => (
                  <motion.div
                    key={service.name}
                    className="bg-card border border-border rounded-lg p-6 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-foreground">{service.name}</h3>
                        {service.trial && (
                          <p className="font-subheading text-[10px] text-primary font-semibold">{service.trial}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                    <div className="mb-4">
                      <span className="font-heading text-2xl font-bold text-foreground">{service.price}</span>
                      <span className="font-body text-muted-foreground text-sm">{service.period}</span>
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 font-body text-xs text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/auth"
                      className="text-center rounded-lg px-4 py-2.5 font-subheading text-xs font-semibold border border-border text-foreground hover:bg-muted transition-all"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Not sure which plan? <span className="text-primary">Let's talk.</span>
              </h2>
              <p className="font-body font-light text-muted-foreground text-lg mb-8">
                Our team will help you find the perfect fit for your business — no pressure, no obligation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="btn-cherry inline-flex items-center gap-2 rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
                >
                  Talk to Sales <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-4 font-subheading text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  See Our Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Pricing;
