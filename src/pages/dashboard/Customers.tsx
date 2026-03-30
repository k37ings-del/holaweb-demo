import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: businesses } = await supabase.from("businesses").select("id").eq("user_id", session.user.id).limit(1);
      if (businesses && businesses.length > 0) {
        setBusinessId(businesses[0].id);
        const { data } = await supabase.from("customers").select("*").eq("business_id", businesses[0].id).order("created_at", { ascending: false });
        setCustomers(data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!businessId || !name) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase.from("customers").insert({
      business_id: businessId, user_id: session.user.id, name, email: email || null, phone: phone || null,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCustomers([data, ...customers]);
      setShowForm(false);
      setName(""); setEmail(""); setPhone("");
      toast({ title: "Customer added!" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Customers</h1>
          <p className="font-body text-sm text-muted-foreground">Manage your customer relationships.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-cherry flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">New Customer</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block font-body text-sm text-foreground mb-1">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Customer name" /></div>
            <div><label className="block font-body text-sm text-foreground mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Optional" /></div>
            <div><label className="block font-body text-sm text-foreground mb-1">Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Optional" /></div>
          </div>
          <button onClick={handleAdd} disabled={!name} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">Add Customer</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">No customers yet</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">Add customers to track relationships.</p>
          <button onClick={() => setShowForm(true)} className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold"><Plus className="w-4 h-4" /> Add Customer</button>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-heading text-sm font-bold text-primary">{c.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-subheading text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{c.email || c.phone || "No contact info"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;
