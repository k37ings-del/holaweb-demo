import { supabase } from "@/integrations/supabase/client";

export interface WebhookEvent {
  id: string;
  source: string;
  event_type: string;
  business_id: string | null;
  user_id: string | null;
  target_email: string | null;
  title: string;
  message: string | null;
  link: string | null;
  payload: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export const webhookEventsService = {
  list: async (limit = 25, offset = 0): Promise<WebhookEvent[]> => {
    const { data, error } = await supabase
      .from("webhook_events" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return (data ?? []) as unknown as WebhookEvent[];
  },
  unreadCount: async (): Promise<number> => {
    const { count, error } = await supabase
      .from("webhook_events" as any)
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    if (error) throw error;
    return count ?? 0;
  },
  markRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("webhook_events" as any)
      .update({ is_read: true } as any)
      .eq("id", id);
    if (error) throw error;
  },
  markAllRead: async (): Promise<void> => {
    const { error } = await supabase
      .from("webhook_events" as any)
      .update({ is_read: true } as any)
      .eq("is_read", false);
    if (error) throw error;
  },
};
