import { motion } from "framer-motion";
import { ArrowDown, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToServices = () => {
    document.getElementById("services-tiles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />

      {/* Floating cherry particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 14}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center max-w-4xl">
        <motion.h1
          className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Empowering Africa's{" "}
          <span className="text-primary">Digital Future</span>
        </motion.h1>

        <motion.p
          className="font-subheading text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Complete technology solutions tailored for businesses across Africa
        </motion.p>

        <motion.p
          className="font-body text-sm md:text-base text-muted-foreground/80 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          From cloud infrastructure and web development to market distribution and META business solutions — we help you scale with confidence.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={scrollToServices}
            className="btn-cherry flex items-center gap-2 text-base rounded-lg px-6 py-3"
          >
            Explore Our Services
            <ArrowDown className="w-4 h-4" />
          </button>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-base hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book a Strategy Call
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
