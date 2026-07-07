// Ensures a seed admin user exists in auth.users for any email that is
// pre-approved in `admin_allowed_emails`. Idempotent — safe to call on every
// admin sign-in attempt. Uses the service role to create the user with the
// default password so the very first sign-in works without email confirmation.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_PASSWORD = "1234567";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return json({ error: "email required" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Verify email is pre-approved as admin.
    const { data: allowed, error: allowedErr } = await admin.rpc("check_admin_email", { _email: email });
    if (allowedErr) throw allowedErr;
    if (!allowed) return json({ error: "email not approved for admin access" }, 403);

    // 2. Look up existing auth user.
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw listErr;
    let user = list.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());

    // 3. Create if missing.
    if (!user) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { password_changed: false },
      });
      if (createErr) throw createErr;
      user = created.user!;
    }

    // 4. Ensure user_roles row exists.
    if (user) {
      await admin.from("user_roles").upsert(
        { user_id: user.id, role: "admin" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    }

    return json({ ok: true, created: !list.users.some((u) => u.id === user!.id) });
  } catch (err) {
    console.error("bootstrap-admin-user error", err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
