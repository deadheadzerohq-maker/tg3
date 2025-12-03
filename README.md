# Deadhead Zero SaaS

A Next.js 14 + Supabase + Stripe platform that models U.S. freight corridors as a live health index, predicts disruptions, and delivers alerts + AI reports. Technology platform only — not a freight broker or money transmitter.

## Stack
- Next.js 14 App Router, TypeScript, Tailwind-style utilities, Framer Motion, Lucide icons
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Stripe Checkout + Billing Portal
- Grok (xAI) for corridor narratives
- Resend (email) alerts

## Structure
- `app/` marketing, auth, and dashboard routes
- `app/api/stripe/*` subscription endpoints
- `lib/` Supabase + Stripe helpers
- `supabase/functions/` edge functions for risk ingestion + alert evaluation
- `supabase/migrations/` schema for corridors, risk snapshots, alerts, subscriptions

## Getting started
1. Copy `.env.example` to `.env.local` and fill Supabase + Stripe keys (plus Grok/Resend if used).
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
- `NEXT_PUBLIC_SITE_URL` (defaults to https://deadheadzero.com)
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
- `GROK_API_KEY` (xAI)
- `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `ALERT_REPLY_TO`, `ALERT_EMAIL_ENABLED` (set to `false` to keep alerts in-app only)
- `WEATHER_API_KEY` (WeatherAPI.com key used by the risk ingestor; optional but recommended)
- `TRAFFIC_API_KEY` (Traffic data provider key; enables live congestion/incident signals)
- `FMCSA_API_KEY` (FMCSA webKey; enriches closure risk with safety activity by state)

For Supabase Edge Functions (set in the project dashboard — custom vars cannot start with `SUPABASE_`):
- `EDGE_SUPABASE_URL` (same value as `NEXT_PUBLIC_SUPABASE_URL`)
- `EDGE_SUPABASE_SERVICE_ROLE_KEY` (service role key)
- `GROK_API_KEY` (for corridor narratives)
- `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `ALERT_REPLY_TO`, `ALERT_EMAIL_ENABLED`
- `WEATHER_API_KEY` (WeatherAPI.com key)
- `TRAFFIC_API_KEY` (Traffic data provider key)
- `FMCSA_API_KEY` (FMCSA webKey; enriches closure risk)
- Any external API keys required by your data sources

## CI
- GitHub Actions workflow (`.github/workflows/ci.yml`) installs dependencies, runs lint, and builds with stub env values so PRs stay green.

## Notes
- Corridor + risk tables are world-readable; user-owned tables are protected with RLS.
- Webhook stores raw Stripe events for audit.
- Footer + marketing copy emphasize non-brokerage posture and neutrality.

## Publishing to a new GitHub repository
If you want a clean history that only contains the current snapshot:
1. (Optional) Back up the existing `.git` folder if you want to keep old history elsewhere, then run `rm -rf .git` to start fresh.
2. Initialize and commit the current files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Deadhead Zero"
   ```
3. Point the working copy at your new GitHub repo and push:
   ```bash
   git remote add origin https://github.com/deadheadzerohq-maker/dhz1.git
   git branch -M main
   git push -u origin main
   ```
4. Avoid adding secrets like `.env.local`; rely on Vercel/Supabase project env vars instead.

If an `origin` remote already exists, remove it first with `git remote remove origin` before adding the new URL.
