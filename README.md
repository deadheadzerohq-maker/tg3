# InfraPulse™ SaaS

A Next.js 14 + Supabase + Stripe platform that models U.S. freight corridors as a live health index, predicts disruptions, and delivers alerts + AI reports. Technology platform only — not a freight broker or money transmitter.

## Stack
- Next.js 14 App Router, TypeScript, Tailwind, Framer Motion
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Stripe Checkout + Billing Portal
- OpenAI / Grok for narrative risk notes
- Optional Twilio SMS

## Structure
- `app/` marketing, auth, and dashboard routes
- `app/api/stripe/*` subscription endpoints
- `lib/` Supabase + Stripe helpers
- `supabase/functions/` edge functions for risk ingestion + alert evaluation
- `supabase/migrations/` schema for corridors, risk snapshots, alerts, subscriptions

## Getting started
1. Copy `.env.example` to `.env.local` and fill Supabase + Stripe keys.
2. Install deps: `npm install` (Node 18+). If registry restrictions block installs, use an offline mirror.
3. Run dev server: `npm run dev`.
4. Deploy edge functions to Supabase and schedule cron:
   - `pull-risk-data` every 30–60 minutes
   - `evaluate-alerts` shortly after

## Env vars
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- Optional Twilio keys for SMS

## Notes
- Corridor + risk tables are world-readable; user-owned tables are protected with RLS.
- Webhook stores raw Stripe events for audit.
- Footer + marketing copy emphasize non-brokerage posture and neutrality.
