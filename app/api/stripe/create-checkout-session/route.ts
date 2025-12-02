import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/auth";

export async function POST() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_STRIPE_PRICE_ID" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
