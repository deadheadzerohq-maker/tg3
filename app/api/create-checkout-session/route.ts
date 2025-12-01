import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_STRIPE_PRICE_ID" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const stripe = getStripeClient();

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: session.user.email,
    success_url: `${siteUrl}/app?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/app/upgrade`,
    metadata: {
      user_id: session.user.id,
      email: session.user.email,
    },
  });

  return NextResponse.json({ url: checkout.url });
}
