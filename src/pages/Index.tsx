import { Link } from "react-router-dom";
import {
  Cloud,
  Smartphone,
  Megaphone,
  Link2,
  ChevronRight,
  Monitor,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import aboutImage from "@/assets/about-image.jpg";
import awsPartnerBadge from "@/assets/aws-partner-badge.png";
import zohoAffiliateBadge from "@/assets/zoho-affiliate-badge.png";
import backgroundTech from "@/assets/background-technology.png";
import awsLogo from "@/assets/logos/aws.png";
import awsSelectTier from "@/assets/aws-select-tier.png";
import awsQualifiedSoftware from "@/assets/aws-qualified-software.png";
import awsRdsDelivery from "@/assets/aws-rds-delivery.png";
import awsCloudSolutions from "@/assets/aws-cloud-solutions.png";

const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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

        {/* ─── Hero Section ─── */}
        <section className="relative min-h-screen flex items-center overflow-visible pt-32 lg:pt-20">
          <img
            src={backgroundTech}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />

          <div className="relative z-10 container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] pb-12">
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
                    className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-8 py-4 font-subheading text-sm font-semibold transition-colors duration-300 hover:bg-primary/10"
                    style={{ color: "#25D366" }}
                  >
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Right — Image placeholder with badges overlapping corners */}
              <div className="relative flex justify-center lg:justify-end">
                {/* AWS Partner badge — overlapping top-right corner */}
                <div className="absolute -top-6 -right-6 lg:-right-4 z-20">
                  <div className="bg-white rounded-2xl p-3 shadow-xl w-32 h-32 flex items-center justify-center">
                    <img src={awsPartnerBadge} alt="AWS Partner" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>

                {/* Image placeholder with Intense Cherry shadow */}
                <div className="relative w-full max-w-md lg:max-w-lg">
                  <div className="aspect-[4/5] bg-secondary/40 flex items-center justify-center overflow-hidden shadow-[8px_8px_0px_0px_hsl(352,66%,47%)]">
                    <div className="text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                      <p className="font-subheading text-sm">Image Placeholder</p>
                    </div>
                  </div>
                </div>

                {/* Zoho Affiliate badge — overlapping bottom-left corner */}
                <div className="absolute -bottom-6 -left-6 lg:-left-4 z-20">
                  <div className="bg-white rounded-2xl p-2 shadow-xl w-36 h-36 flex items-center justify-center">
                    <img src={zohoAffiliateBadge} alt="Zoho Affiliate" className="max-w-full max-h-full object-contain rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Separator ─── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* ─── Section 1: Digitalise & Automate (SME Impact) ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Single image placeholder */}
                <div className="relative">
                  <div className="aspect-[4/3] bg-secondary/40 border border-border flex items-center justify-center shadow-[8px_8px_0px_0px_hsl(352,66%,47%)]">
                    <div className="text-center text-muted-foreground">
                      <Monitor className="h-16 w-16 mx-auto mb-3 text-primary/30" />
                      <p className="font-subheading text-sm">Image Placeholder</p>
                    </div>
                  </div>
                </div>

                {/* Right — Content */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Do you want to digitalise and scale your{" "}
                    <span className="text-primary">SME development</span> programmes?
                  </h2>
                  <p className="font-subheading text-lg text-primary mb-4">
                    Try our SME Impact Platform:
                  </p>
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-8">
                    Holaweb's SME Impact platform empowers enterprises and development
                    agencies to manage, track, and scale their supplier development and
                    SME enablement programmes through a single, cloud-based digital
                    solution. Automate workflows, track beneficiary progress, and drive
                    measurable impact.
                  </p>
                  <a
                    href="https://smeimpact.co.za/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
                  >
                    LEARN MORE
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Section 2: Capacitate SMEs with Cloud ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Content */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Do you want to capacitate your SMEs with{" "}
                    <span className="text-primary">cloud technologies</span> and skills?
                  </h2>
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-8">
                    Holaweb provides cloud readiness assessments, migration support,
                    and managed cloud services specifically designed for SMMEs.
                    As an AWS Partner, we help small businesses adopt enterprise-grade
                    cloud infrastructure at affordable price points, complete with
                    skills transfer and ongoing support.
                  </p>
                  <a
                    href="https://wa.me/27715138219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-8 py-4 font-subheading text-sm font-semibold transition-colors duration-300 hover:bg-primary/10"
                    style={{ color: "#25D366" }}
                  >
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </div>

                {/* Right — Image placeholder */}
                <div className="relative flex justify-center">
                  <div className="aspect-[4/3] w-full bg-secondary/40 border border-border flex items-center justify-center shadow-[8px_8px_0px_0px_hsl(352,66%,47%)]">
                    <div className="text-center text-muted-foreground">
                      <Cloud className="h-16 w-16 mx-auto mb-3 text-primary/30" />
                      <p className="font-subheading text-sm">Image Placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Section 3: SME Impact Platform Showcase ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Platform image placeholder with label */}
                <div className="relative">
                  <p className="font-subheading text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Our Platform</p>
                  <div className="aspect-[4/3] bg-secondary/40 border border-border overflow-hidden shadow-[8px_8px_0px_0px_hsl(352,66%,47%)]">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Monitor className="h-16 w-16 mx-auto mb-3 text-primary/30" />
                        <p className="font-subheading text-sm">Platform Screenshot</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — Content */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Our <span className="text-primary">SME Impact</span> Platform
                  </h2>
                  <div className="w-16 h-1 bg-primary mb-6" />
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                    SME Impact is an integrated, cloud-based digital platform that
                    empowers enterprise and supplier development stakeholders to
                    collaborate effectively in SMME development, supplier diversity,
                    and localisation of opportunities. It supports the drive towards
                    Sustainable Development Goal No 8: Decent Work and Economic Growth
                    in the SMME Sector.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/services"
                      className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
                    >
                      LEARN MORE
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLScjWbZKNcccQRYIBX6oQo-n6vVlJ8UduH3iknn5YQj8xcnDzA/viewform?usp=sharing&ouid=106739550657489478981"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-primary px-8 py-4 font-subheading text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
                    >
                      Get Started Now
                    </a>
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Section 4: Our Cloud Services ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Content */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Our <span className="text-primary">Cloud</span> Services
                  </h2>
                  <div className="w-16 h-1 bg-primary mb-6" />
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                    To advance cloud computing adoption for SMMEs, we provide AWS Cloud
                    Adoption Services as part of our development packages. Enterprises
                    can support their beneficiaries to automate and digitalise their
                    businesses through our cloud services — from cloud architecture
                    and migration to managed hosting and disaster recovery.
                  </p>
                  <Link
                    to="/services/cloud-services"
                    className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
                  >
                    LEARN MORE
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                {/* Right — AWS Logo */}
                <div className="relative flex justify-center">
                  <div className="w-72 h-72 md:w-96 md:h-80 bg-secondary/40 border border-border flex items-center justify-center shadow-[8px_8px_0px_0px_hsl(352,66%,47%)]">
                    <img src={awsLogo} alt="AWS" className="max-w-[60%] max-h-[60%] object-contain" />
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Section 5: Who is Holaweb ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left — Image */}
                <div className="relative">
                  <div className="aspect-[4/3] bg-secondary/50 border border-border overflow-hidden shadow-[8px_8px_0px_0px_hsl(352,66%,47%)]">
                    <img
                      src={aboutImage}
                      alt="Holaweb team"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right — Content */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Who is <span className="text-primary">Holaweb</span>
                  </h2>
                  <div className="w-16 h-1 bg-primary mb-6" />
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                    Holaweb Media Group is a South African digital solutions company focused on inclusive, cloud‑powered products that turn strategy into measurable outcomes. Founded with a bold vision, we set out to ensure every entrepreneur and institution—from township to enterprise—can compete and grow through simple, affordable technology.
                  </p>
                  <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                    Our multidisciplinary team blends product strategy, software engineering, design, data, and change management, ensuring not only build quality but also adoption, skills transfer, and sustainability. We are known for pragmatic delivery, transparent governance, and deep contextual understanding of African operating realities.
                  </p>
                  <p className="font-body font-light text-foreground/75 leading-relaxed">
                    We help SMEs, enterprises, and public‑sector entities modernize citizen and customer experiences through high‑performance websites, e‑commerce, WhatsApp and payment integrations, CRM and data tools, and managed cloud services.
                  </p>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── What We Offer ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  What We <span className="text-primary">Offer</span>
                </h2>
                <div className="w-16 h-1 bg-primary mx-auto mb-4" />
                <p className="font-subheading text-lg text-primary">
                  Comprehensive Digital Solutions
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
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
              ].map((service) => {
                const Icon = service.icon;
                return (
                  <ScrollSection key={service.href}>
                    <Link
                      to={service.href}
                      className="service-card group block bg-card/80 backdrop-blur-sm border border-border p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <Icon className="service-icon h-10 w-10 text-primary/60 mb-5 transition-colors duration-300 group-hover:text-accent" />
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

        {/* ─── AWS Credentials & Expertise ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 border-2 border-primary/30 rounded-xl flex items-center justify-center mb-4 p-3">
                    <img src={awsSelectTier} alt="AWS Select Tier Services Partner" className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="font-body font-light text-foreground/75 text-sm leading-relaxed">
                    Holaweb is an <strong className="text-foreground">AWS Select Tier Services Partner.</strong>
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 border-2 border-primary/30 rounded-xl flex items-center justify-center mb-4 p-3">
                    <img src={awsQualifiedSoftware} alt="AWS Qualified Software" className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="font-body font-light text-foreground/75 text-sm leading-relaxed">
                    Our SME Impact platform is built according to the <strong className="text-foreground">AWS Well-Architected Framework</strong>, an FTR approved SaaS.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 border-2 border-primary/30 rounded-xl flex items-center justify-center mb-4 p-3">
                    <img src={awsRdsDelivery} alt="AWS RDS Delivery Partner" className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="font-body font-light text-foreground/75 text-sm leading-relaxed">
                    Holaweb is an <strong className="text-foreground">AWS RDS Delivery Partner.</strong>
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 border-2 border-primary/30 rounded-xl flex items-center justify-center mb-4 p-3">
                    <img src={awsCloudSolutions} alt="AWS Cloud Solutions" className="max-w-full max-h-full object-contain" />
                  </div>
                  <p className="font-body font-light text-foreground/75 text-sm leading-relaxed">
                    <strong className="text-foreground">Solutions Architects, DevOps, and Agile expertise.</strong>
                  </p>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
