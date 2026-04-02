import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  CreditCard,
  Users,
  ArrowRight,
  Check,
  Zap,
  Shield,
  BarChart3,
  ChevronRight,
  Instagram,
  MessageSquare,
  Mail,
  Phone,
  Share2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";
import platformHeroBg from "@/assets/platform-hero-bg.jpg";
import buildWebsitesImg from "@/assets/build-websites.jpeg";
import metaAdsImg from "@/assets/meta-ads.jpg";
import paymentSystemsImg from "@/assets/payment-systems.jpg";
import ecommerceCrmImg from "@/assets/ecommerce-crm.jpg";

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const features = [
  {
    icon: Globe,
    title: "Custom Websites",
    description:
      "Get affordable, interactive, and fully responsive websites custom-built to your liking. Whether you need a sleek e-commerce store, a corporate-grade platform, a portfolio site, or a booking system — our team designs and develops it to match your brand, your audience, and your goals. Every site is mobile-optimised, SEO-ready, and built on secure cloud infrastructure.",
    highlights: ["E-commerce stores", "Corporate platforms", "Portfolio & booking sites", "Mobile-optimised & SEO-ready", "Custom domains & SSL"],
    image: buildWebsitesImg,
  },
  {
    icon: CreditCard,
    title: "Payments",
    description:
      "Accept payments from anywhere in Africa and beyond with our Peach Payments-powered checkout system. Create shareable payment links in seconds, embed checkout pages on your website, set up subscription billing for recurring revenue, and support multiple currencies including ZAR, USD, and mobile money. Every transaction is secured with bank-level encryption.",
    highlights: ["Shareable payment links", "Embeddable checkout pages", "Subscription billing", "Multi-currency & mobile money", "Bank-level encryption"],
    image: paymentSystemsImg,
  },
  {
    icon: Share2,
    title: "Meta Business Solutions",
    description:
      "Supercharge your business reach with Meta's full suite of tools. Run highly targeted ads on Facebook and Instagram to reach your ideal customers, automate customer conversations on WhatsApp Business API with chatbots and quick replies, manage all your social interactions from Meta Business Suite, and leverage audience insights and retargeting to maximise your ROI on every campaign.",
    highlights: [
      "Facebook & Instagram Ads",
      "WhatsApp Business API",
      "Automated messaging & chatbots",
      "Audience insights & retargeting",
      "Meta Business Suite integration",
    ],
    image: metaAdsImg,
  },
  {
    icon: Users,
    title: "CRM & Data",
    description:
      "Know your customers like never before. Build detailed customer profiles with purchase history, communication logs, and custom tags. Segment your audience for targeted campaigns, track engagement patterns to predict buying behaviour, and use data-driven insights to drive repeat business and increase lifetime value.",
    highlights: ["Detailed customer profiles", "Purchase & engagement history", "Smart tags & segmentation", "Behavioural insights", "Zoho CRM integration"],
    image: ecommerceCrmImg,
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
          <img
            src={platformHeroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/75" />
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
                  to="/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-4 font-subheading text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  See Our Demo
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
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}
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
                    {feature.title === "Custom Websites" && (
                      <>Your storefront, <span className="text-primary">your way</span></>
                    )}
                    {feature.title === "Payments" && (
                      <>Get paid <span className="text-primary">instantly</span></>
                    )}
                    {feature.title === "Meta Business Solutions" && (
                      <>Grow with <span className="text-primary">Meta</span></>
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
                  {feature.title === "Custom Websites" && (
                    <Link
                      to="/dashboard/website"
                      className="mt-4 btn-cherry inline-flex items-center gap-2 rounded-lg px-6 py-3 font-subheading text-xs font-semibold shadow-lg w-fit"
                    >
                      Start Building Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                <div className={index % 2 !== 0 ? "lg:order-1" : ""}>
                  <div className="aspect-[4/3] bg-card border border-border rounded-lg overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
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
