import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { buildMockCarrier, normalizeValue, persistLookup } from "./helpers";

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawValue = (body.value || body.query || "") as string;

    const digits = normalizeValue(rawValue);
    if (!digits) {
      return NextResponse.json({ error: "Please enter a DOT or MC number" }, { status: 400 });
    }

    const result = buildMockCarrier(digits);

    await persistLookup({
      userId: session.user.id,
      email: session.user.email || "user@tenderguard",
      rawValue,
      normalized: digits,
      result,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Lookup error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
