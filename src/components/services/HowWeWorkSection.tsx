import { motion } from "framer-motion";
import { Search, PenTool, Hammer, Rocket } from "lucide-react";

const steps = [
  { icon: Search, step: "Step 1", title: "Discover", description: "Deep-dive into your goals, challenges, and opportunities." },
  { icon: PenTool, step: "Step 2", title: "Design", description: "Architect solutions tailored to your unique requirements." },
  { icon: Hammer, step: "Step 3", title: "Build", description: "Develop, test, and iterate with agile precision." },
  { icon: Rocket, step: "Step 4", title: "Scale", description: "Launch confidently and scale for sustained growth." },
];

const HowWeWorkSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary text-sm font-subheading uppercase tracking-widest mb-3 block">
            Our Process
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            How We Work
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-primary/20" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-primary/30 bg-card flex items-center justify-center mb-5 relative z-10">
                <s.icon className="w-10 h-10 text-primary" />
              </div>
              <span className="text-primary text-xs font-subheading uppercase tracking-widest mb-1 block">
                {s.step}
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{s.title}</h3>
              <p className="font-body font-light text-muted-foreground text-sm leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWorkSection;
