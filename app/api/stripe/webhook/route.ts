// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

// Use a stable API version – Stripe will still send your dashboard version in events
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

async function upsertSubscriberFromSubscription(opts: {
  email: string | null;
  customerId: string | null;
  subscriptionId: string | null;
}) {
  const { email, customerId, subscriptionId } = opts;
  if (!email || !customerId || !subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const status = subscription.status;
  const currentPeriodEnd =
    subscription.current_period_end != null
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;

  const { error } = await supabaseAdmin
    .from("subscribers")
    .upsert(
      {
        email,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status,
        current_period_end: currentPeriodEnd,
      },
      {
        onConflict: "email",
      }
    );

  if (error) {
    console.error("Error upserting subscriber:", error);
  }
}

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          (session.customer_details?.email as string | null) ??
          (session.customer_email as string | null) ??
          null;

        const customerId = (session.customer as string) ?? null;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;

        await upsertSubscriberFromSubscription({
          email,
          customerId,
          subscriptionId,
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // We need email; best effort: look up the customer
        const customer = await stripe.customers.retrieve(customerId);
        const email =
          (customer as Stripe.Customer).email ??
          (customer as any).email ??
          null;

        await upsertSubscriberFromSubscription({
          email,
          customerId,
          subscriptionId: subscription.id,
        });
        break;
      }

      default:
        // For now we ignore other event types
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Error handling Stripe webhook event:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
