import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Plus, Link2, Copy, ExternalLink, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      if (businesses && businesses.length > 0) {
        setBusinessId(businesses[0].id);
        const [linksRes, prodsRes] = await Promise.all([
          supabase.from("payment_links").select("*").eq("business_id", businesses[0].id).order("created_at", { ascending: false }),
          supabase.from("products").select("*").eq("business_id", businesses[0].id),
        ]);
        setPaymentLinks(linksRes.data || []);
        setProducts(prodsRes.data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const generateSlug = () => {
    return `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  };

  const handleCreate = async () => {
    if (!businessId || !title || !amount) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const slug = generateSlug();
    const { data, error } = await supabase
      .from("payment_links")
      .insert({
        business_id: businessId,
        user_id: session.user.id,
        title,
        amount: parseFloat(amount),
        description,
        slug,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPaymentLinks([data, ...paymentLinks]);
      setShowForm(false);
      setTitle("");
      setAmount("");
      setDescription("");
      toast({ title: "Payment link created!" });
    }
  };

  const getCheckoutUrl = (slug: string) => `${window.location.origin}/checkout/${slug}`;

  const copyLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(getCheckoutUrl(slug));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Link copied!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Payment Links</h1>
          <p className="font-body text-sm text-muted-foreground">Create and share payment links.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-cherry flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Create Link
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">New Payment Link</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Website Design Fee"
              />
            </div>
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Amount (ZAR)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block font-body text-sm text-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Optional details"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!title || !amount}
            className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50"
          >
            Create Payment Link
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
      ) : paymentLinks.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">No payment links yet</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">Create a payment link and share it with customers.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Create Payment Link
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentLinks.map((link) => (
            <div key={link.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-subheading text-sm font-semibold text-foreground">{link.title}</p>
                  <p className="font-heading text-lg font-bold text-primary">R{Number(link.amount).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(link.slug, link.id)}
                    className="flex items-center gap-1 bg-muted border border-border rounded-lg px-3 py-2 font-body text-xs text-foreground hover:bg-primary/10 transition-colors"
                  >
                    {copiedId === link.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                    {copiedId === link.id ? "Copied" : "Copy"}
                  </button>
                  <a
                    href={getCheckoutUrl(link.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-muted border border-border rounded-lg px-3 py-2 font-body text-xs text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> Preview
                  </a>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground truncate">{getCheckoutUrl(link.slug)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
