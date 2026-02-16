import { motion } from "framer-motion";
import { Shield, Cpu, Rocket, MessageCircle, Cloud, Code, TrendingUp } from "lucide-react";

const stats = [
  { label: "Full-Stack Technology Solutions", value: "Full-Stack" },
  { label: "Business Types Served", value: "All Sizes" },
  { label: "Market Distribution", value: "Global" },
];

const highlights = [
  { icon: Shield, label: "Official AWS Partner" },
  { icon: Cpu, label: "Cloud Innovation Specialists" },
  { icon: Rocket, label: "Startup Go-to-Market Support" },
  { icon: MessageCircle, label: "META Solutions Integration" },
];

const capabilities = [
  { icon: Cloud, label: "Cloud Solutions" },
  { icon: Code, label: "Digital Development" },
  { icon: TrendingUp, label: "Market Access" },
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-card/50 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-golden text-sm font-noto uppercase tracking-widest mb-3 block">About Holaweb</span>
          <h2 className="font-garet text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Technology Solutions Partner
          </h2>
          <p className="font-poppins text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At our core, we are a technology solutions partner committed to empowering businesses of all sizes through cloud innovation, digital product development, and smart distribution strategies.
          </p>
        </motion.div>

        {/* Comprehensive Digital Solutions + Stats side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-16 max-w-5xl mx-auto">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-garet text-xl font-bold text-foreground mb-4">Comprehensive Digital Solutions</h3>
            <p className="font-poppins text-muted-foreground text-sm leading-relaxed mb-4">
              As an official AWS Partner, we deliver scalable, secure, and high-performance cloud solutions tailored to meet the unique needs of startups, SMEs, and large enterprises. Our extended cloud support ensures long-term value by offering performance monitoring, security management, disaster recovery, and cost optimization—helping our clients confidently scale on AWS while staying focused on their core business.
            </p>
            <p className="font-poppins text-muted-foreground text-sm leading-relaxed">
              Beyond building and deploying solutions, we support the go-to-market efforts of tech startups by reselling innovative products through our broad customer network and distribution channels. We focus on startups that already have a working product, and we take on the responsibility of unlocking customer access and scalable distribution.
            </p>
          </motion.div>

          <div className="lg:col-span-2 flex flex-col gap-4 justify-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="p-5 rounded-xl border border-golden/10 bg-background"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-garet text-xl font-bold text-cherry mb-1">{stat.value}</div>
                <div className="font-poppins text-sm text-white">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Highlights - half size */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-golden/10 bg-background hover:border-golden/30 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-8 h-8 rounded-full bg-golden/10 flex items-center justify-center">
                <h.icon className="w-4 h-4 text-golden" />
              </div>
              <span className="font-noto text-xs text-foreground font-medium text-center">{h.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Tech & Industry Agnostic Partner */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-garet text-xl font-bold text-foreground mb-4">Tech & Industry Agnostic Partner</h3>
          <p className="font-poppins text-muted-foreground text-sm leading-relaxed">
            We offer META solutions like WhatsApp integrations and embedded payment systems to enhance client engagement and automate internal business workflows. As a tech and industry-agnostic partner, our mission is to connect great products with the right markets—driving growth, efficiency, and impact across every engagement.
          </p>
        </motion.div>

        {/* Capability badges */}
        <div className="flex flex-wrap justify-center gap-4">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.label}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-golden/10 bg-background hover:border-golden/30 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <c.icon className="w-4 h-4 text-golden" />
              <span className="font-noto text-sm text-foreground font-medium">{c.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
