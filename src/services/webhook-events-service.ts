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
  list: async (limit = 25): Promise<WebhookEvent[]> => {
    const { data, error } = await supabase
      .from("webhook_events" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as WebhookEvent[];
  },
  markRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("webhook_events" as any)
      .update({ is_read: true } as any)
      .eq("id", id);
    if (error) throw error;
  },
};
