import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronRight,
  CheckCircle,
  Cloud,
  Code,
  Rocket,
  MessageSquare,
  Layers,
  Handshake,
  ImageIcon,
  Mail,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingTriangles from "@/components/FloatingTriangles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useToast } from "@/hooks/use-toast";

const whyChooseUs = [
  {
    icon: Cloud,
    title: "AWS-Certified Cloud Expertise",
    description:
      "As an official AWS Partner, we deliver scalable, secure, and cost-efficient cloud solutions tailored to your business needs. From infrastructure deployment to disaster recovery and cost optimization, we ensure you get the most out of the cloud.",
  },
  {
    icon: Code,
    title: "Full-Service Software Development",
    description:
      "We design and build custom websites, web platforms, and mobile apps that are robust, user-friendly, and scalable. Whether you're launching a new product or modernizing an existing system, our team brings your digital vision to life.",
  },
  {
    icon: Rocket,
    title: "Go-to-Market Support for Startups",
    description:
      "We help tech startups with functional products scale quickly by plugging them into our extensive customer network and distribution channels—driving real revenue and adoption without the need to build a sales engine from scratch.",
  },
  {
    icon: MessageSquare,
    title: "META & Payment Integrations",
    description:
      "Enhance client engagement and automate internal processes with our META-certified tools like WhatsApp integrations and secure payment solutions. We help streamline communication and transactions within familiar platforms.",
  },
  {
    icon: Layers,
    title: "Industry and Tech Agnostic Approach",
    description:
      "We work with companies across various industries and technologies, ensuring flexible and future-proof solutions that meet your unique business goals—whether you're in fintech, retail, logistics, healthcare, or beyond.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support & Collaboration",
    description:
      "From concept to execution and ongoing optimization, we provide hands-on support, transparent communication, and a partnership mindset. Your success is our mission—and we're here for every step of the journey.",
  },
];

