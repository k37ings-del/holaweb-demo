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

SERVICES:
1. Cloud Services (slug: cloud-services) — Enterprise-grade AWS cloud solutions: migration, optimization, security, compliance, 24/7 monitoring. Most popular service.
2. Web & App Development (slug: web-app-development) — Custom responsive websites, web platforms, mobile apps, UI/UX design.
3. Market Access (slug: market-access) — Strategic distribution, customer acquisition, market penetration, revenue growth for tech startups with working products.
4. META Solutions (slug: meta-solutions) — WhatsApp Business API integration, chatbot automation, payment integration, CRM connection.

SME IMPACT PLATFORM:
A cloud-based digital platform that empowers enterprise and supplier development stakeholders to collaborate in SMME development, supplier diversity, and localisation. Supports SDG No 8: Decent Work and Economic Growth. Website: https://smeimpact.co.za/

LEADERSHIP:
- Siyabonga Tiwana, CEO — 10+ years leading a tech startup, specializing in customer success, account management, and business development.
- Vuyisa Qabaka, African Rainmaker — Pan Africa focused startup and corporate innovation expert, angel investor and business mentor with experience across 13 countries in Africa.

CONTACT:
- WhatsApp: +27 71 513 8219
- Get Started page available at /quick_start
- Contact form at /contact

PAGES ON THE WEBSITE:
- Home: /
- About: /about
- Services: /services
- Cloud Services: /services/cloud-services
- Web & App Development: /services/web-app-development
- Market Access: /services/market-access
- META Solutions: /services/meta-solutions
- Contact: /contact
- Quick Start: /quick_start

NAVIGATION ACTIONS:
When a user asks about getting started, signing up, or beginning their journey, suggest navigating to the Quick Start page.
When a user asks about services, suggest the services page or specific service pages.
When a user asks about contacting, suggest the contact page or WhatsApp.
When a user asks about who Holaweb is, suggest the about page.

IMPORTANT: When you want to suggest navigation, include a special action tag in your response like this:
[ACTION:navigate:/quick_start:Get Started Now]
[ACTION:navigate:/services:View Our Services]
[ACTION:navigate:/contact:Contact Us]
[ACTION:link:https://wa.me/27715138219:Chat on WhatsApp]
[ACTION:link:https://smeimpact.co.za/:Visit SME Impact]

You can include multiple actions. The format is [ACTION:type:url:label].

TONE GUIDELINES:
- Be warm and approachable, like a knowledgeable friend
- Use "we" when talking about Holaweb
- Show genuine enthusiasm about helping
- If you don't know something specific, be honest and suggest contacting the team
- Sprinkle in light personality — you're not a boring FAQ bot
- Don't use emojis excessively, one per message max if any`;

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

    const { messages, language } = await req.json();

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
