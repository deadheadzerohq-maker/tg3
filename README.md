# TenderGuard (Deadhead Zero Logistics LLC)

Landing page:
- Deadhead Zero Logistics header
- TenderGuard product card
- Stripe checkout button

Other routes:
- `/app` dashboard with mocked lookup
- `/terms`
- `/privacy`
- `/api/create-checkout-session`
- `/api/stripe/webhook`
- `/api/lookup`

Set these env vars in Vercel:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_STRIPE_PRICE_ID
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
