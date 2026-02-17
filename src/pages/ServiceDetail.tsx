import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingTriangles from "@/components/FloatingTriangles";

const serviceData: Record<string, { title: string; description: string }> = {
  "cloud-services": {
    title: "Cloud Services",
    description: "Enterprise-grade AWS cloud solutions for migration, optimization, and scalable infrastructure.",
  },
  "web-app-development": {
    title: "Web & App Development",
    description: "Custom-built responsive websites, web platforms, and mobile applications with stunning UI/UX.",
  },
  "market-access": {
    title: "Market Access",
    description: "Strategic distribution, customer acquisition, and market penetration to grow your revenue.",
  },
  "meta-solutions": {
    title: "META Solutions",
    description: "WhatsApp Business API integration for automated messaging, payments, and CRM workflows.",
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug || ""];
  const title = service?.title || "Service";
  const description = service?.description || "Detailed information coming soon.";

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <FloatingTriangles />

      <div className="relative" style={{ zIndex: 2 }}>
        <Header />
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">{title}</h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <p className="font-body font-light text-foreground/70 max-w-xl mx-auto mb-10">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-6 py-3 font-subheading text-sm font-semibold text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                All Services
              </Link>
              <Link
                to="/contact"
                className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 py-3 font-subheading text-sm font-semibold shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
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
