// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async () => {
  try {
    const { data: watched, error } = await supabase
      .from("watched_corridors")
      .select("*, corridor:corridors(*), user:profiles(*)");
    if (error) throw error;

    for (const row of watched || []) {
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

      // TODO: integrate email + SMS providers from env config
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: `${err}` }), { status: 500 });
  }
});
