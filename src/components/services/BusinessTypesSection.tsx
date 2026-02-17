import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Building2, Globe } from "lucide-react";

const businessTypes = [
  {
    icon: Zap,
    title: "Startups",
    description: "Complete digital solutions from MVP development to market access and growth scaling",
    badge: "Custom Packages",
  },
  {
    icon: Building2,
    title: "SMEs",
    description: "Cloud migration, web development, and digital transformation for growing businesses",
    badge: "Flexible Pricing",
  },
  {
    icon: Globe,
    title: "Enterprises",
    description: "Enterprise-grade cloud infrastructure, security, and advanced integration solutions",
    badge: "Enterprise Plans",
  },
];

const BusinessTypesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary text-sm font-subheading uppercase tracking-widest mb-3 block">Tailored Solutions</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solutions for Every Business Type
          </h2>
          <p className="font-body font-light text-muted-foreground max-w-2xl mx-auto">
            Whether you're a startup, SME, or enterprise, we have the expertise and solutions to accelerate your digital transformation journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessTypes.map((biz, i) => (
            <motion.div
              key={biz.title}
              className="border border-primary/10 bg-card/80 backdrop-blur-sm p-8 text-center hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <biz.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{biz.title}</h3>
              <p className="font-body font-light text-muted-foreground text-sm leading-relaxed mb-4">
                {biz.description}
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-subheading uppercase tracking-wider mb-6">
                {biz.badge}
              </span>
              <div>
                <Link to="/contact" className="btn-cherry inline-block text-sm rounded-lg px-6 py-3">
                  Get Quote
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessTypesSection;
