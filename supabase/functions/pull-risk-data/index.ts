// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Supabase disallows custom env vars that start with SUPABASE_ inside Edge Functions.
// Use EDGE_SUPABASE_URL / EDGE_SUPABASE_SERVICE_ROLE_KEY (with a backward-compatible
// fallback for local dev where SUPABASE_* might still be set).
const SUPABASE_URL =
  Deno.env.get("EDGE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("EDGE_SUPABASE_SERVICE_ROLE_KEY") ||
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GROK_API_KEY = Deno.env.get("GROK_API_KEY");
const WEATHER_API_KEY = Deno.env.get("WEATHER_API_KEY");
const TRAFFIC_API_KEY = Deno.env.get("TRAFFIC_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async () => {
  try {
    const { data: corridors, error } = await supabase.from("corridors").select("*");
    if (error) throw error;

    for (const corridor of corridors || []) {
      const weatherData = WEATHER_API_KEY
        ? await fetchWeatherSignal({ corridor, apiKey: WEATHER_API_KEY })
        : null;
      const trafficData = TRAFFIC_API_KEY
        ? await fetchTrafficSignal({ corridor, apiKey: TRAFFIC_API_KEY })
        : null;
      const signals = buildSignalSnapshot(corridor, weatherData, trafficData);
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

function buildSignalSnapshot(
  corridor: { id: string; code?: string; region?: string; name: string },
  weatherSignal: null | { risk: number; source: any },
  trafficSignal: null | { congestionRisk: number; incidentRisk: number; source: any },
) {
  const now = new Date();
  const seed = corridorSeed(corridor.code || corridor.id);
  const regionBias = regionFactors[corridor.region?.toLowerCase() || "default"];

  const weather_risk = weatherSignal
    ? normalizeRisk(weatherSignal.risk)
    : normalizeRisk(seed * 3 + now.getUTCMonth() * 7 + regionBias.weatherBias);
  const closure_risk = trafficSignal
    ? normalizeRisk(trafficSignal.incidentRisk)
    : normalizeRisk(seed * 5 + now.getUTCHours() * 2 + regionBias.closureBias);
  const congestion_risk = trafficSignal
    ? normalizeRisk(trafficSignal.congestionRisk)
    : normalizeRisk(seed * 7 + now.getUTCDay() * 11 + regionBias.congestionBias);
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
        weather_api: weatherSignal?.source,
        traffic_api: trafficSignal?.source,
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

async function fetchWeatherSignal({
  corridor,
  apiKey,
}: {
  corridor: { name: string; region?: string };
  apiKey: string;
}) {
  try {
    const query = corridor.region || corridor.name || "United States";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`weather api ${res.status}`);
    const data = await res.json();
    const current = data?.current;
    if (!current) throw new Error("missing current weather");

    const wind = Number(current.wind_kph ?? 0);
    const precip = Number(current.precip_mm ?? 0);
    const visibility = Number(current.vis_km ?? 0);
    const conditionText = (current.condition?.text || "").toLowerCase();

    // Simple heuristic: stronger wind/precip and lower visibility raise risk.
    const windFactor = Math.min(40, Math.max(0, wind * 0.8));
    const precipFactor = Math.min(30, precip * 3);
    const visibilityPenalty = visibility < 5 ? (5 - visibility) * 6 : 0;
    const stormPenalty = /storm|snow|ice|freez|hail|blizzard|thunder/.test(conditionText) ? 20 : 0;

    const risk = Math.min(95, Math.max(5, Math.round(windFactor + precipFactor + visibilityPenalty + stormPenalty)));

    return { risk, source: { query, current } };
  } catch (err) {
    console.error("weather fetch failed", err);
    return null;
  }
}

async function fetchTrafficSignal({
  corridor,
  apiKey,
}: {
  corridor: { name: string; code?: string; region?: string };
  apiKey: string;
}) {
  try {
    const query = corridor.code || corridor.name || "United States";
    const url = `https://api.api-ninjas.com/v1/traffic?city=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "X-Api-Key": apiKey },
    });
    if (!res.ok) throw new Error(`traffic api ${res.status}`);
    const data = await res.json();

    const payload = Array.isArray(data) ? data[0] ?? data : data;
    const incidents = Array.isArray(payload?.incidents) ? payload.incidents.length : 0;
    const congestionIndex = Number(payload?.congestion_index ?? 55);
    const flowSpeed = Number(payload?.flow_speed ?? payload?.speed ?? 60);

    const congestionRisk = Math.min(
      95,
      Math.max(5, Math.round(congestionIndex * 1.1 + incidents * 2)),
    );
    const incidentRisk = Math.min(
      95,
      Math.max(5, Math.round(incidents * 8 + Math.max(0, 100 - flowSpeed) * 0.6)),
    );

    return {
      congestionRisk,
      incidentRisk,
      source: { query, payload },
    };
  } catch (err) {
    console.error("traffic fetch failed", err);
    return null;
  }
}
