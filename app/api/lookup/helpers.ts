import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type LookupResponse = {
  carrierName: string;
  dotNumber: string;
  mcNumber: string;
  authorityStatus: string;
  insuranceStatus: string;
  riskScore: number;
  riskLevel: string;
};

export function normalizeValue(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  return digits;
}

export function computeRisk(authorityStatus: string, insuranceStatus: string) {
  let level: "low" | "medium" | "high" = "low";
  let base = 82;

  if (authorityStatus.toLowerCase() !== "active") {
    level = "high";
    base = 25;
  } else if (insuranceStatus.toLowerCase() !== "active") {
    level = "medium";
    base = 55;
  }

  return { level, score: base };
}

export async function persistLookup({
  userId,
  email,
  rawValue,
  normalized,
  result,
  status,
}: {
  userId: string;
  email: string;
  rawValue: string;
  normalized: string;
  result?: LookupResponse;
  status?: string;
}) {
  await supabaseAdmin.from("lookups").insert({
    user_id: userId,
    email,
    input_value: rawValue,
    normalized_value: normalized,
    carrier_name: result?.carrierName,
    dot_number: result?.dotNumber,
    mc_number: result?.mcNumber,
    authority_status: result?.authorityStatus,
    insurance_status: result?.insuranceStatus,
    risk_score: result?.riskScore ?? null,
    risk_level: status || result?.riskLevel || "error",
    raw: result || null,
  });
}

export function buildMockCarrier(digits: string): LookupResponse {
  const padded = digits.padStart(6, "0");
  const carrierName = `TenderGuard Carrier ${padded.slice(-4)}`;
  const dotNumber = padded;
  const mcNumber = digits.slice(-6).padStart(6, "0");
  const authorityStatus = digits.endsWith("0") ? "Inactive" : "Active";
  const insuranceStatus = digits.endsWith("9") ? "Lapsed" : "Active";
  const risk = computeRisk(authorityStatus, insuranceStatus);

  return {
    carrierName,
    dotNumber,
    mcNumber,
    authorityStatus,
    insuranceStatus,
    riskScore: risk.score,
    riskLevel: risk.level,
  };
}
