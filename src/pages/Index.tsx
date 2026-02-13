import { Link } from "react-router-dom";
import {
  Cloud,
  Smartphone,
  Megaphone,
  Link2,
  ShoppingCart,
  BarChart3,
  Play,
  ExternalLink,
  Quote,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const serviceCards = [
  {
    title: "Cloud Services",
    icon: Cloud,
    href: "/services/cloud",
    description: "Cloud architecture, hosting, cost optimization & disaster recovery.",
  },
  {
    title: "Apps Development",
    icon: Smartphone,
    href: "/services/apps",
    description: "Web and mobile apps, microservices, APIs & QA automation.",
  },
  {
    title: "Go-To-Market Support",
    icon: Megaphone,
    href: "/services/gtm",
    description: "Adoption strategies, onboarding playbooks & enablement programs.",
  },
  {
    title: "Integrations",
    icon: Link2,
    href: "/services/integrations",
    description: "WhatsApp Business bots, payment gateways & customer workflows.",
  },
  {
    title: "Tech Reseller",
    icon: ShoppingCart,
    href: "/services/reseller",
    description: "Advisory on best-fit SaaS, licensing & partner coordination.",
  },
  {
    title: "Business Strategy",
    icon: BarChart3,
    href: "/services/strategy",
    description: "CRM, data enablement, analytics dashboards & growth planning.",
  },
];

const testimonials = [
  {
    name: "Client Name",
    role: "CEO, Company",
    text: "Holaweb transformed our digital presence and helped us reach customers we never thought possible. Their cloud solutions are truly enterprise-grade yet affordable.",
  },
  {
    name: "Client Name",
    role: "Director, Organization",
    text: "The team's deep understanding of African operating realities sets them apart. They delivered on time, on budget, and with exceptional quality.",
  },
  {
    name: "Client Name",
    role: "Manager, Enterprise",
    text: "From strategy to execution, Holaweb has been an invaluable partner in our digital transformation journey. Highly recommended.",
  },
];

const brandLogos = [
  "Partner 1",
  "Partner 2",
  "Partner 3",
  "Partner 4",
  "Partner 5",
  "Partner 6",
  "Partner 7",
  "Partner 8",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-bg.mp4"
        />
        <div className="absolute inset-0 bg-background/80" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 animate-fade-in-up tracking-tight">
            Holaweb Media Group
          </h1>
          <p
            className="font-subheading text-lg md:text-2xl text-golden font-medium mb-4 animate-fade-in-up tracking-wide uppercase"
            style={{ animationDelay: "0.15s" }}
          >
            Your Digital Inclusion Enablement Partner
          </p>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg text-foreground/70 font-body font-light mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Empowering Africa's entrepreneurs and institutions with simple,
            affordable, cloud-powered digital solutions.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.45s" }}
          >
            <Link
              to="/contact"
              className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-lg border border-golden/40 px-8 py-4 font-subheading text-sm font-semibold text-golden hover:bg-golden/10 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About / Intro Section ─── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text on the left */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Who We Are
              </h2>
              <div className="w-16 h-1 bg-golden mb-6" />
              <p className="font-subheading text-lg text-golden mb-4">
                Bridging Africa's Digital Divide
              </p>
              <p className="font-body font-light text-foreground/75 leading-relaxed mb-4">
                Holaweb Media Group is a South African digital solutions company
                focused on inclusive, cloud‑powered products that turn strategy into
                measurable outcomes. Founded with a bold vision in 2024, we set out
                to ensure every entrepreneur and institution—from township to
                enterprise—can compete and grow through simple, affordable technology.
              </p>
              <p className="font-body font-light text-foreground/75 leading-relaxed mb-4">
                Our multidisciplinary team blends product strategy, software
                engineering, design, data, and change management, ensuring not only
                build quality but also adoption, skills transfer, and sustainability.
                We are known for pragmatic delivery, transparent governance, and deep
                contextual understanding of African operating realities.
              </p>
              <p className="font-body font-light text-foreground/75 leading-relaxed">
                We help SMEs, enterprises, and public‑sector entities modernize
                citizen and customer experiences through high‑performance websites,
                e‑commerce, WhatsApp and payment integrations, CRM and data tools,
                and managed cloud services.
              </p>
            </div>

            {/* Image placeholder on the right */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-secondary/50 border border-golden/20 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-golden/20 flex items-center justify-center">
                    <Cloud className="h-8 w-8 text-golden" />
                  </div>
                  <p className="font-subheading text-sm text-muted-foreground">Stock Image Placeholder</p>
                </div>
              </div>
              {/* Decorative border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-xl border border-golden/30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Video Section ─── */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Description card on the left */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                See Holaweb in Action
              </h2>
              <div className="w-16 h-1 bg-golden mb-6" />
              <p className="font-subheading text-lg text-golden mb-4">
                Our Story, Our Impact
              </p>
              <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                Discover how Holaweb Media Group is empowering Africa's digital
                future. From cloud-powered solutions to hands-on skills transfer,
                see how we partner with businesses and institutions to drive real
                adoption, measurable growth, and long-term sustainability.
              </p>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-golden hover:text-golden/80 font-subheading text-sm font-medium transition-colors"
              >
                Watch on YouTube
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Video placeholder on the right */}
            <div className="relative">
              <div className="aspect-video rounded-xl bg-background border border-golden/20 flex items-center justify-center overflow-hidden group cursor-pointer">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Play className="h-8 w-8 text-primary ml-1" />
                  </div>
                  <p className="font-subheading text-sm text-muted-foreground">Video Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What We Offer ─── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              What We Offer
            </h2>
            <div className="w-16 h-1 bg-golden mx-auto mb-4" />
            <p className="font-subheading text-lg text-golden">
              Comprehensive Digital Solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCards.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  to={service.href}
                  className="service-card group rounded-xl bg-card border border-border p-8 hover:border-golden/50 hover:shadow-lg hover:shadow-golden/5"
                >
                  <Icon className="service-icon h-10 w-10 text-golden/60 mb-5 transition-colors duration-300 group-hover:text-accent" />
                  <h3 className="font-subheading text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-golden text-sm font-subheading font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              What Our Clients Say
            </h2>
            <div className="w-16 h-1 bg-golden mx-auto mb-4" />
            <p className="font-subheading text-lg text-golden">
              Trusted by Businesses Across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-border p-8 hover:border-golden/30 transition-colors duration-300"
              >
                <Quote className="h-8 w-8 text-golden/40 mb-4" />
                <p className="font-body font-light text-foreground/75 leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-golden/20 flex items-center justify-center">
                    <span className="font-heading text-sm font-bold text-golden">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-subheading text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Brand Logos Carousel ─── */}
      <section className="py-16 border-t border-border border-b">
        <div className="container mx-auto px-6 mb-8 text-center">
          <p className="font-subheading text-sm uppercase tracking-widest text-muted-foreground">
            Brands We've Worked With
          </p>
        </div>
        <div className="overflow-hidden">
          <div className="animate-scroll-logos flex gap-16 items-center whitespace-nowrap w-max">
            {[...brandLogos, ...brandLogos].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-16 rounded-lg bg-card border border-border flex items-center justify-center"
              >
                <span className="font-subheading text-xs text-muted-foreground">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
