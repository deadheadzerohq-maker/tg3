const required = (key: string, value: string | undefined) => {
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const publicEnv = {
  supabaseUrl: required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ),
  supabaseAnonKey: required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  stripePriceId: required(
    "NEXT_PUBLIC_STRIPE_PRICE_ID",
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  ),
};

export const serverEnv = {
  supabaseServiceRoleKey: required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ),
  stripeSecretKey: required(
    "STRIPE_SECRET_KEY",
    process.env.STRIPE_SECRET_KEY
  ),
  stripeWebhookSecret: required(
    "STRIPE_WEBHOOK_SECRET",
    process.env.STRIPE_WEBHOOK_SECRET
  ),
  grokApiKey: process.env.GROK_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  alertFromEmail: process.env.ALERT_FROM_EMAIL,
  alertReplyTo: process.env.ALERT_REPLY_TO,
  alertSmsTo: process.env.ALERT_SMS_TO,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER,
};
