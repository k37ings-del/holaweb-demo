import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { payment_link_id, customer_name, customer_email, customer_phone } = await req.json();

    // Validate inputs
    if (!payment_link_id || typeof payment_link_id !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid payment link." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const name = String(customer_name || "").trim().slice(0, 200);
    const email = String(customer_email || "").trim().slice(0, 255);
    const phone = customer_phone ? String(customer_phone).trim().slice(0, 30) : null;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to resolve payment link server-side
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: link, error: linkError } = await supabase
      .from("payment_links")
      .select("id, amount, currency, business_id, user_id, is_active")
      .eq("id", payment_link_id)
      .single();

    if (linkError || !link || !link.is_active) {
      return new Response(
        JSON.stringify({ error: "Payment link not found or inactive." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create order with server-resolved values
    const { error: insertError } = await supabase.from("orders").insert({
      business_id: link.business_id,
      user_id: link.user_id,
      payment_link_id: link.id,
      amount: link.amount,
      currency: link.currency,
      status: "pending",
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
    });

    if (insertError) {
      console.error("Order insert error:", insertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to create order." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-order error:", e instanceof Error ? e.message : e);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
