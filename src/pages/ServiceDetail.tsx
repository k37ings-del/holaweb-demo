import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Cloud, Code, TrendingUp, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";

const serviceData: Record<string, {
  icon: any;
  title: string;
  category: string;
  intro: string[];
  features: { name: string; summary: string }[];
}> = {
  "cloud-services": {
    icon: Cloud,
    title: "Cloud Services",
    category: "Infrastructure",
    intro: [
      "As an official AWS Partner, our firm provides industry-leading cloud solutions tailored to meet the diverse needs of businesses across all sectors — whether you're a startup, SME, or large enterprise. Leveraging the power, scalability, and security of Amazon Web Services, we help our clients modernize their infrastructure, reduce operational costs, and accelerate innovation. Our certified cloud engineers and solution architects design and implement optimized AWS environments that align with your business goals, ensuring agility, compliance, and performance every step of the way.",
      "Beyond implementation, we offer extended support services to guarantee the long-term success of your cloud journey. Our dedicated support team is available to assist with performance monitoring, cost optimization, security management, disaster recovery planning, and ongoing cloud governance. With our hands-on approach and deep AWS expertise, we empower clients of all sizes to confidently adopt and scale on the cloud while focusing on what matters most — their core business.",
    ],
    features: [
      { name: "AWS Cloud Migration & Architecture Design", summary: "We plan and execute seamless migrations to AWS, designing resilient architectures that minimize downtime, optimize performance, and set the foundation for scalable growth." },
      { name: "Cost Optimization & Resource Management", summary: "Our team continuously analyzes your AWS usage to right-size resources, leverage reserved capacity, and eliminate waste — reducing your cloud spend without sacrificing performance." },
      { name: "Security, Compliance & Data Protection", summary: "We implement industry-standard security frameworks, IAM policies, encryption, and compliance controls to protect your data and meet regulatory requirements." },
      { name: "24/7 Monitoring & Incident Response", summary: "Round-the-clock infrastructure monitoring with automated alerting and rapid incident response ensures maximum uptime and quick resolution of any issues." },
      { name: "Auto-scaling & Performance Tuning", summary: "Dynamic auto-scaling configurations and performance tuning ensure your applications handle traffic spikes efficiently while maintaining optimal response times." },
      { name: "Disaster Recovery & Business Continuity", summary: "We design and test comprehensive disaster recovery plans with automated failover strategies to keep your business running even during unexpected outages." },
    ],
  },
  "web-app-development": {
    icon: Code,
    title: "Web & App Development",
    category: "Development",
    intro: [
      "Our software development services are designed to help businesses of all sizes build powerful, user-centric digital products that drive growth and efficiency. Whether you're looking to develop a responsive website, a complex web platform, or a high-performance mobile application, our team of experienced developers, UI/UX designers, and product managers work collaboratively to deliver tailored solutions. We specialize in full-stack development, ensuring seamless integration, robust functionality, and scalable architecture across all platforms and devices.",
      "From concept to deployment, we follow industry best practices and agile methodologies to ensure quality, speed, and adaptability throughout the development lifecycle. Our ongoing support and maintenance services ensure your web or mobile applications remain secure, up-to-date, and optimized for performance. With a focus on innovation and user experience, we empower clients to launch impactful digital products that not only meet current needs but are also built to scale with their future ambitions.",
    ],
    features: [
      { name: "Responsive Website Design & Development", summary: "We craft pixel-perfect, mobile-first websites that look stunning on every device — built with modern frameworks for speed, SEO, and accessibility." },
      { name: "Custom Web Application Platforms", summary: "From dashboards to SaaS products, we build complex web platforms with robust backends, real-time features, and intuitive user interfaces tailored to your workflow." },
      { name: "Mobile App Development (iOS & Android)", summary: "Native and cross-platform mobile applications designed for performance, reliability, and delightful user experiences on both iOS and Android." },
      { name: "UI/UX Design & Prototyping", summary: "User research, wireframing, and interactive prototyping to validate ideas early and ensure every product we build is intuitive and engaging." },
      { name: "E-Commerce Solutions", summary: "End-to-end e-commerce platforms with secure payments, inventory management, and conversion-optimized storefronts to grow your online sales." },
      { name: "API Development & Third-Party Integrations", summary: "RESTful and GraphQL API development plus seamless integration with payment gateways, CRMs, ERPs, and other third-party services your business relies on." },
    ],
  },
  "market-access": {
    icon: TrendingUp,
    title: "Market Access",
    category: "Growth",
    intro: [
      "We partner with innovative tech startups to help bring their products to market by leveraging our extensive network of customers and distribution channels. Our model focuses on three core pillars — Product, Customer, and Distribution. We work exclusively with startups that already have a functional product and are ready to scale. Once that foundation is in place, we take the lead in customer acquisition and building strategic distribution pathways that align with the product's value proposition and market potential.",
      "As a tech and industry agnostic reseller, we pride ourselves on matching the right solutions with the right audiences — regardless of the sector or technology stack. Whether it's a SaaS platform, mobile app, or emerging tech solution, our goal is to accelerate adoption by plugging startups into real-world demand and market-ready opportunities. Through our collaborative approach, we help startups grow revenue, gain market feedback, and establish a strong presence without the burden of building their own distribution engine from scratch.",
    ],
    features: [
      { name: "Customer Acquisition & Retention Strategies", summary: "Data-driven acquisition campaigns and retention programs that identify, convert, and keep your ideal customers — maximizing lifetime value and reducing churn." },
      { name: "Distribution Network Development", summary: "We build and manage distribution channels tailored to your product, connecting you with resellers, partners, and direct-to-customer pathways across Africa." },
      { name: "Market Research & Competitive Analysis", summary: "In-depth market intelligence, competitor benchmarking, and trend analysis to inform your go-to-market strategy and identify untapped opportunities." },
      { name: "Revenue Growth & Monetization", summary: "Strategic pricing models, upsell frameworks, and monetization strategies designed to accelerate revenue growth and improve unit economics." },
      { name: "Go-to-Market Strategy & Execution", summary: "End-to-end GTM planning — from positioning and messaging to launch execution and post-launch optimization — ensuring your product reaches the right audience." },
      { name: "Partnership & Channel Development", summary: "We identify, negotiate, and manage strategic partnerships and channel relationships that extend your market reach and create sustainable growth engines." },
    ],
  },
  "meta-solutions": {
    icon: MessageSquare,
    title: "META Solutions",
    category: "Communication",
    intro: [
      "We offer META products and solutions, including advanced WhatsApp integrations, to help businesses enhance customer engagement and streamline internal processes. Through WhatsApp Business APIs, chatbots, and CRM integrations, we enable real-time communication, automated responses, and seamless customer support. These tools not only improve responsiveness but also help businesses build trust and stronger relationships with their clients — directly within a platform their customers already use daily.",
      "In addition, we integrate secure and efficient payment solutions to create a frictionless customer journey: from enquiry to transaction. Our solutions are ideal for businesses looking to drive conversions, offer quick support, and manage operations with improved efficiency. Whether it's retail, finance, healthcare, or services, we help clients transform their communication and payment workflows into automated, measurable, and scalable processes through the power of META platforms.",
    ],
    features: [
      { name: "WhatsApp Business API Setup & Management", summary: "Full setup and ongoing management of WhatsApp Business API — from number verification and template approval to message routing and compliance." },
      { name: "Chatbot Design & Automation", summary: "Intelligent chatbot flows that handle FAQs, qualify leads, book appointments, and escalate to agents — reducing response times and operational costs." },
      { name: "In-Chat Payment Integration", summary: "Secure payment processing directly within WhatsApp conversations, enabling customers to browse, order, and pay without leaving the chat." },
      { name: "CRM & Helpdesk Connection", summary: "Seamless integration with your existing CRM and helpdesk tools so every conversation is tracked, every lead is captured, and no customer falls through the cracks." },
      { name: "Broadcast & Campaign Management", summary: "Targeted broadcast messaging and campaign management tools to reach thousands of customers with personalized updates, promotions, and announcements." },
      { name: "Analytics & Conversation Insights", summary: "Comprehensive dashboards tracking message volumes, response times, conversion rates, and customer satisfaction to continuously optimize your communication strategy." },
    ],
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug || ""];
  const [openFeature, setOpenFeature] = useState<string | null>(null);

  if (!service) {
    return (
      <div className="min-h-screen bg-background relative">
        <FloatingBubbles />
        <div className="relative" style={{ zIndex: 2 }}>
          <Header />
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-muted-foreground font-body">Service not found.</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const IconComp = service.icon;

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />

      <div className="relative" style={{ zIndex: 2 }}>
        <Header />

        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-light text-sm font-body mb-8 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>

            {/* Title */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconComp className="w-9 h-9 text-primary" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-subheading uppercase tracking-wider mb-2">
                  {service.category}
                </span>
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                  {service.title}
                </h1>
              </div>
            </div>

            {/* Intro paragraphs */}
            <div className="max-w-3xl mb-8">
              {service.intro.map((p, i) => (
                <p key={i} className="font-body text-muted-foreground text-lg leading-relaxed mb-4">
                  {p}
                </p>
              ))}
            </div>

            {/* Image placeholder */}
            <div className="w-full max-w-3xl h-64 md:h-80 rounded-2xl border-2 border-primary/20 bg-muted/20 flex items-center justify-center mb-12">
              <div className="text-muted-foreground/50 text-sm font-body text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComp className="w-6 h-6 text-primary/50" />
                </div>
                Image Placeholder
              </div>
            </div>

            {/* Clickable features */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-12">
              {service.features.map((f) => (
                <div key={f.name} className="rounded-xl border border-primary/10 bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenFeature(openFeature === f.name ? null : f.name)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-primary/5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-body text-sm text-foreground flex-1">{f.name}</span>
                    <span className={`text-primary transition-transform duration-200 ${openFeature === f.name ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFeature === f.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground font-body leading-relaxed">
                          {f.summary}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-3 font-subheading text-sm font-semibold shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-6 py-3 font-subheading text-sm font-semibold text-primary-light hover:bg-primary/10 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                All Services
              </Link>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <Footer />
      </div>
    </div>
  );
};

export default ServiceDetail;
