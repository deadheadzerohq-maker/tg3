// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ALERT_FROM_EMAIL = Deno.env.get("ALERT_FROM_EMAIL");
const ALERT_REPLY_TO = Deno.env.get("ALERT_REPLY_TO") || ALERT_FROM_EMAIL;
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
const ALERT_SMS_TO = Deno.env.get("ALERT_SMS_TO");

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

      const message = `Corridor ${row.corridor.name} health dropped from ${previous?.health_index ?? "N/A"} to ${latest.health_index}. Threshold: ${row.high_risk_threshold}.`;

      await supabase.from("alerts").insert({
        user_id: row.user_id,
        corridor_id: row.corridor_id,
        snapshot_id: latest.id,
        snapshot_time: latest.snapshot_time,
        previous_health: previous?.health_index ?? null,
        new_health: latest.health_index,
        message,
        delivered_via: ["email"],
      });

      await Promise.all([
        sendEmail({
          to: userEmail,
          subject: "DHZ Corridor Alert",
          body: message,
        }),
        sendSms({ body: message }),
      ]);
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: `${err}` }), { status: 500 });
  }
});

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
  if (!RESEND_API_KEY || !ALERT_FROM_EMAIL || !to) return;

  await fetch("https://api.resend.com/emails", {
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
}

async function sendSms({ body }: { body: string }) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !ALERT_SMS_TO) return;

  const params = new URLSearchParams();
  params.append("To", ALERT_SMS_TO);
  params.append("From", TWILIO_FROM_NUMBER);
  params.append("Body", body);

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
}
