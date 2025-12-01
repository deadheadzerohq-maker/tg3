export const metadata = { title: "TenderGuard Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-6">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="text-slate-300 text-sm">Effective: 2024</p>
      <div className="prose prose-invert max-w-none text-slate-200 prose-headings:text-slate-50 prose-strong:text-slate-50">
        <p>
          Deadhead Zero Logistics LLC collects only the data needed to authenticate users, process payments, and run TenderGuard lookups. Typical data includes your email, carrier lookup inputs, lookup results, and billing identifiers from Stripe.
        </p>
        <p>
          We do not sell broker or carrier data. Data is stored in Supabase and Stripe under industry-standard security. Access is limited to your authenticated account, subject to future per-user row-level security (RLS) policies.
        </p>
        <p>
          Magic-link authentication is provided by Supabase. Billing is handled by Stripe. Each provider has its own privacy terms, and you should review them before using TenderGuard.
        </p>
        <p>
          TenderGuard is informational only. Brokers must perform their own due diligence and comply with all applicable laws and contractual requirements when using any data surfaced by the platform.
        </p>
      </div>
    </main>
  );
}
