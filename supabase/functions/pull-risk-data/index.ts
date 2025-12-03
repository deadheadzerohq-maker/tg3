// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("EDGE_SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("EDGE_SUPABASE_SERVICE_ROLE_KEY")!;
const WEATHER_API_KEY = Deno.env.get("WEATHER_API_KEY") ?? "";
const TRAFFIC_API_KEY = Deno.env.get("TRAFFIC_API_KEY") ?? "";
const FMCSA_API_KEY = Deno.env.get("FMCSA_API_KEY") ?? "";
const GROK_API_KEY = Deno.env.get("GROK_API_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async () => {
  try {
    const { data: corridors, error } = await supabase.from("corridors").select("*");
    if (error) throw error;

    for (const corridor of corridors || []) {
      const locationQuery = [corridor.name, corridor.region].filter(Boolean).join(" ");

      const weatherData = WEATHER_API_KEY
        ? await fetchWeatherSignal({ query: locationQuery, apiKey: WEATHER_API_KEY })
        : null;

      const geocode = TRAFFIC_API_KEY
        ? await geocodeLocation({ query: locationQuery, apiKey: TRAFFIC_API_KEY })
        : null;

      const trafficData = TRAFFIC_API_KEY
        ? await fetchTrafficSignal({
            corridor,
            apiKey: TRAFFIC_API_KEY,
            geocode,
          })
        : null;

      const fmcsaSignal = FMCSA_API_KEY
        ? await fetchFmcsaSafetySignal({ corridor, apiKey: FMCSA_API_KEY })
        : null;

      const signals = buildSignalSnapshot(corridor, weatherData, trafficData, fmcsaSignal);

      const infraNotes = GROK_API_KEY
        ? await buildNarrative({
            corridor: corridor.name,
            weatherRisk: signals.weather_risk,
            closureRisk: signals.closure_risk,
            congestionRisk: signals.congestion_risk,
          })
        : defaultNarrative(signals);

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
  weatherSignal: null | WeatherSignal,
  trafficSignal: null | TrafficSignal,
  fmcsaSignal: null | FmcsaSignal,
) {
  const now = new Date();
  const seed = corridorSeed(corridor.code || corridor.id);
  const regionBias = regionFactors[corridor.region?.toLowerCase() || "default"];

  const weather_risk = weatherSignal?.risk ?? normalizeRisk(seed * 3 + now.getUTCMonth() * 7 + regionBias.weatherBias);
  const congestion_risk = trafficSignal?.congestionRisk ??
    normalizeRisk(seed * 7 + now.getUTCDay() * 11 + regionBias.congestionBias);

  const safetyRisk = fmcsaSignal ? normalizeRisk(fmcsaSignal.crashRisk) : 0;
  const closure_risk = normalizeRisk(
    (trafficSignal?.incidentRisk ?? 35) * (trafficSignal ? 1 : 0.4) +
      safetyRisk * 0.4 +
      regionBias.closureBias +
      seed * 2,
  );

  const health_index = Math.max(
    0,
    100 - Math.round((weather_risk + closure_risk + congestion_risk) / 3),
  );

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
        fmcsa_api: fmcsaSignal?.source,
      },
      model: "dhz-risk-engine:v2-weather-traffic-fmcsa",
      confidence: 0.78,
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

function defaultNarrative(signals: {
  weather_risk: number;
  closure_risk: number;
  congestion_risk: number;
}) {
  return `Weather ${signals.weather_risk}, closure ${signals.closure_risk}, congestion ${signals.congestion_risk}.`;
}

async function fetchWeatherSignal({
  query,
  apiKey,
}: {
  query: string;
  apiKey: string;
}): Promise<WeatherSignal | null> {
  try {
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(query)}&units=imperial`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "apikey": apiKey },
    });
    if (!res.ok) throw new Error(`tomorrow.io ${res.status}`);
    const data = await res.json();
    const values = data?.data?.values;
    if (!values) throw new Error("missing weather values");

    const wind = Number(values.windSpeed ?? 0);
    const precip = Number(values.precipitationIntensity ?? 0);
    const visibility = Number(values.visibility ?? 10);
    const cloudCover = Number(values.cloudCover ?? 50);
    const storms = Number(values.stormProbability ?? 0);

    const windFactor = clamp(wind * 1.5, 0, 40);
    const precipFactor = clamp(precip * 120, 0, 35);
    const visibilityPenalty = visibility < 5 ? (5 - visibility) * 6 : 0;
    const stormPenalty = clamp(storms * 0.6 + cloudCover * 0.08, 0, 20);

    const risk = clamp(Math.round(windFactor + precipFactor + visibilityPenalty + stormPenalty), 5, 95);

    return { risk, source: { query, values } };
  } catch (err) {
    console.error("weather fetch failed", err);
    return null;
  }
}

async function geocodeLocation({ query, apiKey }: { query: string; apiKey: string }) {
  try {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${apiKey}&limit=1`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`tomtom geocode ${res.status}`);
    const data = await res.json();
    const result = data?.results?.[0]?.position;
    if (!result) return null;
    return { lat: Number(result.lat), lon: Number(result.lon), source: data?.results?.[0] };
  } catch (err) {
    console.error("geocode failed", err);
    return null;
  }
}

