import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(secretKey, {
    apiVersion: "2024-06-20"
  });
}

export async function POST(req: Request) {
  try {
    const { priceId, customerEmail } = (await req.json()) as {
      priceId?: string;
      customerEmail?: string;
    };

    const price = priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!price) {
      return NextResponse.json({ error: "Missing price ID" }, { status: 400 });
    }

    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      customer_email: customerEmail
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
