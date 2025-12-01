import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const runtime = "nodejs";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(secretKey, { apiVersion: "2024-06-20" });
}

async function readRawBody(req: Request): Promise<Buffer> {
  const ab = await req.arrayBuffer();
  return Buffer.from(ab);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

  const stripe = getStripeClient();
  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId = session.customer as string | null;
        const subscriptionId = session.subscription as string | null;
        const email = session.customer_details?.email || (session.customer_email as string | null);

        if (!customerId || !subscriptionId || !email) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        await supabaseAdmin.from("subscribers").upsert(
          {
            email,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString()
          },
          { onConflict: "stripe_customer_id" }
        );

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from("subscribers")
          .update({
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString()
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
