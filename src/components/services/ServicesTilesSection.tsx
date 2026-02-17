import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cloud, Code, TrendingUp, MessageSquare } from "lucide-react";

const services = [
  {
    icon: Cloud,
    category: "Infrastructure",
    title: "Cloud Services",
    description: "Enterprise-grade AWS cloud solutions for migration, optimization, and scalable infrastructure.",
    features: ["AWS Migration & Setup", "Cost Optimization", "Security & Compliance", "24/7 Monitoring"],
    to: "/services/cloud",
  },
  {
    icon: Code,
    category: "Development",
    title: "Web & App Development",
    description: "Custom-built responsive websites, web platforms, and mobile applications with stunning UI/UX.",
    features: ["Responsive Websites", "Web Platforms", "Mobile Applications", "UI/UX Design"],
    to: "/services/apps",
  },
  {
    icon: TrendingUp,
    category: "Growth",
    title: "Market Access",
    description: "Strategic distribution, customer acquisition, and market penetration to grow your revenue.",
    features: ["Customer Acquisition", "Distribution Networks", "Market Feedback", "Revenue Growth"],
    to: "/services/gtm",
  },
  {
    icon: MessageSquare,
    category: "Communication",
    title: "META Solutions",
    description: "WhatsApp Business API integration for automated messaging, payments, and CRM workflows.",
    features: ["WhatsApp Business API", "Chatbot Automation", "Payment Integration", "CRM Connection"],
    to: "/services/integrations",
  },
];

const ServicesTilesSection = () => {
  return (
    <section id="services-tiles" className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary text-sm font-subheading uppercase tracking-widest mb-3 block">What We Offer</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Digital Solutions
          </h2>
          <p className="font-body font-light text-muted-foreground max-w-2xl mx-auto">
            End-to-end technology services designed to accelerate your digital transformation journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={service.to}
                className="group block h-full border border-primary/10 bg-card/80 backdrop-blur-sm p-8 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(352_66%_47%/0.1)] transition-all duration-500 hover:-translate-y-1 relative"
              >
                {service.title === "Cloud Services" && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-subheading font-bold uppercase tracking-wider shadow-lg animate-pulse">
                    Most Popular
                  </span>
                )}

                <div className="w-20 h-20 rounded-full border-2 border-primary/20 bg-muted/30 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-subheading uppercase tracking-wider mb-3">
                  {service.category}
                </span>

                <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="font-body font-light text-muted-foreground text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-body font-light text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <span className="btn-cherry inline-block text-sm rounded-lg px-4 py-2">
                  Learn More →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesTilesSection;
