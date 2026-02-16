import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-muted/20 border-y border-golden/10 flex items-center justify-center">
        <span className="text-muted-foreground/20 font-poppins text-sm">Background Image Placeholder</span>
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-golden text-sm font-noto uppercase tracking-widest mb-3 block">
            Get Started
          </span>
          <h2 className="font-garet text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Digital Ecosystem?
          </h2>
          <p className="font-poppins text-muted-foreground text-lg leading-relaxed mb-8">
            Let's build technology that drives real growth. Whether you need cloud infrastructure, a custom application, market distribution, or streamlined communications — our team is ready to turn your vision into measurable outcomes. Start with a free consultation.
          </p>
          <Link
            to="/contact"
            className="btn-cherry inline-flex items-center gap-2 text-base"
          >
            Book a Strategy Call <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
