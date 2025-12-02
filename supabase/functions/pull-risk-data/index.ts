import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async () => {
  try {
    const { data: corridors, error } = await supabase.from("corridors").select("*");
    if (error) throw error;

    for (const corridor of corridors || []) {
      const weatherRisk = Math.floor(Math.random() * 60);
      const closureRisk = Math.floor(Math.random() * 40);
      const congestionRisk = Math.floor(Math.random() * 70);
      const healthIndex = Math.max(0, 100 - Math.round((weatherRisk + closureRisk + congestionRisk) / 3));

      const infraNotes = OPENAI_API_KEY
        ? await buildNarrative({ corridor: corridor.name, weatherRisk, closureRisk, congestionRisk })
        : `Weather ${weatherRisk}, closure ${closureRisk}, congestion ${congestionRisk}.`;

      await supabase.from("corridor_risk_snapshots").insert({
        corridor_id: corridor.id,
        health_index: healthIndex,
        weather_risk: weatherRisk,
        closure_risk: closureRisk,
        congestion_risk: congestionRisk,
        infra_notes: infraNotes,
        raw_source_payload: { sample: true },
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: `${err}` }), { status: 500 });
  }
});

async function buildNarrative({
  corridor,
  weatherRisk,
  closureRisk,
  congestionRisk,
}: {
  corridor: string;
  weatherRisk: number;
  closureRisk: number;
  congestionRisk: number;
}) {
  try {
    const prompt = `You are InfraPulse, summarizing corridor health. Corridor ${corridor} shows weather risk ${weatherRisk}, closure risk ${closureRisk}, congestion risk ${congestionRisk}. Provide a 2-sentence operational note without pricing guidance.`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "Automated corridor summary.";
  } catch (e) {
    console.error("AI summary failed", e);
    return "Automated corridor summary.";
  }
}
