import { supabase } from "@/integrations/supabase/client";

export const paymentService = {
  getPaymentLinks: async (businessId: string) => {
    const { data } = await supabase
      .from("payment_links")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    return data ?? [];
  },

  createPaymentLink: async (businessId: string, userId: string, data: {
    title: string;
    amount: number;
    description?: string;
    slug: string;
    product_id?: string;
  }) => {
    const { data: link, error } = await supabase
      .from("payment_links")
      .insert({
        business_id: businessId,
        user_id: userId,
        ...data,
      })
      .select()
      .single();
    if (error) throw error;
    return link;
  },

  togglePaymentLink: async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("payment_links")
      .update({ is_active: !isActive })
      .eq("id", id);
    if (error) throw error;
  },

  deletePaymentLink: async (id: string) => {
    const { error } = await supabase
      .from("payment_links")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  generateSlug: () =>
    `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
};
