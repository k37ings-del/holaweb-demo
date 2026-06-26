import { supabase } from "@/integrations/supabase/client";

export const businessService = {
  getCurrentBusiness: async (userId: string) => {
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .limit(1);
    return data?.[0] ?? null;
  },

  getBusinessById: async (businessId: string) => {
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();
    return data;
  },

  getBusinessStats: async (businessId: string) => {
    const [products, customers, orders, paymentLinks] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("payment_links").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    ]);

    return {
      products: products.count || 0,
      customers: customers.count || 0,
      orders: orders.count || 0,
      paymentLinks: paymentLinks.count || 0,
    };
  },

  createBusiness: async (data: {
    user_id: string;
    name: string;
    type: string;
    setup_priorities?: string[];
    onboarding_completed?: boolean;
  }) => {
    const { data: business, error } = await supabase
      .from("businesses")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return business;
  },

  updateBusiness: async (businessId: string, data: Record<string, unknown>) => {
    const { error } = await supabase
      .from("businesses")
      .update(data)
      .eq("id", businessId);
    if (error) throw error;
  },
};
