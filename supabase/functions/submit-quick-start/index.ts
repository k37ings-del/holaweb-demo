import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SPREADSHEET_ID = "1HpeHhsMDkJxKcALH4RnXxhb1RRxYlyMiHu5EOYmRTsk";
const SHEET_NAME = "Form Responses 1";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60_000; // per minute

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

function sanitize(val: unknown, maxLen = 500): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim().slice(0, maxLen);
  // Strip potential injection characters
  return str.replace(/[<>]/g, "");
}

function sanitizeArray(val: unknown, maxItems = 10, maxLen = 200): string[] {
  if (!Array.isArray(val)) return [];
  return val.slice(0, maxItems).map((v) => sanitize(v, maxLen));
}

async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const toBase64Url = (str: string) =>
    btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claimSet = toBase64Url(
    JSON.stringify({
      iss: serviceAccountKey.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );

  const unsignedToken = `${header}.${claimSet}`;

  const pemContents = serviceAccountKey.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\n\r\s]/g, "");

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${header}.${claimSet}.${signatureB64}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error("Failed to obtain access token");
  }
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Validate required fields
    const companyName = sanitize(body.companyName, 200);
    const contactPerson = sanitize(body.contactPerson, 100);
    const email = sanitize(body.email, 255);

    if (!companyName || !contactPerson || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY") || "{}";
    let serviceAccountKey;
    try {
      serviceAccountKey = JSON.parse(rawKey);
    } catch (_e) {
      console.error("Failed to parse service account key");
      throw new Error("Service configuration error");
    }

    if (!serviceAccountKey.client_email) {
      console.error("Service account key missing client_email");
      throw new Error("Service configuration error");
    }

    const accessToken = await getAccessToken(serviceAccountKey);

    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      companyName,
      contactPerson,
      email,
      sanitize(body.industryType, 100),
      sanitize(body.currentWebsite, 500),
      sanitizeArray(body.primaryGoals).join(", ") + (body.primaryGoalOther ? `, ${sanitize(body.primaryGoalOther, 200)}` : ""),
      sanitize(body.mainAction, 200),
      sanitize(body.targetAudience, 200),
      sanitize(body.b2bOrB2c, 50),
      sanitize(body.geographicMarket, 100),
      sanitizeArray(body.pagesNeeded).join(", ") + (body.pagesNeededOther ? `, ${sanitize(body.pagesNeededOther, 200)}` : ""),
      sanitize(body.logoFinal, 50),
      sanitizeArray(body.imageryPreferences).join(", "),
      sanitize(body.websitesYouLike, 500),
      sanitize(body.competitorWebsites, 500),
      sanitize(body.launchDate, 50),
      sanitize(body.budgetRange, 50),
      sanitize(body.decisionMaker, 50),
      sanitize(body.anythingElse, 1000),
    ];

    const range = encodeURIComponent(`${SHEET_NAME}!A1`);
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const sheetsRes = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [row],
      }),
    });

    if (!sheetsRes.ok) {
      const sheetsData = await sheetsRes.json();
      console.error("Sheets API error:", JSON.stringify(sheetsData));
      throw new Error("Failed to save submission");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
