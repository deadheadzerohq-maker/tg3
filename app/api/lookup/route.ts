// app/api/lookup/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const FMCSA_BASE = "https://mobile.fmcsa.dot.gov/qc/services";

type CarrierRaw = {
  carrierName: string | null;
  mcNumber: string | null;
  dotNumber: string | null;
  authorityStatus: string | null;
  insuranceStatus: string | null;
  outOfService: boolean | null;
  raw: any;
};

function normalizeQuery(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  const isMc = /mc/i.test(trimmed);
  return { trimmed, digits, isMc };
}

function evaluateRisk(carrier: CarrierRaw) {
  let score = 80;
  let level: "low" | "medium" | "high" = "low";

  if (carrier.outOfService) {
    score = 15;
    level = "high";
  } else if (
    carrier.authorityStatus &&
    carrier.authorityStatus.toUpperCase() !== "ACTIVE"
  ) {
    score = 30;
    level = "high";
  } else if (
    carrier.insuranceStatus &&
    carrier.insuranceStatus.toUpperCase() !== "ACTIVE"
  ) {
    score = 40;
    level = "medium";
  }

  return { score, level };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawValue = (body.value ?? body.query ?? "") as string;
    const email = (body.email ?? null) as string | null;

    if (!rawValue || !rawValue.trim()) {
      return NextResponse.json(
        { error: "Missing DOT or MC number" },
        { status: 400 }
      );
    }

    const webKey = process.env.FMCSA_WEBKEY;
    if (!webKey) {
      console.error("FMCSA_WEBKEY is not set in env vars");
      return NextResponse.json(
        { error: "FMCSA API key not configured" },
        { status: 500 }
      );
    }

    const { digits, isMc } = normalizeQuery(rawValue);
    if (!digits) {
      return NextResponse.json(
        { error: "Please enter a valid DOT or MC number" },
        { status: 400 }
      );
    }

    const endpoint = isMc
      ? `${FMCSA_BASE}/carriers/docket-number/${digits}?webKey=${encodeURIComponent(
          webKey
        )}`
      : `${FMCSA_BASE}/carriers/${digits}?webKey=${encodeURIComponent(webKey)}`;

    const res = await fetch(endpoint, { next: { revalidate: 0 } });

    if (!res.ok) {
      const text = await res.text();
      console.error("FMCSA error", res.status, text);
      return NextResponse.json(
        {
          error: `FMCSA responded with status ${res.status}. Try another number.`,
        },
        { status: 502 }
      );
    }

    const data = await res.json();

    const content = (data as any).content ?? {};
    const carrierRaw =
      Array.isArray(content.carriers) && content.carriers.length > 0
        ? content.carriers[0]
        : content.carrier ?? null;

    if (!carrierRaw) {
      return NextResponse.json(
        { error: "No carrier found for that number" },
        { status: 404 }
      );
    }

    const simplified: CarrierRaw = {
      carrierName:
        carrierRaw.legalName ??
        carrierRaw.dbaName ??
        carrierRaw.carrierName ??
        null,
      mcNumber: carrierRaw.mcNumber ?? carrierRaw.docketNumber ?? null,
      dotNumber: carrierRaw.dotNumber ?? carrierRaw.usdotNumber ?? null,
      authorityStatus:
        carrierRaw.operateStatus ??
        carrierRaw.operationStatus ??
        carrierRaw.authorityStatus ??
        null,
      insuranceStatus: carrierRaw.insuranceStatus ?? null,
      outOfService:
        carrierRaw.oosFlag === "Y" ||
        carrierRaw.allowToOperate === "N" ||
        carrierRaw.operateStatus === "OUT_OF_SERVICE",
      raw: carrierRaw,
    };

    const risk = evaluateRisk(simplified);

    if (email) {
      const admin = getSupabaseAdmin();
      if (!admin) {
        console.warn("Supabase admin client not configured; skipping lookup log");
      } else {
        try {
          const { error: insertError } = await admin
            .from("lookups")
            .insert({
              email,
              input_value: rawValue,
              normalized_value: digits,
              dot_number: simplified.dotNumber,
              mc_number: simplified.mcNumber,
              carrier_name: simplified.carrierName,
              authority_status: simplified.authorityStatus,
              insurance_status: simplified.insuranceStatus,
              risk_score: risk.score,
              risk_level: risk.level,
              raw: data,
            });

          if (insertError) {
            console.error("Supabase lookups insert error:", insertError);
          }
        } catch (e) {
          console.error("Unexpected Supabase error inserting lookup:", e);
        }
      }
    }

    const responsePayload = {
      carrierName: simplified.carrierName,
      mcNumber: simplified.mcNumber,
      dotNumber: simplified.dotNumber,
      authorityStatus: simplified.authorityStatus ?? "Unknown",
      insuranceStatus: simplified.insuranceStatus ?? "Unknown",
      riskScore: risk.score,
      riskLevel: risk.level,
      details: simplified.raw,
    };

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("Lookup route error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
