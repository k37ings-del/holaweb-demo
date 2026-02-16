import Layout from "@/components/Layout";
import HeroSection from "@/components/services/HeroSection";
import IntroductionSection from "@/components/services/IntroductionSection";
import TransformationPartnerSection from "@/components/services/TransformationPartnerSection";
import ServicesTilesSection from "@/components/services/ServicesTilesSection";
import AboutSection from "@/components/services/AboutSection";
import BusinessTypesSection from "@/components/services/BusinessTypesSection";
import WhyChooseSection from "@/components/services/WhyChooseSection";
import HowWeWorkSection from "@/components/services/HowWeWorkSection";
import CTASection from "@/components/services/CTASection";

const Services = () => {
  return (
    <Layout>
      <HeroSection />
      <IntroductionSection />
      <AboutSection />
      <TransformationPartnerSection />
      <ServicesTilesSection />
      <WhyChooseSection />
      <HowWeWorkSection />
      <BusinessTypesSection />
      <CTASection />
    </Layout>
  );
};

export default Services;
