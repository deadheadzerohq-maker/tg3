import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Missing server Supabase client" }, { status: 500 });
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "No customer on file" }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000/dashboard",
  });

  return NextResponse.json({ url: session.url });
}
