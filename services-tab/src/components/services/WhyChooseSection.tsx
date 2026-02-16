import { motion } from "framer-motion";
import { Compass, Scale, TrendingUp, BarChart3 } from "lucide-react";

const reasons = [
  {
    icon: Compass,
    title: "End-to-End Expertise",
    description: "From strategy to execution, we cover the full spectrum of digital transformation.",
  },
  {
    icon: Scale,
    title: "Vendor-Neutral Recommendations",
    description: "We recommend the best solutions for your needs, not tied to any single vendor.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solutions",
    description: "Our architectures grow with you — from startup to enterprise.",
  },
  {
    icon: BarChart3,
    title: "Business-Driven Approach",
    description: "Technology decisions grounded in measurable business outcomes.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-golden text-sm font-noto uppercase tracking-widest mb-3 block">
            Why Us
          </span>
          <h2 className="font-garet text-3xl md:text-4xl font-bold text-foreground">
            Why Companies Choose Holaweb
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-golden/20 bg-golden/10 flex items-center justify-center mb-5 group-hover:border-golden/50 group-hover:scale-110 transition-all duration-300">
                <r.icon className="w-7 h-7 text-golden" />
              </div>
              <h3 className="font-garet text-lg font-bold text-foreground mb-2">
                {r.title}
              </h3>
              <p className="font-poppins text-muted-foreground text-sm leading-relaxed">
                {r.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
