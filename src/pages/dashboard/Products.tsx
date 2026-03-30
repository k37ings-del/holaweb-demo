import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ShoppingBag, Edit2, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("product");
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
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("business_id", businesses[0].id)
          .order("created_at", { ascending: false });
        setProducts(data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!businessId || !name) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("products")
      .insert({
        business_id: businessId,
        user_id: session.user.id,
        name,
        price: parseFloat(price) || 0,
        description,
        type,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProducts([data, ...products]);
      setShowForm(false);
      setName("");
      setPrice("");
      setDescription("");
      toast({ title: "Product added!" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
      toast({ title: "Product deleted" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Products & Services</h1>
          <p className="font-body text-sm text-muted-foreground">Manage what you sell.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-cherry flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">New Product</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="block font-body text-sm text-foreground mb-1">Price (ZAR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              placeholder="Optional description"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={!name}
              className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">No products yet</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">Add your first product to get started.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-subheading text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    R{Number(p.price).toFixed(2)} · {p.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
