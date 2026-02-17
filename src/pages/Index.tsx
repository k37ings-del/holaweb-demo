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
  ChevronRight } from
"lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingTriangles from "@/components/FloatingTriangles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import aboutImage from "@/assets/about-image.jpg";
import absaLogo from "@/assets/logos/absa.png";
import oldMutualLogo from "@/assets/logos/old-mutual.png";
import ghalaLogo from "@/assets/logos/ghala.png";
import awsLogo from "@/assets/logos/aws.png";
import YouTubePlayer from "@/components/YouTubePlayer";

const serviceCards = [
{
  title: "Cloud Services",
  icon: Cloud,
  href: "/services/cloud-services",
  description: "Cloud architecture, hosting, cost optimization & disaster recovery."
},
{
  title: "Web & App Development",
  icon: Smartphone,
  href: "/services/web-app-development",
  description: "Web and mobile apps, microservices, APIs & QA automation."
},
{
  title: "Market Access",
  icon: Megaphone,
  href: "/services/market-access",
  description: "Adoption strategies, onboarding playbooks & enablement programs."
},
{
  title: "META Solutions",
  icon: Link2,
  href: "/services/meta-solutions",
  description: "WhatsApp Business bots, payment gateways & customer workflows."
}];


const testimonials = [
{
  name: "Client Name",
  role: "CEO, Company",
  text: "Holaweb transformed our digital presence and helped us reach customers we never thought possible. Their cloud solutions are truly enterprise-grade yet affordable."
},
{
  name: "Client Name",
  role: "Director, Organization",
  text: "The team's deep understanding of African operating realities sets them apart. They delivered on time, on budget, and with exceptional quality."
},
{
  name: "Client Name",
  role: "Manager, Enterprise",
  text: "From strategy to execution, Holaweb has been an invaluable partner in our digital transformation journey. Highly recommended."
}];


const brandLogos = [
  { name: "Absa Bank", logo: absaLogo },
  { name: "Old Mutual", logo: oldMutualLogo },
  { name: "Ghala", logo: ghalaLogo },
  { name: "AWS", logo: awsLogo },
];


const ScrollSection = ({ children, className = "" }: {children: React.ReactNode;className?: string;}) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>);

};

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <FloatingTriangles />

      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        {/* ─── Hero Section ─── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/videos/hero-bg.mp4" />

          <div className="absolute inset-0 bg-background/80" />

          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 animate-fade-in-up tracking-tight">
              Holaweb Media Group
            </h1>
            <p
              className="font-subheading text-lg md:text-2xl text-golden font-medium mb-4 animate-fade-in-up tracking-wide uppercase"
              style={{ animationDelay: "0.15s" }}>

              Your Digital Inclusion Enablement Partner
            </p>
            <p
              className="max-w-2xl mx-auto text-base md:text-lg text-foreground/70 font-body font-light mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}>

              Empowering Africa's entrepreneurs and institutions with simple,
              affordable, cloud-powered digital solutions.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: "0.45s" }}>

              <Link
                to="/contact"
                className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg">

                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-lg border border-golden/40 px-8 py-4 font-subheading text-sm font-semibold text-golden hover:bg-golden/10 transition-colors duration-300">

                Learn More
              </Link>
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
                {/* Image on the left */}
                <div className="relative order-2 lg:order-1">
                  <div className="aspect-[4/3] rounded-none bg-secondary/50 border border-golden/20 overflow-hidden shadow-2xl shadow-background/60">
                    <img
                      src={aboutImage}
                      alt="Programming and coding workstation"
                      className="w-full h-full object-cover" />

                  </div>
                  <div className="absolute -bottom-4 -left-4 w-full h-full rounded-none border border-golden/30 -z-10" />
                </div>

                {/* Text on the right */}
                <div className="order-1 lg:order-2">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Who We Are
                  </h2>
                  <div className="w-16 h-1 bg-golden mb-6" />
                  <p className="font-subheading text-lg text-golden mb-4">
                    Bridging Africa's Digital Divide
                  </p>
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-4">Holaweb Media Group is a South African digital solutions company focused on inclusive, cloud‑powered products that turn strategy into measurable outcomes. Founded with a bold vision, we set out to ensure every entrepreneur and institution—from township to enterprise—can compete and grow through simple, affordable technology.





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
                  <div className="w-16 h-1 bg-golden mb-6" />
                  <p className="font-subheading text-lg text-golden mb-4">
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
                    href="https://www.youtube.com/watch?v=ikVCVdDhMsU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-golden hover:text-golden/80 font-subheading text-sm font-medium transition-colors">

                    Watch on YouTube
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="relative">
                <div className="aspect-video rounded-none border border-golden/20 overflow-hidden shadow-2xl shadow-background/60">
                    <YouTubePlayer videoId="ikVCVdDhMsU" title="Holaweb Media Group" />
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
                <p className="font-subheading text-lg text-golden">
                  Comprehensive Digital Solutions
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCards.map((service, i) => {
                const Icon = service.icon;
                return (
                  <ScrollSection key={service.href}>
                    <Link
                      to={service.href}
                      className="service-card group block rounded-none bg-card/80 backdrop-blur-sm border border-border p-8 hover:border-golden/50 hover:shadow-xl hover:shadow-golden/5 transition-all duration-300">

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
                  </ScrollSection>);

              })}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  What Our Clients Say
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-subheading text-lg text-golden">
                  Trusted by Businesses Across Africa
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) =>
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
                        <p className="font-subheading text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollSection>
              )}
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
              {[...brandLogos, ...brandLogos].map((brand, i) =>
              <div
                key={i}
                className="flex-shrink-0 w-32 h-16 rounded-none bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center p-2">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="max-h-12 max-w-28 object-contain" />
                  ) : (
                    <span className="font-subheading text-xs text-muted-foreground">{brand.name}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>);

};

export default Index;