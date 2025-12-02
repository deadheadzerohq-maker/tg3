# Deadhead Zero SaaS

A Next.js 14 + Supabase + Stripe platform that models U.S. freight corridors as a live health index, predicts disruptions, and delivers alerts + AI reports. Technology platform only — not a freight broker or money transmitter.

## Stack
- Next.js 14 App Router, TypeScript, Tailwind
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Stripe Checkout + Billing Portal
- Grok (xAI) for corridor narratives
- Resend (email) and optional Twilio SMS for alerts

## Structure
- `app/` marketing, auth, and dashboard routes
- `app/api/stripe/*` subscription endpoints
- `lib/` Supabase + Stripe helpers
- `supabase/functions/` edge functions for risk ingestion + alert evaluation
- `supabase/migrations/` schema for corridors, risk snapshots, alerts, subscriptions

## Getting started
1. Copy `.env.example` to `.env.local` and fill Supabase + Stripe keys (plus Grok/Resend/Twilio if used).
2. Install deps: `npm install` (Node 18+). If registry restrictions block installs, use an offline mirror.
3. Run dev server: `npm run dev`.
4. Deploy edge functions to Supabase and schedule cron:
   - `pull-risk-data` every 30–60 minutes
   - `evaluate-alerts` shortly after
5. Typography uses Inter via `next/font/google`; no local font assets are required.

## Env vars
Set these for Next.js (Vercel/local):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase project settings)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `NEXT_PUBLIC_SITE_URL` (e.g., https://deadheadzero.com)
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
- `GROK_API_KEY` (xAI)
- `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `ALERT_REPLY_TO` (email alerts)
- Optional SMS: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `ALERT_SMS_TO`

For Supabase Edge Functions (set in the project dashboard):
- `SUPABASE_URL` (same as `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROK_API_KEY` (for corridor narratives)
- `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `ALERT_REPLY_TO`, `ALERT_SMS_TO`
- Any external API keys required by your data sources

## Notes
- Corridor + risk tables are world-readable; user-owned tables are protected with RLS.
- Webhook stores raw Stripe events for audit.
- Footer + marketing copy emphasize non-brokerage posture and neutrality.
