// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GROK_API_KEY = Deno.env.get("GROK_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async () => {
  try {
    const { data: corridors, error } = await supabase.from("corridors").select("*");
    if (error) throw error;

    for (const corridor of corridors || []) {
      const signals = buildSignalSnapshot(corridor);
      const infraNotes = GROK_API_KEY
        ? await buildNarrative({
            corridor: corridor.name,
            weatherRisk: signals.weather_risk,
            closureRisk: signals.closure_risk,
            congestionRisk: signals.congestion_risk,
          })
        : `Weather ${signals.weather_risk}, closure ${signals.closure_risk}, congestion ${signals.congestion_risk}.`;

      await supabase.from("corridor_risk_snapshots").insert({
        corridor_id: corridor.id,
        health_index: signals.health_index,
        weather_risk: signals.weather_risk,
        closure_risk: signals.closure_risk,
        congestion_risk: signals.congestion_risk,
        infra_notes: infraNotes,
        raw_source_payload: signals.raw,
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: `${err}` }), { status: 500 });
  }
});

function buildSignalSnapshot(corridor: { id: string; code?: string; region?: string; name: string }) {
  const now = new Date();
  const seed = corridorSeed(corridor.code || corridor.id);
  const regionBias = regionFactors[corridor.region?.toLowerCase() || "default"];

  const weather_risk = normalizeRisk(seed * 3 + now.getUTCMonth() * 7 + regionBias.weatherBias);
  const closure_risk = normalizeRisk(seed * 5 + now.getUTCHours() * 2 + regionBias.closureBias);
  const congestion_risk = normalizeRisk(seed * 7 + now.getUTCDay() * 11 + regionBias.congestionBias);
  const health_index = Math.max(0, 100 - Math.round((weather_risk + closure_risk + congestion_risk) / 3));

  return {
    weather_risk,
    closure_risk,
    congestion_risk,
    health_index,
    raw: {
      timestamp: now.toISOString(),
      corridor_code: corridor.code,
      corridor_region: corridor.region,
      signals: {
        weather_risk,
        closure_risk,
        congestion_risk,
        region_bias: regionBias,
      },
      model: "deterministic-simulation:v1",
      confidence: 0.72,
    },
  };
}

function corridorSeed(input: string) {
  let hash = 0;
  for (const ch of input) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 9973;
  }
  return hash;
}

function normalizeRisk(value: number) {
  return Math.min(95, Math.max(5, value % 100));
}

const regionFactors: Record<string, { weatherBias: number; closureBias: number; congestionBias: number }> = {
  mountain: { weatherBias: 22, closureBias: 18, congestionBias: 6 },
  southwest: { weatherBias: 12, closureBias: 10, congestionBias: 14 },
  midwest: { weatherBias: 16, closureBias: 14, congestionBias: 18 },
  west: { weatherBias: 10, closureBias: 8, congestionBias: 16 },
  south: { weatherBias: 14, closureBias: 10, congestionBias: 20 },
  default: { weatherBias: 10, closureBias: 10, congestionBias: 10 },
};

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
    const prompt = `You are Deadhead Zero, summarizing corridor health. Corridor ${corridor} shows weather risk ${weatherRisk}, closure risk ${closureRisk}, congestion risk ${congestionRisk}. Provide a 2-sentence operational note without pricing guidance.`;
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
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
