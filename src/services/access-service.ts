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

export interface AdminAllowedEmail {
  id: string;
  email_pattern: string;
  is_domain_pattern: boolean;
  invited_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface AuditRow {
  id: string;
  business_id: string;
  module: string;
  is_granted: boolean;
  changed_by_email: string | null;
  source: string;
  note: string | null;
  created_at: string;
}

export const accessService = {
  getBusinessModuleAccess: async (businessId: string): Promise<ModuleAccessRow[]> => {
    const { data, error } = await supabase
      .from("business_module_access" as any).select("*").eq("business_id", businessId);
    if (error) throw error;
    return (data ?? []) as unknown as ModuleAccessRow[];
  },

  listAllModuleAccess: async (): Promise<ModuleAccessRow[]> => {
    const { data, error } = await supabase.from("business_module_access" as any).select("*");
    if (error) throw error;
    return (data ?? []) as unknown as ModuleAccessRow[];
  },

  setModuleAccess: async (params: {
    businessId: string; module: DashboardModule; isGranted: boolean; adminUserId: string;
  }) => {
    const { businessId, module, isGranted, adminUserId } = params;
    const { error } = await supabase.from("business_module_access" as any).upsert(
      {
        business_id: businessId, module, is_granted: isGranted,
        granted_by: adminUserId, granted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: "business_id,module" },
    );
    if (error) throw error;
  },

  // ─── Admin allowed emails (super-admin invites) ────────────────────────
  listAllowedAdmins: async (): Promise<AdminAllowedEmail[]> => {
    const { data, error } = await supabase
      .from("admin_allowed_emails" as any).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as AdminAllowedEmail[];
  },

  inviteAdmin: async (email: string, invitedBy: string | null, notes?: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) throw new Error("Email required");
    const { error } = await supabase.from("admin_allowed_emails" as any).insert({
      email_pattern: clean, is_domain_pattern: false, invited_by: invitedBy, notes: notes ?? null,
    } as any);
    if (error) throw error;
  },

  revokeAdmin: async (id: string) => {
    const { error } = await supabase.from("admin_allowed_emails" as any).delete().eq("id", id);
    if (error) throw error;
  },

  // ─── Audit log ────────────────────────────────────────────────────────
  listAudit: async (limit = 100): Promise<AuditRow[]> => {
    const { data, error } = await supabase
      .from("module_access_audit" as any).select("*")
      .order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as AuditRow[];
  },
};
