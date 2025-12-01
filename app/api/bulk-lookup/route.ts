import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type LookupResult = {
  carrierName: string | null;
  mcNumber: string | null;
  dotNumber: string | null;
  authorityStatus: string;
  insuranceStatus: string;
  riskScore: number;
  riskLevel: string;
  error?: string;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

async function lookupOne(value: string): Promise<LookupResult> {
  try {
    const res = await fetch(`${siteUrl}/api/lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    const json = await res.json();

    if (!res.ok || (json as any).error) {
      return {
        carrierName: null,
        mcNumber: null,
        dotNumber: null,
        authorityStatus: "Unknown",
        insuranceStatus: "Unknown",
        riskScore: 0,
        riskLevel: "error",
        error: (json as any).error || "Lookup failed",
      };
    }

    return json as LookupResult;
  } catch (e: any) {
    return {
      carrierName: null,
      mcNumber: null,
      dotNumber: null,
      authorityStatus: "Unknown",
      insuranceStatus: "Unknown",
      riskScore: 0,
      riskLevel: "error",
      error: e.message || "Lookup error",
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { values, email } = body as { values?: string[]; email?: string };

    if (!values || !Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ error: "values[] is required" }, { status: 400 });
    }

    const trimmed = values
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
      .slice(0, 100);

    const results: LookupResult[] = [];
    for (const v of trimmed) {
      const r = await lookupOne(v);
      results.push(r);

      if (email) {
        await supabaseAdmin.from("lookups").insert({
          email,
          input_value: v,
          normalized_value: v.replace(/[^0-9]/g, ""),
          carrier_name: r.carrierName,
          dot_number: r.dotNumber,
          mc_number: r.mcNumber,
          authority_status: r.authorityStatus,
          insurance_status: r.insuranceStatus,
          risk_score: r.riskScore,
          risk_level: r.riskLevel,
          raw: r as any,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Bulk lookup failed" }, { status: 500 });
  }
}
