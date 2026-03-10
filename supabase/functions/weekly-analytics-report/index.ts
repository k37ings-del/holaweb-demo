import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Google Analytics Data API v1
const GA_PROPERTY_ID = "properties/483aborrar"; // We'll use the measurement ID to derive this
const GA_DATA_API = "https://analyticsdata.googleapis.com/v1beta";
const MEASUREMENT_ID = "G-GL2KV8849G";

interface GACredentials {
  client_email: string;
  private_key: string;
  token_uri: string;
}

async function getAccessToken(credentials: GACredentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = btoa(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: credentials.token_uri,
      exp: now + 3600,
      iat: now,
    })
  );

  // Import the private key and sign the JWT
  const pemContent = credentials.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");

  const binaryKey = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureInput = new TextEncoder().encode(`${header}.${claim}`);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    signatureInput
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const jwt = `${header}.${claim}.${sig}`;

  const tokenResp = await fetch(credentials.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    throw new Error(`Failed to get access token: ${errText}`);
  }

  const tokenData = await tokenResp.json();
  return tokenData.access_token;
}

async function fetchAnalyticsData(
  propertyId: string,
  accessToken: string
): Promise<any> {
  // Get data for the past 7 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const requestBody = {
    dateRanges: [
      { startDate: formatDate(startDate), endDate: formatDate(endDate) },
    ],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
      { name: "newUsers" },
      { name: "eventCount" },
    ],
    dimensions: [{ name: "date" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  };

  const resp = await fetch(
    `${GA_DATA_API}/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`GA Data API error [${resp.status}]: ${errText}`);
  }

  return resp.json();
}

async function fetchTopPages(
  propertyId: string,
  accessToken: string
): Promise<any> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const resp = await fetch(
    `${GA_DATA_API}/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        dimensions: [{ name: "pagePath" }],
        orderBys: [
          { metric: { metricName: "screenPageViews" }, desc: true },
        ],
        limit: 10,
      }),
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`GA top pages error [${resp.status}]: ${errText}`);
  }

  return resp.json();
}

