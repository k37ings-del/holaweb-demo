import { Link } from "react-router-dom";
import {
  Cloud,
  Smartphone,
  Megaphone,
  Link2,
  ChevronRight,
  ExternalLink,
  Quote,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import aboutImage from "@/assets/about-image.jpg";
import awsLogo from "@/assets/logos/aws.png";
import absaLogo from "@/assets/logos/absa.png";
import oldMutualLogo from "@/assets/logos/old-mutual.png";
import ghalaLogo from "@/assets/logos/ghala.png";

const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const serviceCards = [
  {
    title: "Cloud Services",
    icon: Cloud,
    href: "/services/cloud-services",
    description: "Cloud architecture, hosting, cost optimization & disaster recovery.",
  },
  {
    title: "Web & App Development",
    icon: Smartphone,
    href: "/services/web-app-development",
    description: "Web and mobile apps, microservices, APIs & QA automation.",
  },
  {
    title: "Market Access",
    icon: Megaphone,
    href: "/services/market-access",
    description: "Adoption strategies, onboarding playbooks & enablement programs.",
  },
  {
    title: "META Solutions",
    icon: Link2,
    href: "/services/meta-solutions",
    description: "WhatsApp Business bots, payment gateways & customer workflows.",
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
  { name: "Absa Bank", logo: absaLogo },
  { name: "Old Mutual", logo: oldMutualLogo },
  { name: "Ghala", logo: ghalaLogo },
  { name: "AWS", logo: awsLogo },
];

const ScrollSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />

      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        {/* ─── Hero Section (Linkage-style split layout) ─── */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-32 lg:pt-20">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/videos/hero-bg.mp4"
          />
          <div className="absolute inset-0 bg-background/80" />

          <div className="relative z-10 container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left — Text Content */}
              <div>
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-2 animate-fade-in-up leading-tight">
                  Connecting{" "}
                  <span className="text-primary">opportunity</span>
                </h1>
                <p
                  className="font-subheading text-lg md:text-xl text-primary font-medium mb-4 animate-fade-in-up tracking-wide uppercase"
                  style={{ animationDelay: "0.15s" }}
                >
                  Your Digital Inclusion Enablement Partner
                </p>
                <p
                  className="max-w-lg text-base md:text-lg text-foreground/70 font-body font-light mb-10 animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  Empowering Africa's entrepreneurs and institutions with simple,
                  affordable, cloud-powered digital solutions.
                </p>
                <div
                  className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                  style={{ animationDelay: "0.45s" }}
                >
                  <Link
                    to="/contact"
                    className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                  <a
                    href="https://wa.me/27715138219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-primary px-8 py-4 font-subheading text-sm font-semibold transition-colors duration-300 hover:bg-primary/10"
                    style={{ color: "#25D366" }}
                  >
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Right — Image with badges */}
              <div className="relative flex justify-center lg:justify-end">
                {/* AWS Partner badge — top right of image */}
                <div className="absolute -top-2 -right-2 lg:right-4 z-20">
                  <div className="bg-white rounded-xl p-3 shadow-xl w-28 h-28 flex items-center justify-center">
                    <img src={awsLogo} alt="AWS Partner" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>

                {/* Placeholder image area with golden border accent like linkage */}
                <div className="relative w-full max-w-md lg:max-w-lg">
                  <div className="aspect-[4/5] rounded-none border-4 border-primary/30 bg-secondary/40 flex items-center justify-center overflow-hidden">
                    <div className="text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                      <p className="font-subheading text-sm">Image Placeholder</p>
                    </div>
                  </div>
                </div>

                {/* Zoho Affiliate badge — below AWS, alternating side (left) */}
                <div className="absolute bottom-8 -left-4 lg:left-0 z-20">
                  <div className="bg-white rounded-xl p-3 shadow-xl w-28 h-28 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <svg className="w-10 h-10 mx-auto mb-1" viewBox="0 0 64 64" fill="none">
                        <rect width="64" height="64" rx="12" fill="#F0F0F0" />
                        <text x="50%" y="36" textAnchor="middle" fill="#E42527" fontSize="14" fontWeight="bold" fontFamily="sans-serif">ZOHO</text>
                      </svg>
                      <p className="text-[10px] font-bold text-gray-700 leading-tight">Zoho</p>
                      <p className="text-[9px] text-green-600 font-semibold leading-tight">Affiliate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Hero / Body Separator ─── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-golden/40 to-transparent" />

        {/* ─── About / Intro Section ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="aspect-[4/3] rounded-none bg-secondary/50 border border-golden/20 overflow-hidden shadow-2xl shadow-background/60">
                    <img
                      src={aboutImage}
                      alt="Programming and coding workstation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-full h-full rounded-none border border-golden/30 -z-10" />
                </div>

                <div className="order-1 lg:order-2">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Who We Are
                  </h2>
                  <div className="w-16 h-1 bg-golden mb-6" />
                  <p className="font-subheading text-lg text-primary mb-4">
                    Bridging Africa's Digital Divide
                  </p>
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-4">
                    Holaweb Media Group is a South African digital solutions company
                    focused on inclusive, cloud‑powered products that turn strategy into
                    measurable outcomes. Founded with a bold vision, we set out to ensure
                    every entrepreneur and institution—from township to enterprise—can
                    compete and grow through simple, affordable technology.
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
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Video Section ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Scaling Ventures Across Africa
                  </h2>
                  <div className="w-16 h-1 bg-primary mb-6" />
                  <p className="font-subheading text-lg text-primary mb-4">
                    Investment, Innovation & Ecosystem Building
                  </p>
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                    Watch our co-founder Vuyisa Qabaka share insights from scaling
                    startups across 13 African countries at the SA Innovation Summit.
                    From navigating local procurement and global funding to the power
                    of storytelling for entrepreneurs seeking investment—discover
                    real-world strategies for thriving in Africa's emerging markets.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=wrQK_BdQxQY&pp=ygUNdnV5aXNhIHFhYmFrYdIHCQmHCgGHKiGM7w%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent font-subheading text-sm font-medium transition-colors"
                  >
                    Watch on YouTube
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="relative">
                  <div className="aspect-video rounded-none border border-primary/20 overflow-hidden shadow-2xl shadow-background/60">
                    <video
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                      src="/videos/vuyisa-qabaka.mp4"
                    />
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── What We Offer ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  What We Offer
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-subheading text-lg text-primary">
                  Comprehensive Digital Solutions
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {serviceCards.map((service) => {
                const Icon = service.icon;
                return (
                  <ScrollSection key={service.href}>
                    <Link
                      to={service.href}
                      className="service-card group block rounded-none bg-card/80 backdrop-blur-sm border border-border p-8 hover:border-golden/50 hover:shadow-xl hover:shadow-golden/5 transition-all duration-300"
                    >
                      <Icon className="service-icon h-10 w-10 text-golden/60 mb-5 transition-colors duration-300 group-hover:text-accent" />
                      <h3 className="font-subheading text-lg font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-primary text-sm font-subheading font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn more <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </ScrollSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Testimonials (hidden for now) ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm hidden">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  What Our Clients Say
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-subheading text-lg text-primary">
                  Trusted by Businesses Across Africa
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <ScrollSection key={i}>
                  <div className="rounded-none bg-card/80 backdrop-blur-sm border border-border p-8 hover:border-golden/30 transition-colors duration-300 shadow-lg shadow-background/40">
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
                        <p className="font-subheading text-sm font-semibold text-foreground">
                          {t.name}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Brand Logos Carousel (hidden for now) ─── */}
        <section className="py-16 border-t border-border border-b hidden">
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
                  className="flex-shrink-0 w-32 h-16 rounded-none bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center p-2"
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-12 max-w-28 object-contain"
                    />
                  ) : (
                    <span className="font-subheading text-xs text-muted-foreground">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
