import { supabase } from "@/integrations/supabase/client";

export const productService = {
  getProducts: async (businessId: string) => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    return data ?? [];
  },

  createProduct: async (businessId: string, userId: string, data: Record<string, unknown>) => {
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        business_id: businessId,
        user_id: userId,
        ...data,
      } as any)
      .select()
      .single();
    if (error) throw error;
    return product;
  },

  deleteProduct: async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) throw error;
  },

  importProducts: async (businessId: string, userId: string, products: Record<string, unknown>[]) => {
    const inserts = products.map((p) => ({
      name: String(p.name ?? ""),
      price: parseFloat(String(p.price ?? "").replace(/[^0-9.]/g, "")) || 0,
      description: String(p.description ?? ""),
      image_url: (p.imageUrl as string) || null,
      business_id: businessId,
      user_id: userId,
      is_active: true,
    }));

    const { error } = await supabase.from("products").insert(inserts);
    if (error) throw error;
  },
};