function buildEmailHtml(
  reportData: any,
  topPagesData: any,
  startDate: string,
  endDate: string
): string {
  // Aggregate totals from daily data
  let totalUsers = 0,
    totalSessions = 0,
    totalPageViews = 0,
    totalNewUsers = 0,
    totalEvents = 0;
  let totalDuration = 0,
    totalBounce = 0,
    dayCount = 0;

  const dailyRows: string[] = [];

  if (reportData.rows) {
    for (const row of reportData.rows) {
      const date = row.dimensionValues[0].value;
      const users = parseInt(row.metricValues[0].value || "0");
      const sessions = parseInt(row.metricValues[1].value || "0");
      const pageViews = parseInt(row.metricValues[2].value || "0");
      const avgDuration = parseFloat(row.metricValues[3].value || "0");
      const bounce = parseFloat(row.metricValues[4].value || "0");
      const newUsers = parseInt(row.metricValues[5].value || "0");
      const events = parseInt(row.metricValues[6].value || "0");

      totalUsers += users;
      totalSessions += sessions;
      totalPageViews += pageViews;
      totalNewUsers += newUsers;
      totalEvents += events;
      totalDuration += avgDuration;
      totalBounce += bounce;
      dayCount++;

      const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
      dailyRows.push(`
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${formattedDate}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${users}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${sessions}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${pageViews}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${Math.round(avgDuration)}s</td>
        </tr>
      `);
    }
  }

  const avgBounce = dayCount > 0 ? (totalBounce / dayCount * 100).toFixed(1) : "0";
  const avgDurationFormatted = dayCount > 0 ? Math.round(totalDuration / dayCount) : 0;

  // Top pages
  const topPageRows: string[] = [];
  if (topPagesData.rows) {
    for (const row of topPagesData.rows) {
      const path = row.dimensionValues[0].value;
      const views = row.metricValues[0].value;
      const users = row.metricValues[1].value;
      topPageRows.push(`
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${path}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${views}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${users}</td>
        </tr>
      `);
    }
  }

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:20px;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#E8153A,#c01030);border-radius:12px;padding:30px;text-align:center;margin-bottom:24px;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;">📊 Holaweb Weekly Analytics</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">${startDate} → ${endDate}</p>
      </div>

      <!-- Summary Cards -->
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#E8153A;">${totalUsers}</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Active Users</div>
        </div>
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#E8153A;">${totalSessions}</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Sessions</div>
        </div>
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#E8153A;">${totalPageViews}</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Page Views</div>
        </div>
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#E8153A;">${totalNewUsers}</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">New Users</div>
        </div>
      </div>

      <!-- More Stats -->
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#333;">${avgDurationFormatted}s</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Avg Session Duration</div>
        </div>
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#333;">${avgBounce}%</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Bounce Rate</div>
        </div>
        <div style="flex:1;min-width:140px;background:#f8f9fa;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:bold;color:#333;">${totalEvents}</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Total Events</div>
        </div>
      </div>

      <!-- Daily Breakdown -->
      <h2 style="font-size:18px;color:#333;margin:24px 0 12px;">📅 Daily Breakdown</h2>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;">
        <thead>
          <tr style="background:#f8f9fa;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;text-transform:uppercase;">Date</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Users</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Sessions</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Views</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Avg Duration</th>
          </tr>
        </thead>
        <tbody>${dailyRows.join("")}</tbody>
      </table>

      <!-- Top Pages -->
      <h2 style="font-size:18px;color:#333;margin:24px 0 12px;">🔥 Top Pages</h2>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;">
        <thead>
          <tr style="background:#f8f9fa;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;text-transform:uppercase;">Page</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Views</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;">Users</th>
          </tr>
        </thead>
        <tbody>${topPageRows.join("")}</tbody>
      </table>

      <!-- Footer -->
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;text-align:center;">
        <p style="font-size:12px;color:#999;">This report is automatically generated every Monday at 8:00 AM EAT.</p>
        <p style="font-size:12px;color:#999;">Holaweb Media Group • <a href="https://holaweb.africa" style="color:#E8153A;">holaweb.africa</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountKeyRaw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountKeyRaw) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not configured");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const credentials: GACredentials = JSON.parse(serviceAccountKeyRaw);

    // Get access token
    const accessToken = await getAccessToken(credentials);

    // We need the GA4 property ID. Let's use the Admin API to find it by measurement ID.
    // First, list account summaries to find the property
    const adminResp = await fetch(
      "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!adminResp.ok) {
      const errText = await adminResp.text();
      throw new Error(`GA Admin API error [${adminResp.status}]: ${errText}`);
    }

    const adminData = await adminResp.json();
    let propertyId: string | null = null;

    // Find property by checking data streams for our measurement ID
    if (adminData.accountSummaries) {
      for (const account of adminData.accountSummaries) {
        if (account.propertySummaries) {
          for (const prop of account.propertySummaries) {
            // Check data streams for this property
            const streamsResp = await fetch(
              `https://analyticsadmin.googleapis.com/v1beta/${prop.property}/dataStreams`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (streamsResp.ok) {
              const streamsData = await streamsResp.json();
              if (streamsData.dataStreams) {
                for (const stream of streamsData.dataStreams) {
                  if (
                    stream.webStreamData?.measurementId === MEASUREMENT_ID
                  ) {
                    propertyId = prop.property;
                    break;
                  }
                }
              }
            } else {
              await streamsResp.text(); // consume body
            }
            if (propertyId) break;
          }
        }
        if (propertyId) break;
      }
    }

    if (!propertyId) {
      throw new Error(
        `Could not find GA4 property for measurement ID ${MEASUREMENT_ID}. Ensure the service account has access to the Google Analytics property.`
      );
    }

    // Fetch analytics data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const [reportData, topPagesData] = await Promise.all([
      fetchAnalyticsData(propertyId, accessToken),
      fetchTopPages(propertyId, accessToken),
    ]);

    const emailHtml = buildEmailHtml(
      reportData,
      topPagesData,
      formatDate(startDate),
      formatDate(endDate)
    );

    // Send via Resend
    const emailResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Holaweb Analytics <analytics@holaweb.africa>",
        to: ["holaweb.africa@gmail.com"],
        subject: `📊 Weekly Analytics Report — ${formatDate(startDate)} to ${formatDate(endDate)}`,
        html: emailHtml,
      }),
    });

    if (!emailResp.ok) {
      const errText = await emailResp.text();
      throw new Error(`Resend API error [${emailResp.status}]: ${errText}`);
    }

    const emailResult = await emailResp.json();
    console.log("Weekly analytics email sent:", emailResult);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Weekly analytics report error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
