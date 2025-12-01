import { NextResponse } from "next/server";

type CarrierRaw = {
  carrierName: string;
  mcNumber: string | null;
  dotNumber: string | null;
  authorityStatus: string;
  insuranceStatus: string;
  raw: any;
};

async function fetchCarrierData(value: string): Promise<CarrierRaw | null> {
  const normalized = value.replace(/[^0-9]/g, "");
  if (!normalized) return null;

  return {
    carrierName: "Sample Carrier Inc.",
    mcNumber: "123456",
    dotNumber: "789012",
    authorityStatus: "Active",
    insuranceStatus: "Active",
    raw: { example: true, value }
  };
}

function evaluateRisk(carrier: CarrierRaw) {
  let score = 80;
  let level: "low" | "medium" | "high" = "low";

  if (carrier.authorityStatus !== "Active") {
    score = 20;
    level = "high";
  } else if (carrier.insuranceStatus !== "Active") {
    score = 30;
    level = "high";
  }

  return { score, level };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { value } = body as { value?: string };

    if (!value || !value.trim()) {
      return NextResponse.json({ error: "Missing value" }, { status: 400 });
    }

    const carrier = await fetchCarrierData(value);
    if (!carrier) {
      return NextResponse.json({ error: "Carrier not found" }, { status: 404 });
    }

    const risk = evaluateRisk(carrier);

    const responsePayload = {
      carrierName: carrier.carrierName,
      mcNumber: carrier.mcNumber,
      dotNumber: carrier.dotNumber,
      authorityStatus: carrier.authorityStatus,
      insuranceStatus: carrier.insuranceStatus,
      riskScore: risk.score,
      riskLevel: risk.level,
      details: carrier.raw
    };

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
