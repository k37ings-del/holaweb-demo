import { supabase } from "@/integrations/supabase/client";

export const checkoutService = {
  getPaymentLinkBySlug: async (slug: string) => {
    const { data } = await supabase
      .rpc("get_active_payment_link_by_slug", { _slug: slug })
      .maybeSingle();
    return data;
  },

  createOrder: async (body: {
    payment_link_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string | null;
  }) => {
    const { data, error } = await supabase.functions.invoke("create-order", {
      body,
    });
    if (error) throw error;
    return data;
  },
};
