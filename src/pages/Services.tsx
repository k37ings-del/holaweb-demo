import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingTriangles from "@/components/FloatingTriangles";
import HeroSection from "@/components/services/HeroSection";
import IntroductionSection from "@/components/services/IntroductionSection";
import AboutSection from "@/components/services/AboutSection";
import TransformationPartnerSection from "@/components/services/TransformationPartnerSection";
import ServicesTilesSection from "@/components/services/ServicesTilesSection";
import WhyChooseSection from "@/components/services/WhyChooseSection";
import HowWeWorkSection from "@/components/services/HowWeWorkSection";
import BusinessTypesSection from "@/components/services/BusinessTypesSection";
import CTASection from "@/components/services/CTASection";

const Services = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <FloatingTriangles />

      <div className="relative" style={{ zIndex: 2 }}>
        <Header />
        <HeroSection />
        {/* ─── Hero / Body Separator ─── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <IntroductionSection />
        <AboutSection />
        <TransformationPartnerSection />
        <ServicesTilesSection />
        <WhyChooseSection />
        <HowWeWorkSection />
        <BusinessTypesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Services;
