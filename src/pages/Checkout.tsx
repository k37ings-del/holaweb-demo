import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Lock } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

const Checkout = () => {
  const { slug } = useParams();
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("payment_links")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      setPaymentLink(data);
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentLink) return;
    setSubmitting(true);
    setError("");

    // Use server-side edge function to create order
    const { data, error: fnError } = await supabase.functions.invoke("create-order", {
      body: {
        payment_link_id: paymentLink.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
      },
    });

    if (fnError || (data && data.error)) {
      setError(data?.error || "Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Payment link not found</h1>
          <p className="font-body text-muted-foreground">This link may have expired or been deactivated.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Order Received!</h1>
          <p className="font-body text-muted-foreground mb-2">
            Your order for <span className="text-foreground font-semibold">R{Number(paymentLink.amount).toFixed(2)}</span> has been submitted.
          </p>
          <p className="font-body text-sm text-muted-foreground">
            The business will contact you with payment instructions shortly.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Holaweb" className="h-8 mx-auto mb-4" />
          <div className="inline-flex items-center gap-1 text-muted-foreground font-body text-xs mb-4">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Product info */}
          <div className="p-6 border-b border-border">
            <h1 className="font-heading text-xl font-bold text-foreground mb-1">{paymentLink.title}</h1>
            {paymentLink.description && (
              <p className="font-body text-sm text-muted-foreground mb-3">{paymentLink.description}</p>
            )}
            <p className="font-heading text-3xl font-bold text-primary">
              R{Number(paymentLink.amount).toFixed(2)}
              <span className="font-body text-sm text-muted-foreground ml-1">{paymentLink.currency}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <p className="text-sm text-red-500 font-body">{error}</p>
            )}
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                maxLength={200}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                maxLength={255}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                maxLength={30}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+27..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-cherry rounded-lg px-4 py-3.5 font-subheading text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "Processing..." : `Pay R${Number(paymentLink.amount).toFixed(2)}`}
            </button>
          </form>

          <div className="px-6 pb-4 flex items-center justify-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-body text-xs">Powered by Holaweb</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
