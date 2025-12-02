// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Supabase Edge Functions cannot use custom env vars that start with SUPABASE_,
// so we default to EDGE_SUPABASE_* and fall back to SUPABASE_* for local dev.
const SUPABASE_URL =
  Deno.env.get("EDGE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("EDGE_SUPABASE_SERVICE_ROLE_KEY") ||
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ALERT_EMAIL_ENABLED = Deno.env.get("ALERT_EMAIL_ENABLED") !== "false";
const ALERT_FROM_EMAIL =
  Deno.env.get("ALERT_FROM_EMAIL") || "info@deadheadzero.com";
const ALERT_REPLY_TO = Deno.env.get("ALERT_REPLY_TO") || ALERT_FROM_EMAIL;
const ALERT_SUBJECT_PREFIX = "DHZ Corridor Alert";
const MAX_EMAIL_RETRIES = 3;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async () => {
  try {
    const { data: watched, error } = await supabase
      .from("watched_corridors")
      .select("*, corridor:corridors(*), user:profiles(*)");
    if (error) throw error;

    for (const row of watched || []) {
      const userEmail = await lookupUserEmail(row.user_id);
      const { data: snapshots } = await supabase
        .from("corridor_risk_snapshots")
        .select("*")
        .eq("corridor_id", row.corridor_id)
        .order("snapshot_time", { ascending: false })
        .limit(2);

      if (!snapshots || snapshots.length === 0) continue;
      const [latest, previous] = snapshots;
      if (latest.health_index >= row.high_risk_threshold) continue;

      const { subject, body } = buildEmailTemplate({
        corridorName: row.corridor.name,
        previousHealth: previous?.health_index ?? null,
        newHealth: latest.health_index,
        threshold: row.high_risk_threshold,
        snapshotTime: latest.snapshot_time,
        emailEnabled: ALERT_EMAIL_ENABLED,
      });

      let deliveredVia: string[] = [];

      if (ALERT_EMAIL_ENABLED) {
        const emailDelivered = await sendEmail({
          to: userEmail,
          subject,
          body,
        });
        if (emailDelivered) {
          deliveredVia = ["email"];
        }
      }

      await supabase.from("alerts").insert({
        user_id: row.user_id,
        corridor_id: row.corridor_id,
        snapshot_id: latest.id,
        snapshot_time: latest.snapshot_time,
        previous_health: previous?.health_index ?? null,
        new_health: latest.health_index,
        message: body,
        delivered_via: deliveredVia,
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: `${err}` }), { status: 500 });
  }
});

function buildEmailTemplate({
  corridorName,
  previousHealth,
  newHealth,
  threshold,
  snapshotTime,
  emailEnabled,
}: {
  corridorName: string;
  previousHealth: number | null;
  newHealth: number;
  threshold: number;
  snapshotTime: string;
  emailEnabled: boolean;
}) {
  const subject = `${ALERT_SUBJECT_PREFIX}: ${corridorName} at ${newHealth}`;
  const delta =
    previousHealth !== null ? newHealth - previousHealth : undefined;
  const changeLine =
    delta !== undefined
      ? `Change vs. previous: ${delta > 0 ? "+" : ""}${delta}`
      : "Previous value unavailable";

  const deliveryLine = emailEnabled
    ? "You are receiving this because you watch this corridor."
    : "Watch status is stored in your dashboard; view alerts in-app.";

  const body = `Deadhead Zero corridor alert\n\n` +
    `Corridor: ${corridorName}\n` +
    `Observed: ${snapshotTime}\n` +
    `Health: ${newHealth} (threshold ${threshold})\n` +
    `${changeLine}\n\n` +
    `${deliveryLine}`;

  return { subject, body };
}

async function lookupUserEmail(userId: string) {
  try {
    const { data } = await supabase.auth.admin.getUserById(userId);
    return data?.user?.email ?? undefined;
  } catch (e) {
    console.error("Failed to load user email", e);
    return undefined;
  }
}

async function sendEmail({ to, subject, body }: { to?: string; subject: string; body: string }) {
  if (!ALERT_EMAIL_ENABLED) {
    return false;
  }

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured; skipping email delivery");
    return false;
  }

  if (!to) {
    console.warn("No recipient email found for alert");
    return false;
  }

  for (let attempt = 1; attempt <= MAX_EMAIL_RETRIES; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: ALERT_FROM_EMAIL,
          to: [to],
          reply_to: ALERT_REPLY_TO,
          subject,
          text: body,
        }),
      });

      if (res.ok) return true;

      console.warn("Email send failed", { attempt, status: res.status });
    } catch (err) {
      console.error("Email send error", { attempt, err });
    }
    await delay(250 * attempt);
  }

  return false;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
