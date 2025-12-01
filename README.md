# TenderGuard (Deadhead Zero Logistics LLC)

Production-ready SaaS starter for the TenderGuard carrier vetting platform built on **Next.js 14 App Router**, **TypeScript**, **TailwindCSS**, **Supabase**, and **Stripe**.

## Tech stack
- Next.js 14 (App Router) + TypeScript
- TailwindCSS for styling
- Supabase for auth (email magic links) + Postgres
- Stripe for $399/mo subscription billing + billing portal
- Recharts for dashboard donut charting
- React Icons for navigation

## Environment variables
Create a `.env.local` (or use the included `.env.example`) with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase setup
1. Create a new Supabase project and grab the project URL + anon + service role keys.
2. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) to provision `profiles`, `subscribers`, `lookups`, and `alerts` tables. RLS is left disabled initially—enable per-user RLS before production.
3. Configure **Email OTP** in Supabase Authentication and set the site URL for deep-linking back to `/app` after sign-in.

## Stripe setup
1. Create a product/price for **$399/mo** and set its price ID in `NEXT_PUBLIC_STRIPE_PRICE_ID`.
2. Create a webhook endpoint pointing to `https://your-domain.com/api/stripe/webhook` and add the signing secret to `STRIPE_WEBHOOK_SECRET`.
3. Billing portal is created via `/api/create-portal-session`. Checkout uses `/api/create-checkout-session` and passes the Supabase `user_id` + email as metadata.

## Running locally
```bash
npm install   # install deps
npm run dev   # start Next.js on http://localhost:3000
```
> If npm install is blocked in your environment, ensure internet access to npmjs.org or install dependencies manually.

## Deploying to Vercel
1. Push the repo to GitHub and import into Vercel.
2. Add all environment variables in the Vercel dashboard.
3. Set the production URL in `NEXT_PUBLIC_SITE_URL` and configure the Stripe webhook to the deployed domain.

## Key routes
- `/` – marketing landing
- `/login` – Supabase magic-link login
- `/app` – dashboard (requires active subscriber)
- `/app/deep-search`, `/app/carriers`, `/app/monitoring`, `/app/account`, `/app/history`, `/app/upgrade`
- `/api/lookup`, `/api/bulk-lookup`
- `/api/create-checkout-session`, `/api/create-portal-session`, `/api/stripe/webhook`
- `/terms`, `/privacy`
