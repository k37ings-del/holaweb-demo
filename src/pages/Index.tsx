import Header from "@/components/Header";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-secondary/80" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in-up">
            Your Digital Inclusion
            <br />
            <span className="text-primary">Enablement Partner</span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 font-body mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Empowering Africa's entrepreneurs and institutions with simple,
            affordable, cloud-powered digital solutions.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 font-heading text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
            >
              Get Started
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground/30 px-8 py-4 font-heading text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
