import Link from "next/link";
import { ArrowRight } from "react-icons/fi";

const highlights = [
  "Instant MC/DOT vetting with TenderGuard risk scoring",
  "Bulk checks and audit-grade history for every lane",
  "Stripe-managed $399/mo flat subscription",
];

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-transparent to-slate-950" />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 space-y-16">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-glow" aria-hidden />
            <span className="font-semibold">TenderGuard</span>
            <span className="text-slate-500">by Deadhead Zero Logistics LLC</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-slate-200 hover:text-cyan-200">
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 shadow-glow hover:bg-cyan-400"
            >
              Start TenderGuard
            </Link>
          </div>
        </header>

        <section className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
              Automated carrier safety desk
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-slate-50 drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]">
              TenderGuard vets every carrier before you tender a load.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Stop juggling SAFER tabs and spreadsheets. TenderGuard runs MC/DOT checks, logs every interaction, and keeps your team compliant with a single $399/mo subscription.
            </p>
            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-slate-200">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shadow-glow" aria-hidden />
                  <p className="text-sm sm:text-base text-slate-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 shadow-glow hover:bg-cyan-400"
              >
                Launch TenderGuard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-200 hover:border-cyan-400"
              >
                See pricing
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10">
            <h2 className="text-xl font-semibold">TenderGuard snapshot</h2>
            <p className="mt-2 text-sm text-slate-400">
              Preview of the dashboard experience your team gets on day one.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Risk engine</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-cyan-200">Carrier Safety Pass</p>
                    <p className="text-sm text-slate-400">MC 784512 · DOT 1984502</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-200 text-xs font-semibold border border-emerald-400/40">
                    Low risk · 86
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Monitoring</p>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-slate-300">
                  <div>
                    <p className="text-slate-400">Active carriers</p>
                    <p className="text-lg font-semibold">248</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Alerts</p>
                    <p className="text-lg font-semibold text-amber-300">3</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Billing</p>
                <p className="mt-2 text-sm text-slate-300">Single plan · $399/mo · Unlimited users</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-card shadow-cyan-500/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Pricing</p>
              <h3 className="text-2xl font-semibold">One plan, all-inclusive</h3>
            </div>
            <Link
              href="/login"
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow hover:bg-cyan-400"
            >
              Get started for $399/mo
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="col-span-2 rounded-2xl border border-cyan-500 bg-cyan-500/10 p-6 shadow-glow">
              <p className="text-sm font-semibold text-cyan-200">TenderGuard Subscription</p>
              <p className="mt-2 text-4xl font-bold text-slate-50">$399<span className="text-base font-medium text-slate-300">/mo</span></p>
              <p className="mt-2 text-sm text-slate-300">Unlimited carrier checks, unlimited seats, Stripe billing.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>• Magic-link authentication via Supabase</li>
                <li>• Dashboard, Deep Search, Monitoring, and History</li>
                <li>• Stripe-hosted billing & management portal</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">Compliance posture</p>
              <p className="mt-2 text-slate-400">
                Technology platform only. TenderGuard does not broker freight or hold funds. Brokers must verify and comply with all federal and shipper requirements.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
