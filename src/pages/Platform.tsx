import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  CreditCard,
  MessageSquare,
  Users,
  ArrowRight,
  Check,
  Zap,
  Shield,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";

const features = [
  {
    icon: Globe,
    title: "Website Builder",
    description:
      "Create stunning landing pages, online stores, and booking pages — no coding required. Optimized for mobile and built to convert.",
    highlights: ["Landing pages", "Online stores", "Booking pages", "Custom domains"],
  },
  {
    icon: CreditCard,
    title: "Payments",
    description:
      "Accept payments instantly with shareable payment links, checkout pages, and subscription billing. Built for Africa.",
    highlights: ["Payment links", "Checkout pages", "Subscriptions", "Mobile money"],
  },
  {
    icon: MessageSquare,
    title: "Messaging",
    description:
      "Reach customers on WhatsApp, email, and SMS. Share products, send invoices, and automate notifications from one inbox.",
    highlights: ["WhatsApp Business", "Email campaigns", "Order notifications", "Invoice sharing"],
  },
  {
    icon: Users,
    title: "CRM & Data",
    description:
      "Know your customers. Track purchases, segment audiences, and drive repeat business with smart engagement tools.",
    highlights: ["Customer profiles", "Purchase history", "Tags & segments", "Engagement tracking"],
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Get started with the basics",
    features: ["1 Payment link", "Basic website", "Up to 50 customers", "WhatsApp sharing"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "R499",
    period: "/mo",
    description: "Everything you need to grow",
    features: [
      "Unlimited payment links",
      "Full website builder",
      "Unlimited customers",
      "WhatsApp + Email",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For scaling businesses",
    features: [
      "Everything in Growth",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "API access",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Platform = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        {/* Hero */}
        <section className="relative min-h-screen flex items-center pt-32 lg:pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-primary/10 border border-primary/20 text-primary font-subheading text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
                Business Operating System
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
                Run your business{" "}
                <span className="text-primary">in one place</span>
              </h1>
              <p className="font-body font-light text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Build websites, accept payments, manage customers, and communicate
                with clients — all from a single platform designed for African
                businesses.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth"
                  className="btn-cherry inline-flex items-center gap-2 rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-4 font-subheading text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  See How It Works
                </Link>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Shield, label: "Bank-level security" },
                { icon: Zap, label: "Setup in minutes" },
                { icon: BarChart3, label: "Real-time analytics" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 font-body text-sm">
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <section
            key={feature.title}
            className={`py-24 ${index % 2 === 0 ? "" : "bg-secondary/20"}`}
          >
            <div className="container mx-auto px-6">
              <motion.div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={index % 2 !== 0 ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="font-subheading text-xs font-semibold text-primary uppercase tracking-wider">
                      {feature.title}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {feature.title === "Website Builder" && (
                      <>Your storefront, <span className="text-primary">your way</span></>
                    )}
                    {feature.title === "Payments" && (
                      <>Get paid <span className="text-primary">instantly</span></>
                    )}
                    {feature.title === "Messaging" && (
                      <>Connect on every <span className="text-primary">channel</span></>
                    )}
                    {feature.title === "CRM & Data" && (
                      <>Know your <span className="text-primary">customers</span></>
                    )}
                  </h2>
                  <p className="font-body font-light text-muted-foreground text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-3 font-body text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={index % 2 !== 0 ? "lg:order-1" : ""}>
                  <div className="aspect-[4/3] bg-card border border-border rounded-lg flex items-center justify-center">
                    <feature.icon className="w-24 h-24 text-primary/20" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        ))}

        {/* Pricing Preview */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple, transparent <span className="text-primary">pricing</span>
              </h2>
              <p className="font-body font-light text-muted-foreground text-lg max-w-xl mx-auto">
                Start free. Scale as you grow. No hidden fees.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  className={`relative bg-card border rounded-lg p-8 flex flex-col ${
                    plan.highlighted
                      ? "border-primary shadow-lg shadow-primary/10 scale-105"
                      : "border-border"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-subheading text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="font-body text-muted-foreground">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 font-body text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.name === "Enterprise" ? "/contact" : "/auth"}
                    className={`text-center rounded-lg px-6 py-3 font-subheading text-sm font-semibold transition-all ${
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

        {/* Final CTA */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to grow your <span className="text-primary">business</span>?
              </h2>
              <p className="font-body font-light text-muted-foreground text-lg mb-8">
                Join thousands of African businesses already using Holaweb to sell, get paid, and grow.
              </p>
              <Link
                to="/auth"
                className="btn-cherry inline-flex items-center gap-2 rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
              >
                Start Free Today <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Platform;
