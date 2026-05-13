import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ArrowRight, Monitor, CreditCard, Users, Globe, MessageSquare, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";

const demoSections = [
  {
    icon: Monitor,
    title: "Dashboard Overview",
    description: "See how the central command center gives you a bird's-eye view of your entire business.",
    comingSoon: true,
  },
  {
    icon: Globe,
    title: "Website Builder",
    description: "Watch how to create a stunning landing page or online store in minutes — no coding required.",
    comingSoon: true,
  },
  {
    icon: CreditCard,
    title: "Payments & Checkout",
    description: "Learn how to create payment links, set up checkout pages, and start accepting payments instantly.",
    comingSoon: true,
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Discover how to track customers, segment audiences, and drive repeat business.",
    comingSoon: true,
  },
  {
    icon: MessageSquare,
    title: "Meta Business Suite",
    description: "See how WhatsApp Business, Facebook Ads, and Instagram work together to grow your reach.",
    comingSoon: true,
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Explore real-time dashboards that show you exactly how your business is performing.",
    comingSoon: true,
  },
];

const Demo = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEO
        title="Holaweb Demo — Walkthrough of the Business OS"
        description="Watch a guided walkthrough of the Holaweb platform — dashboard, website builder, payments, CRM, and messaging."
        path="/demo"
      />
      <FloatingBubbles />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center pt-32 lg:pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-primary/10 border border-primary/20 text-primary font-subheading text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
                Product Demo
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                See Holaweb <span className="text-primary">in action</span>
              </h1>
              <p className="font-body font-light text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Explore step-by-step video walkthroughs showing exactly how Holaweb helps you build, sell, and grow your business.
              </p>
              <Link
                to="/auth"
                className="btn-cherry inline-flex items-center gap-2 rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
              >
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Demo Sections Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Platform <span className="text-primary">Walkthroughs</span>
              </h2>
              <p className="font-body font-light text-muted-foreground text-lg max-w-xl mx-auto">
                Video tutorials for every feature — coming soon.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {demoSections.map((section, i) => (
                <motion.div
                  key={section.title}
                  className="relative bg-card border border-border rounded-lg overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Video placeholder */}
                  <div className="aspect-video bg-secondary/30 flex items-center justify-center relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary ml-1" />
                    </div>
                    {section.comingSoon && (
                      <span className="absolute top-3 right-3 bg-muted text-muted-foreground font-subheading text-xs font-semibold px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <section.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {section.title}
                      </h3>
                    </div>
                    <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to try it <span className="text-primary">yourself</span>?
              </h2>
              <p className="font-body font-light text-muted-foreground text-lg mb-8">
                Sign up for free and experience the full platform firsthand.
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

export default Demo;