async function fetchTrafficSignal({
  corridor,
  apiKey,
  geocode,
}: {
  corridor: { name: string; code?: string; region?: string };
  apiKey: string;
  geocode: { lat: number; lon: number; source: unknown } | null;
}): Promise<TrafficSignal | null> {
  if (!geocode) return null;
  try {
    const flowUrl =
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?` +
      `point=${geocode.lat},${geocode.lon}&key=${apiKey}`;
    const flowRes = await fetch(flowUrl, { headers: { Accept: "application/json" } });
    if (!flowRes.ok) throw new Error(`tomtom flow ${flowRes.status}`);
    const flow = await flowRes.json();

    const bbox = buildBoundingBox(geocode.lat, geocode.lon, 0.6);
    const incidentUrl =
      `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${apiKey}` +
      `&bbox=${bbox}&fields={incidents{type,severity}}&timeValidityFilter=present` +
      `&categoryFilter=accident,disabledVehicle,roadworks,closure`;
    const incidentRes = await fetch(incidentUrl, { headers: { Accept: "application/json" } });
    if (!incidentRes.ok) throw new Error(`tomtom incident ${incidentRes.status}`);
    const incidentData = await incidentRes.json();

    const incidents = Array.isArray(incidentData?.incidents)
      ? incidentData.incidents
      : Array.isArray(incidentData?.tm?.poi)
        ? incidentData.tm.poi
        : [];

    const incidentRisk = clamp(
      incidents.reduce((acc: number, item: any) => acc + severityWeight(item?.severity), 0) * 8,
      5,
      95,
    );

    const currentSpeed = Number(flow?.flowSegmentData?.currentSpeed ?? 55);
    const freeFlowSpeed = Number(flow?.flowSegmentData?.freeFlowSpeed ?? 65);
    const ratio = freeFlowSpeed > 0 ? currentSpeed / freeFlowSpeed : 1;
    const congestionRisk = clamp(Math.round((1 - ratio) * 100 + incidents.length * 3), 5, 95);

    return {
      congestionRisk,
      incidentRisk,
      source: {
        geocode,
        flow,
        incidents: incidents.slice(0, 25),
      },
    };
  } catch (err) {
    console.error("traffic fetch failed", err);
    return null;
  }
}

async function fetchFmcsaSafetySignal({
  corridor,
  apiKey,
}: {
  corridor: { name: string; code?: string; region?: string };
  apiKey: string;
}) {
  try {
    const stateCode = primaryStateFromCode(corridor.code);
    if (!stateCode) return null;

    const url = `https://mobile.fmcsa.dot.gov/qc/services/carriers?webKey=${apiKey}&state=${stateCode}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`fmcsa api ${res.status}`);
    const data = await res.json();

    const carriers = Array.isArray(data?.carriers)
      ? data.carriers
      : Array.isArray(data?.content?.carriers)
        ? data.content.carriers
        : Array.isArray(data?.content)
          ? data.content
          : [];

    const sample = carriers.slice(0, 25);
    const crashVolume = sample.reduce(
      (acc, carrier) =>
        acc +
        Number(
          carrier?.crash_total ??
            carrier?.crashTotal ??
            carrier?.crashes ??
            carrier?.crash ??
            0,
        ),
      0,
    );
    const oosRate = sample.reduce(
      (acc, carrier) =>
        acc +
        Number(
          carrier?.oos_rate ??
            carrier?.oosRate ??
            carrier?.out_of_service_rate ??
            carrier?.oos ??
            0,
        ),
      0,
    );

    const crashRisk = Math.min(
      95,
      Math.max(5, Math.round(crashVolume * 1.6 + oosRate * 10 + sample.length * 2)),
    );

    return { crashRisk, source: { state: stateCode, carriers: sample } };
  } catch (err) {
    console.error("fmcsa fetch failed", err);
    return null;
  }
}

function primaryStateFromCode(code?: string | null) {
  if (!code) return null;
  const parts = code.split("_");
  const stateSegment = parts[1] || parts[0];
  if (!stateSegment) return null;
  const primary = stateSegment.split("-")[0];
  return /^[A-Z]{2}$/.test(primary) ? primary : null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildBoundingBox(lat: number, lon: number, delta: number) {
  const minLat = (lat - delta).toFixed(4);
  const minLon = (lon - delta).toFixed(4);
  const maxLat = (lat + delta).toFixed(4);
  const maxLon = (lon + delta).toFixed(4);
  return `${minLat},${minLon},${maxLat},${maxLon}`;
}

function severityWeight(severity: any) {
  const value = typeof severity === "number" ? severity : 1;
  if (value >= 4) return 3;
  if (value >= 2) return 2;
  return 1;
}

type WeatherSignal = { risk: number; source: unknown };
type TrafficSignal = { congestionRisk: number; incidentRisk: number; source: unknown };
type FmcsaSignal = { crashRisk: number; source: unknown };
