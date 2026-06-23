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
    price: "R1,500",
    period: " (once-off)",
    trial: "7-day free trial",
    icon: Zap,
    description: "Perfect for individuals, startups, and small businesses who need a professional online presence.",
    sections: [
      {
        title: "WEBSITE",
        features: [
          "3-page website (Home, About, Contact)",
          "Mobile-responsive design",
          "WhatsApp chat integration",
          "Contact form (lead capture)",
          "Basic SEO setup",
          "Google Maps integration",
        ],
      },
      {
        title: "HOSTING & DOMAIN",
        features: [
          "Free .co.za domain (1 year)",
          "1-year hosting (SSD)",
          "Free SSL certificate",
          "5 professional email accounts",
        ],
      },
      {
        title: "SUPPORT",
        features: [
          "1 revision round",
          "Email support (48hr response)",
          "30-day post-launch support",
        ],
      },
    ],
    outcomes: ["You are online", "Customers can find and contact you"],
    cta: "Start 7-Day Free Trial",
    highlighted: false,
    slug: "starter",
  },
  {
    name: "Growth",
    price: "R3,000",
    period: " (once-off)",
    trial: "14-day free trial",
    icon: Star,
    description: "Designed for growing businesses that want to attract, engage, and convert customers.",
    sections: [
      {
        title: "WEBSITE",
        features: [
          "5-page website (+ Services page)",
          "Custom design (brand colours & identity)",
          "WhatsApp + contact & enquiry forms",
          "Blog/news section (CMS-enabled)",
          "Full on-page SEO + Google Business setup",
          "Google Analytics integration",
          "Social media integration",
          "Image gallery / portfolio",
        ],
      },
      {
        title: "LEAD & CUSTOMER TOOLS",
        features: [
          "Multi-step forms (lead capture)",
          "Basic customer tracking (form submissions)",
        ],
      },
      {
        title: "HOSTING & DOMAIN",
        features: [
          "Free .co.za domain (1 year)",
          "1-year hosting — 10GB SSD",
          "Free SSL certificate",
          "20 professional email accounts",
          "Daily automated backups",
        ],
      },
      {
        title: "SUPPORT",
        features: [
          "2 revision rounds",
          "WhatsApp + email support",
          "60-day post-launch support",
          "CMS training (30 min)",
        ],
      },
    ],
    outcomes: ["You attract and capture leads", "You build credibility", "You start understanding your customers"],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
    slug: "growth",
  },
  {
    name: "Business",
    price: "R5,000",
    period: " (once-off)",
    trial: null,
    icon: Building2,
    description: "Built for businesses that want to sell products and accept payments online.",
    sections: [
      {
        title: "WEBSITE & STORE",
        features: [
          "Up to 10 pages — fully custom designed",
          "E-commerce store (up to 20 products)",
          "Product catalog + categories",
          "Optimized product pages",
        ],
      },
      {
        title: "PAYMENTS & SALES",
        features: [
          "Payment gateway integration (Paystack / Flutterwave)",
          "Secure checkout experience",
          "Payment link generation",
          "Order management system",
        ],
      },
      {
        title: "CUSTOMER EXPERIENCE",
        features: [
          "WhatsApp integration (sales & enquiries)",
          "Lead capture forms",
          "Email notifications (orders & enquiries)",
        ],
      },
      {
        title: "PERFORMANCE & SEO",
        features: [
          "Full SEO (technical + on-page + schema)",
          "Speed optimisation (Core Web Vitals)",
        ],
      },
      {
        title: "HOSTING & DOMAIN",
        features: [
          "Free .co.za domain (1 year)",
          "1-year hosting — 20GB SSD",
          "Free SSL certificate",
          "50 professional email accounts",
          "Daily backups + malware scanning",
        ],
      },
      {
        title: "SUPPORT",
        features: [
          "Priority support (WhatsApp + email)",
          "60-day post-launch support",
          "CMS training session",
        ],
      },
    ],
    outcomes: ["You can sell online", "You can receive payments", "You have a working digital sales system"],
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
    sections: [
      {
        title: "INCLUDES",
        features: [
          "Everything in Business",
          "Unlimited team members",
          "Custom integrations",
          "Dedicated account manager",
          "SLA guarantee",
          "White-label options",
        ],
      },
    ],
    outcomes: [],
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
      .rpc("get_active_referral_code", { _code: promoCode })
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
                Choose a bundled package for the complete Business OS experience, or pick individual services that match your needs. No hidden fees.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
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
                      {plan.period && <span className="font-body text-muted-foreground text-xs">{plan.period}</span>}
                    </div>
                    {plan.trial && (
                      <p className="font-subheading text-xs text-primary font-semibold mb-4">{plan.trial}</p>
                    )}
                    {!plan.trial && <div className="mb-4" />}

                    {/* Sections */}
                    <div className="space-y-4 mb-6 flex-1">
                      {plan.sections.map((section) => (
                        <div key={section.title}>
                          <p className="font-subheading text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">{section.title}</p>
                          <ul className="space-y-1.5">
                            {section.features.map((f) => (
                              <li key={f} className="flex items-start gap-2 font-body text-[11px] text-foreground/80">
                                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Outcomes */}
                    {plan.outcomes.length > 0 && (
                      <div className="mb-4 bg-primary/5 border border-primary/10 rounded-lg p-3">
                        <p className="font-subheading text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">Outcome</p>
                        {plan.outcomes.map((o) => (
                          <p key={o} className="font-body text-[11px] text-foreground/80">✔ {o}</p>
                        ))}
                      </div>
                    )}

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
