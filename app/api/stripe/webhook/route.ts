import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";

const endpointSecret = serverEnv.stripeWebhookSecret;

const supabase = createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  await supabase.from("stripe_events").insert({
    id: event.id,
    type: event.type,
    data: event.data as any,
  });

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as any;

    if (!sub.customer || !sub.id || !sub.items?.data?.[0]?.price?.id) {
      return new NextResponse("Missing subscription details", { status: 400 });
    }

    await supabase.from("subscriptions").upsert({
      user_id: sub.metadata?.user_id || null,
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id as string,
      price_id: sub.items.data[0].price.id,
      status: sub.status,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
    });
  }

  return new NextResponse("OK", { status: 200 });
}
