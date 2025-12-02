export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-4 text-white/70 text-sm">
      <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
      <p>We collect minimal profile data (name, company, email) to operate subscriptions and notifications. Corridor telemetry is public-source and not tied to PII.</p>
      <p>Authentication is powered by Supabase. Billing is handled by Stripe; we do not store payment details.</p>
    </div>
  );
}
