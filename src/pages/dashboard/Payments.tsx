import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Plus, Link2, Copy, ExternalLink, X, Check, Share2, ToggleLeft, ToggleRight, Trash2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
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

  const generateSlug = () => `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

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
        product_id: selectedProduct || null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPaymentLinks([data, ...paymentLinks]);
      setShowForm(false);
      setTitle(""); setAmount(""); setDescription(""); setSelectedProduct("");
      toast({ title: "Payment link created!" });
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase.from("payment_links").update({ is_active: !currentState }).eq("id", id);
    if (!error) {
      setPaymentLinks(paymentLinks.map(l => l.id === id ? { ...l, is_active: !currentState } : l));
      toast({ title: !currentState ? "Link activated" : "Link deactivated" });
    }
  };

  const deletePaymentLink = async (id: string) => {
    const { error } = await supabase.from("payment_links").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPaymentLinks(paymentLinks.filter(l => l.id !== id));
      toast({ title: "Payment link deleted" });
    }
  };

  const getCheckoutUrl = (slug: string) => `${window.location.origin}/checkout/${slug}`;

  const copyLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(getCheckoutUrl(slug));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Link copied!" });
  };

  const shareWhatsApp = (link: any) => {
    const text = `Pay for ${link.title} — R${Number(link.amount).toFixed(2)}\n${getCheckoutUrl(link.slug)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const selectProduct = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      setTitle(product.name);
      setAmount(String(product.price));
      setDescription(product.description || "");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Payment Links</h1>
          <p className="font-body text-sm text-muted-foreground">Create and share payment links · Powered by Peach Payments</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-cherry flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold">
          <Plus className="w-4 h-4" /> Create Link
        </button>
      </div>

      {/* Integration Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-subheading text-sm font-semibold text-foreground">Peach Payments Integration</p>
          <p className="font-body text-xs text-muted-foreground">Accept card payments, mobile money, and EFT. Integration coming soon — payment links are ready to share.</p>
        </div>
        <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-body text-xs font-medium shrink-0">Coming Soon</span>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">New Payment Link</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>

          {products.length > 0 && (
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Link to Product (optional)</label>
              <select
                value={selectedProduct}
                onChange={(e) => selectProduct(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Custom amount</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — R{Number(p.price).toFixed(2)}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Website Design Fee" />
            </div>
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Amount (ZAR)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block font-body text-sm text-foreground mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Optional details" />
          </div>
          <button onClick={handleCreate} disabled={!title || !amount} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">
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
          <p className="font-body text-sm text-muted-foreground mb-4">Create a payment link and share it with customers via WhatsApp, email, or SMS.</p>
          <button onClick={() => setShowForm(true)} className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold">
            <Plus className="w-4 h-4" /> Create Payment Link
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentLinks.map((link) => (
            <div key={link.id} className={`bg-card border rounded-lg p-4 transition-colors ${link.is_active ? 'border-border' : 'border-border/50 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-subheading text-sm font-semibold text-foreground">{link.title}</p>
                    <span className={`px-2 py-0.5 rounded-full font-body text-[10px] font-medium ${link.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {link.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="font-heading text-lg font-bold text-primary">R{Number(link.amount).toFixed(2)}</p>
                  {link.description && <p className="font-body text-xs text-muted-foreground mt-1">{link.description}</p>}
                  <p className="font-body text-xs text-muted-foreground mt-2 truncate">{getCheckoutUrl(link.slug)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => copyLink(link.slug, link.id)} className="flex items-center gap-1 bg-muted border border-border rounded-lg px-2.5 py-2 font-body text-xs text-foreground hover:bg-primary/10 transition-colors" title="Copy link">
                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => shareWhatsApp(link)} className="flex items-center gap-1 bg-muted border border-border rounded-lg px-2.5 py-2 font-body text-xs text-foreground hover:bg-green-500/10 transition-colors" title="Share on WhatsApp">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                  <a href={getCheckoutUrl(link.slug)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-muted border border-border rounded-lg px-2.5 py-2 font-body text-xs text-foreground hover:bg-primary/10 transition-colors" title="Preview">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => toggleActive(link.id, link.is_active)} className="flex items-center gap-1 bg-muted border border-border rounded-lg px-2.5 py-2 font-body text-xs text-foreground hover:bg-accent transition-colors" title={link.is_active ? "Deactivate" : "Activate"}>
                    {link.is_active ? <ToggleRight className="w-3.5 h-3.5 text-primary" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => deletePaymentLink(link.id)} className="flex items-center gap-1 bg-muted border border-border rounded-lg px-2.5 py-2 font-body text-xs text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
