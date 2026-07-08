// FOSSBilling webhook receiver.
// Accepts POST events from https://client.holaweb.co.za and stores them in
// public.webhook_events so they surface in the Holaweb dashboard notifications panel.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-fossbilling-signature, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

interface FossEvent {
  event?: string;              // e.g. "invoice.paid", "invoice.created", "ticket.opened"
  type?: string;               // alternate field name
  client_email?: string;
  email?: string;
  business_id?: string;
  user_id?: string;
  title?: string;
  message?: string;
  link?: string;
  [k: string]: unknown;
}

function pickEventType(evt: FossEvent): string {
  return String(evt.event ?? evt.type ?? "notification");
}

function buildTitle(evt: FossEvent): string {
  if (evt.title) return String(evt.title);
  const t = pickEventType(evt);
  return `FOSSBilling: ${t.replace(/[._]/g, " ")}`;
}

function buildMessage(evt: FossEvent): string {
  if (evt.message) return String(evt.message);
  if (evt.client_email || evt.email) return `Event for ${evt.client_email ?? evt.email}`;
  return "New event received from FOSSBilling.";
}

async function resolveIds(evt: FossEvent) {
  let userId = (evt.user_id as string | undefined) ?? null;
  let businessId = (evt.business_id as string | undefined) ?? null;
  const email = (evt.client_email ?? evt.email) as string | undefined;

  if (!businessId && email) {
    const { data: users } = await admin.auth.admin.listUsers();
    const match = users?.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
    if (match) {
      userId = userId ?? match.id;
      const { data: biz } = await admin.from("businesses").select("id").eq("user_id", match.id).limit(1);
      businessId = businessId ?? biz?.[0]?.id ?? null;
    }
  }

  return { userId, businessId, email: email ?? null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Optional shared-secret check.
    const expected = Deno.env.get("FOSSBILLING_WEBHOOK_SECRET");
    if (expected) {
      const provided = req.headers.get("x-webhook-secret") ?? "";
      if (provided !== expected) {
        return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
    }

    const evt = (await req.json()) as FossEvent;
    const { userId, businessId, email } = await resolveIds(evt);

    const { error } = await admin.from("webhook_events").insert({
      source: "fossbilling",
      event_type: pickEventType(evt),
      business_id: businessId,
      user_id: userId,
      target_email: email,
      title: buildTitle(evt),
      message: buildMessage(evt),
      link: evt.link ? String(evt.link) : "https://client.holaweb.co.za",
      payload: evt as any,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (e) {
    console.error("fossbilling-webhook error", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