const leaders = [
  {
    name: "Siyabonga Tiwana",
    role: "Chief Executive Officer",
    bio: "Innovative and results-driven executive with over 10 years of experience leading a technology startup, specializing in customer success, account management, and business development.",
    initials: "ST",
  },
  {
    name: "Vuyisa Qabaka",
    role: "African Rainmaker",
    bio: "Vuyisa Qabaka is a Pan Africa focused startup and corporate innovation expert, angel investor and business mentor, with experience across 13 countries in Africa. Currently serving as a trustee at Groote Schuur Hospital Trust and the board of the National Mentorship Movement.",
    initials: "VQ",
  },
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

const About = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Thank you!",
      description: "We'll be in touch soon.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <FloatingTriangles />

      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        {/* ─── Hero Section ─── */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-secondary/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />

          <div className="relative z-10 container mx-auto px-6 text-center">
            <p className="font-subheading text-sm uppercase tracking-widest text-golden mb-4 animate-fade-in-up">
              About Us
            </p>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 animate-fade-in-up tracking-tight">
              Your Digital Inclusion
              <br />
              Enablement Partner
            </h1>
            <p
              className="max-w-2xl mx-auto text-base md:text-lg text-foreground/70 font-body font-light mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              Empowering Africa's entrepreneurs and institutions with simple,
              affordable, cloud-powered digital solutions that turn strategy into
              measurable outcomes.
            </p>
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                to="/contact"
                className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
              >
                Find Out More
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Who We Are ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
                  Who We Are
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-8" />
                <p className="font-body font-light text-foreground/75 leading-relaxed mb-6">
                  At our core, we are a technology solutions partner committed to
                  empowering businesses of all sizes through cloud innovation,
                  digital product development, and smart distribution strategies.
                  As an official AWS Partner, we deliver scalable, secure, and
                  high-performance cloud solutions tailored to meet the unique
                  needs of startups, SMEs, and large enterprises. Our extended
                  cloud support ensures long-term value by offering performance
                  monitoring, security management, disaster recovery, and cost
                  optimization—helping our clients confidently scale on AWS while
                  staying focused on their core business.
                </p>
                <p className="font-body font-light text-foreground/75 leading-relaxed">
                  Beyond building and deploying solutions, we support the
                  go-to-market efforts of tech startups by reselling innovative
                  products through our broad customer network and distribution
                  channels. We focus on startups that already have a working
                  product, and we take on the responsibility of unlocking customer
                  access and scalable distribution. Additionally, we offer META
                  solutions like WhatsApp integrations and embedded payment
                  systems to enhance client engagement and automate internal
                  business workflows. As a tech and industry-agnostic partner, our
                  mission is to connect great products with the right
                  markets—driving growth, efficiency, and impact across every
                  engagement.
                </p>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Vision & Mission ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="rounded-none bg-card/80 backdrop-blur-sm border border-border p-10 hover:border-golden/30 transition-colors duration-300">
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Our Vision
                  </h3>
                  <div className="w-12 h-1 bg-golden mb-6" />
                  <p className="font-body font-light text-foreground/75 leading-relaxed">
                    To be Africa's leading digital inclusion enablement partner,
                    ensuring every entrepreneur and institution—from township to
                    enterprise—can compete and grow through simple, affordable
                    technology.
                  </p>
                </div>
                <div className="rounded-none bg-card/80 backdrop-blur-sm border border-border p-10 hover:border-golden/30 transition-colors duration-300">
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Our Mission
                  </h3>
                  <div className="w-12 h-1 bg-golden mb-6" />
                  <p className="font-body font-light text-foreground/75 leading-relaxed">
                    To connect great products with the right markets—driving
                    growth, efficiency, and impact across every engagement. We
                    empower businesses through cloud innovation, digital product
                    development, and smart distribution strategies.
                  </p>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Image Placeholder ─── */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="max-w-5xl mx-auto aspect-[21/9] rounded-none bg-card/80 backdrop-blur-sm border border-golden/20 flex items-center justify-center shadow-2xl shadow-background/60">
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-golden/30 mx-auto mb-3" />
                  <p className="font-subheading text-sm text-muted-foreground">
                    Image Coming Soon
                  </p>
                </div>
              </div>
            </ScrollSection>
          </div>
        </section>

        {/* ─── Why Choose Us ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Why Choose Us
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-subheading text-lg text-golden">
                  What Sets Holaweb Apart
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {whyChooseUs.map((item) => {
                const Icon = item.icon;
                return (
                  <ScrollSection key={item.title}>
                    <div className="rounded-none bg-card/80 backdrop-blur-sm border border-border p-8 hover:border-golden/30 transition-colors duration-300 h-full">
                      <Icon className="h-8 w-8 text-golden/60 mb-4" />
                      <h3 className="font-subheading text-base font-semibold text-foreground mb-3">
                        {item.title}
                      </h3>
                      <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </ScrollSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Leadership ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Leadership
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-subheading text-lg text-golden">
                  The People Behind Holaweb
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {leaders.map((leader) => (
                <ScrollSection key={leader.name}>
                  <div className="rounded-none bg-card/80 backdrop-blur-sm border border-border overflow-hidden hover:border-golden/30 transition-colors duration-300">
                    {/* Photo placeholder */}
                    <div className="aspect-[4/3] bg-secondary/40 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-golden/20 flex items-center justify-center">
                        <span className="font-heading text-2xl font-bold text-golden">
                          {leader.initials}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                        {leader.name}
                      </h3>
                      <p className="font-subheading text-sm font-medium text-golden mb-4">
                        {leader.role}
                      </p>
                      <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                        {leader.bio}
                      </p>
                    </div>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Get In Touch CTA ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Get In Touch
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-body font-light text-foreground/70 mb-8">
                  Interested in working with us? Drop your email and we'll reach
                  out, or head straight to our contact form.
                </p>
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-card/80 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 h-12 font-subheading text-sm font-semibold shadow-lg whitespace-nowrap"
                  >
                    Get In Touch
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </form>
              </div>
            </ScrollSection>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default About;
