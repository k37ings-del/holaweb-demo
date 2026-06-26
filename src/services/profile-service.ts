import { supabase } from "@/integrations/supabase/client";

export const profileService = {
  getProfile: async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data;
  },

  updateProfile: async (userId: string, data: { full_name: string }) => {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);
    if (error) throw error;
  },
};
