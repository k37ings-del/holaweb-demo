import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Lightbulb, Layers, Link2, Target } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Strategic Thinking",
    brief: "Data-driven strategies aligned with your business vision.",
    detail:
      "We don't just build — we think. Our strategists analyze your market, competitors, and internal capabilities to craft a digital roadmap that delivers measurable ROI. Every decision is backed by data, ensuring your investments drive real growth.",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    brief: "Systems designed to grow with your ambitions.",
    detail:
      "From microservices to cloud-native infrastructure, we architect solutions that handle today's load and tomorrow's scale. Whether you're serving hundreds or millions, your technology stack will be ready — resilient, performant, and cost-efficient.",
  },
  {
    icon: Link2,
    title: "Seamless Integration",
    brief: "Connecting every tool and platform into one ecosystem.",
    detail:
      "Disparate systems slow you down. We unify your CRMs, ERPs, payment gateways, and communication platforms into a single, cohesive ecosystem — eliminating data silos and enabling real-time visibility across your entire operation.",
  },
  {
    icon: Target,
    title: "Market-Focused Execution",
    brief: "Delivering results that drive real market impact.",
    detail:
      "Strategy without execution is just theory. We take your products to market through proven distribution networks, customer acquisition campaigns, and performance-driven tactics — turning your digital investment into revenue.",
  },
];

const TransformationPartnerSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
            Our Approach
          </span>
          <h2 className="font-garet text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your End-to-End Digital Transformation Partner
          </h2>
          <p className="font-poppins text-muted-foreground max-w-2xl mx-auto">
            We bridge strategy, technology, and execution — not just building systems but enabling
            growth across every stage of your digital journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => {
            const isOpen = expandedIndex === i;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setExpandedIndex(isOpen ? null : i)}
                className="cursor-pointer group rounded-2xl border border-golden/10 bg-card p-6 hover:border-golden/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_hsl(42_100%_67%/0.08)]"
              >
                <div className="w-14 h-14 rounded-full border-2 border-golden/20 bg-golden/10 flex items-center justify-center mb-5 group-hover:border-golden/50 transition-colors">
                  <p.icon className="w-6 h-6 text-golden" />
                </div>
                <h3 className="font-garet text-lg font-bold text-foreground mb-2 group-hover:text-golden transition-colors">
                  {p.title}
                </h3>
                <p className="font-poppins text-muted-foreground text-sm leading-relaxed">
                  {p.brief}
                </p>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="w-full h-px bg-golden/20 mb-3" />
                      <p className="font-poppins text-muted-foreground text-xs leading-relaxed">
                        {p.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className="inline-block mt-4 text-golden text-xs font-noto">
                  {isOpen ? "Tap to close" : "Tap to learn more"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TransformationPartnerSection;
