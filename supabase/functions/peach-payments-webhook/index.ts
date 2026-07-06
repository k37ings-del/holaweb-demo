// Peach Payments webhook stub.
// Later: verify Peach signature, map event → user subscription, then
// automatically grant admin-approved modules or revoke them all on lapse.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-peach-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

interface PeachEvent {
  type: string;                 // e.g. subscription.activated | subscription.renewed | subscription.cancelled | payment.failed
  user_id?: string;             // supabase user id (set via metadata when creating the checkout)
  business_id?: string;         // optional direct target
  subscription_id?: string;     // Peach subscription id (optional)
  status?: string;              // active | expired | cancelled | trial
  current_period_end?: string;  // ISO
  raw?: unknown;
}

function isActive(type: string, status?: string): boolean {
  const t = type.toLowerCase();
  const s = (status ?? "").toLowerCase();
  if (t.includes("activated") || t.includes("renewed") || t.includes("succeeded")) return true;
  if (["active", "trial", "trialing"].includes(s)) return true;
  return false;
}

async function resolveBusinessId(evt: PeachEvent): Promise<string | null> {
  if (evt.business_id) return evt.business_id;
  if (!evt.user_id) return null;
  const { data } = await admin.from("businesses").select("id").eq("user_id", evt.user_id).limit(1);
  return data?.[0]?.id ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // TODO: verify signature against PEACH_WEBHOOK_SECRET once Peach is live.
    const evt = (await req.json()) as PeachEvent;
    const businessId = await resolveBusinessId(evt);

    if (!businessId) {
      return new Response(JSON.stringify({ ok: true, note: "no business matched — event stored only" }),
        { headers: { ...corsHeaders, "content-type": "application/json" }, status: 200 });
    }

    const active = isActive(evt.type, evt.status);

    // Sync managed modules via SECURITY DEFINER helper.
    const { error: syncErr } = await admin.rpc("sync_business_modules_for_subscription" as any, {
      _business_id: businessId,
      _is_active: active,
    });
    if (syncErr) throw syncErr;

    // Mirror status into user_subscriptions if we can find one.
    if (evt.user_id) {
      await admin
        .from("user_subscriptions")
        .update({
          status: active ? "active" : (evt.status ?? "expired"),
          ...(evt.current_period_end ? { ends_at: evt.current_period_end } : {}),
        })
        .eq("user_id", evt.user_id);
    }

    return new Response(
      JSON.stringify({ ok: true, business_id: businessId, active }),
      { headers: { ...corsHeaders, "content-type": "application/json" }, status: 200 },
    );
  } catch (e) {
    console.error("peach-payments-webhook error", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }),
      { headers: { ...corsHeaders, "content-type": "application/json" }, status: 500 });
  }
});
