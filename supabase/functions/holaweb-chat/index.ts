import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15; // max requests per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const HOLAWEB_CONTEXT = `You are Ola, the friendly AI assistant for Holaweb Media Group. You have a warm, conversational personality — think helpful colleague, not robotic chatbot. Use natural language, contractions, and a touch of enthusiasm. Keep responses concise (2-4 sentences max unless asked for detail).

ABOUT HOLAWEB:
Holaweb Media Group is a South African digital solutions company focused on inclusive, cloud-powered products. They're an official AWS Partner. Founded to ensure every entrepreneur and institution — from township to enterprise — can compete and grow through simple, affordable technology.

Vision: To be Africa's leading digital inclusion enablement partner.
Mission: To connect great products with the right markets — driving growth, efficiency, and impact.

SERVICES / PLATFORM:
Holaweb's services are delivered through the Holaweb Platform — a unified Business OS covering websites, payments, CRM, messaging, and analytics. Whenever a user asks to see services, what we offer, our products, or anything similar, point them to the Platform page (/platform), NOT to /services or any service subpage.

Pillars included on the Platform:
1. Custom Websites & Web/App Development
2. META Solutions (WhatsApp Business API, chatbot automation)
3. Payments (Peach Payments integration, payment links)
4. CRM & Customer Management
5. Cloud Services (AWS — migration, optimization, security, 24/7 monitoring)
6. Market Access

SME IMPACT PLATFORM:
A cloud-based digital platform supporting SMME development and SDG 8. Website: https://smeimpact.co.za/

LEADERSHIP:
- Siyabonga Tiwana, CEO
- Vuyisa Qabaka, African Rainmaker

CONTACT:
- WhatsApp: +27 71 513 8219
- Quick Start: /quick_start
- Contact: /contact

PAGES:
- Home: /
- About: /about
- Platform (services overview): /platform
- Contact: /contact
- Quick Start: /quick_start

NAVIGATION ACTIONS:
- Any "services", "what do you offer", "show me your products", "show me your services" style query → suggest /platform.
- Getting started / signing up → /quick_start
- Contact → /contact or WhatsApp link
- Who is Holaweb → /about

IMPORTANT: To suggest navigation, include action tags like:
[ACTION:navigate:/platform:Explore the Platform]
[ACTION:navigate:/quick_start:Get Started Now]
[ACTION:navigate:/contact:Contact Us]
[ACTION:link:https://wa.me/27715138219:Chat on WhatsApp]
[ACTION:link:https://smeimpact.co.za/:Visit SME Impact]

NEVER link to /services or /services/<slug> — always use /platform for service-related queries.

TONE:
- Warm, approachable, "we" voice
- Honest when unsure — suggest contacting the team
- One emoji max per message`;

const DASHBOARD_CONTEXT = `You are Ola, the in-dashboard AI assistant for Holaweb Platform users. The user is already signed in and working inside their dashboard.

Your job: give clear, concise SUMMARIES and answers to whatever the user asks — about their products, payments, customers, messaging, website, analytics, settings, or general how-to questions about the platform.

STRICT RULES:
- DO NOT redirect the user anywhere. Never emit [ACTION:navigate:...] or [ACTION:link:...] tags.
- DO NOT suggest visiting other pages or external links.
- Just summarize, explain, or answer in plain text.
- Keep responses short and useful (2-5 sentences unless the user asks for more detail).
- Warm, helpful tone. One emoji max.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, language, mode } = await req.json();
    const systemContext = mode === "dashboard" ? DASHBOARD_CONTEXT : HOLAWEB_CONTEXT;

    // Validate messages input
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid request." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string" || msg.content.length > 5000) {
        return new Response(
          JSON.stringify({ error: "Invalid request." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LANGUAGE_MAP: Record<string, string> = {
      en: "",
      xh: "\n\nIMPORTANT: You MUST respond entirely in isiXhosa (Xhosa). Translate your entire response into isiXhosa. Keep action tags [ACTION:...] in English.",
      zu: "\n\nIMPORTANT: You MUST respond entirely in isiZulu (Zulu). Translate your entire response into isiZulu. Keep action tags [ACTION:...] in English.",
      af: "\n\nIMPORTANT: You MUST respond entirely in Afrikaans. Translate your entire response into Afrikaans. Keep action tags [ACTION:...] in English.",
      nl: "\n\nIMPORTANT: You MUST respond entirely in Dutch (Nederlands). Translate your entire response into Dutch. Keep action tags [ACTION:...] in English.",
    };
    const langSuffix = LANGUAGE_MAP[typeof language === "string" ? language : "en"] || "";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: HOLAWEB_CONTEXT + langSuffix },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm getting a lot of questions right now! Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Chat credits have been used up. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e instanceof Error ? e.message : e);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
