import { supabase } from "@/integrations/supabase/client";
import { authService } from "./auth-service";

export const adminService = {
  getAdminData: async () => {
    const [bizRes, subRes, refRes, planRes] = await Promise.all([
      supabase.from("businesses").select("*"),
      supabase.from("user_subscriptions").select("*, subscription_plans(name, price, currency)"),
      supabase.from("referral_codes").select("*"),
      supabase.from("subscription_plans").select("*").order("price", { ascending: true }),
    ]);

    return {
      businesses: bizRes.data ?? [],
      subscriptions: subRes.data ?? [],
      referralCodes: refRes.data ?? [],
      plans: planRes.data ?? [],
      stats: {
        totalUsers: (bizRes.data ?? []).length,
        activeSubscriptions: (subRes.data ?? []).filter((s: any) => s.status === "active" || s.status === "trial").length,
        totalRevenue: 0,
        referralCodes: (refRes.data ?? []).length,
      },
    };
  },

  checkIsAdmin: async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    return (data?.length ?? 0) > 0;
  },

  createReferralCode: async (data: Record<string, unknown>) => {
    const { error } = await supabase
      .from("referral_codes")
      .insert(data as any);
    if (error) throw error;
  },

  deleteReferralCode: async (id: string) => {
    const { error } = await supabase
      .from("referral_codes")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  togglePlanActive: async (planId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("subscription_plans")
      .update({ is_active: !isActive })
      .eq("id", planId);
    if (error) throw error;
  },

  updatePlan: async (planId: string, data: Record<string, unknown>) => {
    const { error } = await supabase
      .from("subscription_plans")
      .update(data)
      .eq("id", planId);
    if (error) throw error;
  },

  updateUserPassword: async (newPassword: string) => {
    const { error } = await authService.updateUser({ password: newPassword });
    if (error) throw error;
  },

  getActiveReferralCode: async (code: string) => {
    const { data } = await supabase.rpc("get_active_referral_code", { _code: code });
    return Array.isArray(data) ? data[0] ?? null : data;
  },
};
