import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { buildMockCarrier, normalizeValue, persistLookup } from "../lookup/helpers";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { values } = body as { values?: string[] };
    if (!values || !Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ error: "values[] is required" }, { status: 400 });
    }

    const trimmed = values.map((v) => v.trim()).filter(Boolean).slice(0, 100);
    const results = [] as any[];
    for (const raw of trimmed) {
      const digits = normalizeValue(raw);
      if (!digits) {
        results.push({
          carrierName: null,
          mcNumber: null,
          dotNumber: null,
          authorityStatus: "Unknown",
          insuranceStatus: "Unknown",
          riskScore: 0,
          riskLevel: "error",
          error: "Invalid value",
        });
        continue;
      }
      const result = buildMockCarrier(digits);
      results.push(result);
      await persistLookup({
        userId: session.user.id,
        email: session.user.email || "user@tenderguard",
        rawValue: raw,
        normalized: digits,
        result,
      });
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Bulk lookup failed" }, { status: 500 });
  }
}
