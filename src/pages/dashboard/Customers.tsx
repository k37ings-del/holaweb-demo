import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/use-customers";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { ErrorState } from "@/components/feedback";
import { Users, Plus, X, Trash2, Search, Tag, Edit2, Check, Database } from "lucide-react";

const Customers = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const { toast } = useToast();

  const { user } = useAuth();
  const { businessId } = useBusiness();

  const { data: customers = [], isLoading, error, refetch } = useCustomers(businessId);
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setTags("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleAdd = async () => {
    if (!businessId || !name || !user?.id) return;
    const tagArray = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
    createCustomer.mutate(
      {
        businessId,
        userId: user.id,
        data: {
          name,
          ...(email && { email }),
          ...(phone && { phone }),
          ...(notes && { notes }),
          ...(tagArray.length > 0 && { tags: tagArray }),
        },
      },
      {
        onError: (error: any) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
        onSuccess: () => {
          resetForm();
          toast({ title: "Customer added!" });
        },
      }
    );
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer.id);
    setName(customer.name);
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setNotes(customer.notes || "");
    setTags(customer.tags?.join(", ") || "");
    setShowForm(true);
  };

  const handleUpdate = async () => {
    if (!editingId || !name) return;
    const tagArray = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
    updateCustomer.mutate(
      {
        customerId: editingId,
        data: {
          name,
          ...(email && { email }),
          ...(phone && { phone }),
          ...(notes && { notes }),
          ...(tagArray.length > 0 && { tags: tagArray }),
        },
      },
      {
        onError: (error: any) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
        onSuccess: () => {
          resetForm();
          toast({ title: "Customer updated!" });
        },
      }
    );
  };

  const handleDelete = async (id: string) => {
    deleteCustomer.mutate(id, {
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
      onSuccess: () => {
        toast({ title: "Customer removed" });
      },
    });
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Customers</h1>
          <p className="font-body text-sm text-muted-foreground">Manage your customer relationships · Zoho CRM sync coming soon</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-cherry flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* CRM Integration Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <Database className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-subheading text-sm font-semibold text-foreground">Zoho CRM Integration</p>
          <p className="font-body text-xs text-muted-foreground">Sync contacts, track purchase history, and segment customers automatically. Integration coming soon.</p>
        </div>
        <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-body text-xs font-medium shrink-0">Coming Soon</span>
      </div>

      {/* Search */}
      {customers.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search customers by name, email, or phone..."
          />
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">{editingId ? "Edit Customer" : "New Customer"}</h3>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block font-body text-sm text-foreground mb-1">Name *</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Customer name" /></div>
            <div><label className="block font-body text-sm text-foreground mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Optional" /></div>
            <div><label className="block font-body text-sm text-foreground mb-1">Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Optional" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block font-body text-sm text-foreground mb-1">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Internal notes about this customer" /></div>
            <div><label className="block font-body text-sm text-foreground mb-1">Tags</label><input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="VIP, wholesale, new (comma separated)" /></div>
          </div>
          <button onClick={editingId ? handleUpdate : handleAdd} disabled={!name} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">
            {editingId ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">No customers yet</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">Add customers to track relationships and purchase history.</p>
          <button onClick={() => setShowForm(true)} className="btn-cherry inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-subheading text-sm font-semibold"><Plus className="w-4 h-4" /> Add Customer</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && search && (
            <div className="text-center py-8 text-muted-foreground font-body text-sm">No customers match "{search}"</div>
          )}
          {filtered.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-heading text-sm font-bold text-primary">{c.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-subheading text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{c.email || c.phone || "No contact info"}</p>
                    {c.notes && <p className="font-body text-xs text-muted-foreground/70 mt-1 truncate">{c.notes}</p>}
                    {c.tags && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.tags.map((tag: string) => (
                          <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body text-[10px] font-medium">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => handleEdit(c)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-muted">
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

export default Customers;
