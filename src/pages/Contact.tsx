import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">Contact Us</h1>
          <div className="w-16 h-1 bg-golden mx-auto mb-6" />
          <p className="font-body font-light text-foreground/70 max-w-xl mx-auto">
            This page is under construction. Reach out to us at siya@holaweb.co.za or call +27 71 513 8219.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
