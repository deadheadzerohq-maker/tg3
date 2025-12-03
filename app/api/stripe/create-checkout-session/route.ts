import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { publicEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/auth";

export async function POST() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = publicEnv.siteUrl;
  const priceId = publicEnv.stripePriceId;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
