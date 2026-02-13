import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const serviceTitles: Record<string, string> = {
  cloud: "Cloud Services",
  apps: "Apps Development",
  gtm: "Go-To-Market Support",
  integrations: "Integrations",
  reseller: "Tech Reseller",
  strategy: "Business Strategy",
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const title = serviceTitles[slug || ""] || "Service";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">{title}</h1>
          <div className="w-16 h-1 bg-golden mx-auto mb-6" />
          <p className="font-body font-light text-foreground/70 max-w-xl mx-auto">
            This page is under construction. Detailed information about {title.toLowerCase()} coming soon.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
