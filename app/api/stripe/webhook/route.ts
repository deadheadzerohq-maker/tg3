import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

async function upsertSubscriber(payload: {
  userId?: string | null;
  email?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  status?: string | null;
  currentPeriodEnd?: number | null;
}) {
  if (!payload.userId || !payload.email) return;
  await supabaseAdmin.from("subscribers").upsert({
    user_id: payload.userId,
    email: payload.email,
    stripe_customer_id: payload.customerId || undefined,
    stripe_subscription_id: payload.subscriptionId || undefined,
    status: payload.status || "active",
    current_period_end: payload.currentPeriodEnd
      ? new Date(payload.currentPeriodEnd * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  const stripe = getStripeClient();
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature || "", secret);
  } catch (err: any) {
    console.error("Webhook signature error", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        await upsertSubscriber({
          userId: session.metadata?.user_id,
          email: session.customer_details?.email || session.metadata?.email,
          customerId: session.customer as string,
          subscriptionId: session.subscription as string,
          status: session.status,
          currentPeriodEnd: session.expires_at,
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.created": {
        const subscription = event.data.object as any;
        await upsertSubscriber({
          userId: subscription.metadata?.user_id,
          email: subscription.metadata?.email,
          customerId: subscription.customer as string,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        });
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        await upsertSubscriber({
          userId: invoice.metadata?.user_id,
          email: invoice.customer_email,
          customerId: invoice.customer as string,
          subscriptionId: invoice.subscription as string,
          status: "active",
          currentPeriodEnd: invoice.lines?.data?.[0]?.period?.end || null,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handling error", err);
    return NextResponse.json({ received: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
