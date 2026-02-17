import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronRight,
  Send,
  Clock,
  MessageSquare,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBubbles from "@/components/FloatingBubbles";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().max(200, "Subject must be less than 200 characters").optional(),
  phone: z.string().trim().max(30, "Phone number is too long").optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const expectations = [
  {
    icon: Clock,
    title: "Prompt Response",
    description: "We aim to acknowledge all inquiries within 48 hours.",
  },
  {
    icon: MessageSquare,
    title: "Genuine Engagement",
    description:
      "Substantive discussions with people we can actually help.",
  },
  {
    icon: Shield,
    title: "Confidentiality",
    description:
      "All partnership and business discussions handled with discretion.",
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

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Save to database
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({
          name: result.data.name,
          email: result.data.email,
          subject: result.data.subject || null,
          phone: result.data.phone || null,
          message: result.data.message,
        });

      if (dbError) {
        console.error("DB insert error:", dbError);
      }

      // 2. Send email via Resend edge function
      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: result.data.name,
          email: result.data.email,
          subject: result.data.subject || "No subject",
          phone: result.data.phone || "Not provided",
          message: result.data.message,
        },
      });

      if (emailError) {
        console.error("Email send error:", emailError);
      }

      // 3. Open WhatsApp with the message
      const whatsappMessage = encodeURIComponent(
        `Hi Holaweb! My name is ${result.data.name}. ${result.data.subject ? `Subject: ${result.data.subject}. ` : ""}${result.data.message}`
      );
      window.open(`https://wa.me/27715138219?text=${whatsappMessage}`, "_blank");

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you within 48 hours.",
      });

      setForm({ name: "", email: "", subject: "", phone: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full h-12 px-4 rounded-lg border border-border bg-card/80 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden/50 transition-colors";

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />

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
            src="/videos/contact-hero.mp4"
          />
          <div className="absolute inset-0 bg-secondary/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />

          <div className="relative z-10 container mx-auto px-6 text-left max-w-4xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up tracking-tight">
              Let's Start a Conversation
            </h1>
            <p
              className="max-w-2xl text-base md:text-lg text-foreground/70 font-body font-light animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              Whether you're a startup looking to scale, an enterprise exploring
              cloud solutions, or an organization interested in partnership—we'd
              welcome the chance to connect.
            </p>
          </div>
        </section>

        {/* ─── Hero / Body Separator ─── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-golden/40 to-transparent" />

        {/* ─── Form + Contact Info ─── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
              {/* Form */}
              <div className="lg:col-span-3">
                <ScrollSection>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Send Us a Message
                  </h2>
                  <div className="w-12 h-1 bg-golden mb-4" />
                  <p className="font-body font-light text-foreground/70 mb-8">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-subheading text-sm font-medium text-foreground mb-2">
                          Name <span className="text-primary">*</span>
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className={inputClasses}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-primary font-body">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block font-subheading text-sm font-medium text-foreground mb-2">
                          Email <span className="text-primary">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={inputClasses}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-primary font-body">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-subheading text-sm font-medium text-foreground mb-2">
                          Subject
                        </label>
                        <input
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          className={inputClasses}
                        />
                        {errors.subject && (
                          <p className="mt-1 text-xs text-primary font-body">
                            {errors.subject}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block font-subheading text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+27 XX XXX XXXX"
                          className={inputClasses}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-primary font-body">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-subheading text-sm font-medium text-foreground mb-2">
                        Message <span className="text-primary">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your inquiry, partnership interest, or any questions you have..."
                        rows={5}
                        className={`${inputClasses} h-auto py-3 resize-none`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-primary font-body">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-cherry inline-flex items-center justify-center rounded-lg px-8 h-12 font-subheading text-sm font-semibold shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-4 w-4" />
                    </button>
                  </form>
                </ScrollSection>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-2">
                <ScrollSection>
                  <div className="rounded-none bg-card/80 backdrop-blur-sm border border-border p-8 sticky top-28">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                      Who Should Reach Out
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Startups looking to scale with cloud solutions",
                        "Enterprises exploring digital transformation",
                        "Tech companies needing distribution partners",
                        "Organizations seeking META integrations",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 font-body text-xs text-muted-foreground"
                        >
                          <ChevronRight className="h-3 w-3 text-golden mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollSection>
              </div>
            </div>
          </div>
        </section>

        {/* ─── What to Expect ─── */}
        <section className="py-24 bg-secondary/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <ScrollSection>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                  What to Expect
                </h2>
                <div className="w-16 h-1 bg-golden mx-auto mb-4" />
                <p className="font-body font-light text-foreground/70">
                  We value every inquiry and aim to respond thoughtfully.
                </p>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {expectations.map((item) => {
                const Icon = item.icon;
                return (
                  <ScrollSection key={item.title}>
                    <div className="text-center rounded-none bg-card/80 backdrop-blur-sm border border-border p-8 hover:border-golden/30 transition-colors duration-300">
                      <div className="w-12 h-12 rounded-full bg-golden/20 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-5 w-5 text-golden" />
                      </div>
                      <h3 className="font-subheading text-base font-semibold text-foreground mb-2">
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

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
