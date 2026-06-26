import { supabase } from "@/integrations/supabase/client";

export const customerService = {
  getCustomers: async (businessId: string) => {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    return data ?? [];
  },

  createCustomer: async (businessId: string, userId: string, data: {
    name: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    tags?: string[] | null;
  }) => {
    const { data: customer, error } = await supabase
      .from("customers")
      .insert({
        business_id: businessId,
        user_id: userId,
        ...data,
      })
      .select()
      .single();
    if (error) throw error;
    return customer;
  },

  updateCustomer: async (customerId: string, data: Record<string, unknown>) => {
    const { error } = await supabase
      .from("customers")
      .update(data)
      .eq("id", customerId);
    if (error) throw error;
  },

  deleteCustomer: async (customerId: string) => {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);
    if (error) throw error;
  },
};
