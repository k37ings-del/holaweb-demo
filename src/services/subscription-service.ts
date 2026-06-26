import { supabase } from "@/integrations/supabase/client";

export const subscriptionService = {
  getCurrentSubscription: async (userId: string) => {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("*, subscription_plans(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    return data?.[0] ?? null;
  },
};
