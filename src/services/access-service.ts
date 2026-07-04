import { supabase } from "@/integrations/supabase/client";

export type DashboardModule = "products" | "messaging" | "analytics";
export const MANAGED_MODULES: DashboardModule[] = ["products", "messaging", "analytics"];

export interface ModuleAccessRow {
  id: string;
  business_id: string;
  module: DashboardModule;
  is_granted: boolean;
  granted_by: string | null;
  granted_at: string;
}

export const accessService = {
  /** Modules explicitly granted to a business (regardless of subscription). */
  getBusinessModuleAccess: async (businessId: string): Promise<ModuleAccessRow[]> => {
    const { data, error } = await supabase
      .from("business_module_access" as any)
      .select("*")
      .eq("business_id", businessId);
    if (error) throw error;
    return (data ?? []) as unknown as ModuleAccessRow[];
  },

  /** Admin: fetch all module-access rows across businesses. */
  listAllModuleAccess: async (): Promise<ModuleAccessRow[]> => {
    const { data, error } = await supabase
      .from("business_module_access" as any)
      .select("*");
    if (error) throw error;
    return (data ?? []) as unknown as ModuleAccessRow[];
  },

  /** Admin: grant or revoke a module for a business (upsert). */
  setModuleAccess: async (params: {
    businessId: string;
    module: DashboardModule;
    isGranted: boolean;
    adminUserId: string;
  }) => {
    const { businessId, module, isGranted, adminUserId } = params;
    const { error } = await supabase
      .from("business_module_access" as any)
      .upsert(
        {
          business_id: businessId,
          module,
          is_granted: isGranted,
          granted_by: adminUserId,
          granted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: "business_id,module" },
      );
    if (error) throw error;
  },
};
