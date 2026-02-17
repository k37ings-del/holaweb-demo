import { motion } from "framer-motion";

const IntroductionSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-16 h-1 bg-primary mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Transforming Businesses Through Technology
            </h2>
            <p className="font-body font-light text-muted-foreground leading-relaxed mb-4">
              Holaweb is your full-stack technology solutions partner, specializing in cloud computing, custom web and application development, market access strategies, and META business platform integration.
            </p>
            <p className="font-body font-light text-muted-foreground leading-relaxed">
              We empower startups, SMEs, and enterprises to leverage cutting-edge technology for sustainable growth. Our team of seasoned professionals brings deep expertise in AWS cloud services, responsive UI/UX design, customer acquisition, and WhatsApp Business API — all tailored to the unique needs of the African market.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="w-72 h-72 md:w-96 md:h-96 border-2 border-primary/30 bg-muted/30 flex items-center justify-center overflow-hidden aspect-square">
              <div className="text-muted-foreground/50 text-sm font-body text-center px-8">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-2xl">🌍</span>
                </div>
                Image Placeholder
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
