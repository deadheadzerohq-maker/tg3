import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="flex-1">
        <header className="border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              <span className="text-sm font-semibold tracking-wide text-slate-300">
                Deadhead Zero Logistics LLC
              </span>
            </div>
            <div className="flex gap-3 text-sm">
              <Link
                href="/login"
                className="text-slate-300 hover:text-slate-50"
              >
                Log in
              </Link>
              <a
                href="#pricing"
                className="rounded-full bg-cyan-500 text-slate-950 px-4 py-2 font-semibold hover:bg-cyan-400 transition"
              >
                Start TenderGuard
              </a>
            </div>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
          {/* Hero */}
          <div className="space-y-6 text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_28px_rgba(34,211,238,0.6)]">
              Deadhead Zero Logistics
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
              <span className="font-semibold">TenderGuard</span> automates
              carrier vetting for freight brokers. One price. Unlimited checks.
              100% automated. No more tab-hopping between SAFER, spreadsheets,
              and email trails.
            </p>
          </div>

          {/* Product card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 shadow-[0_0_60px_rgba(34,211,238,0.25)] p-6 sm:p-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center sm:text-left">
              TenderGuard
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
              Unlimited carrier safety &amp; compliance lookups using real
              FMCSA/SAFER signals. Bulk paste MC/DOT lists, auto-log every
              check, and generate an audit trail shippers actually respect.
            </p>
            <ul className="grid sm:grid-cols-3 gap-4 text-sm text-slate-300">
              <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
                <p className="font-semibold mb-1">Instant vetting</p>
                <p>Paste MC/DOT, get a TenderGuard risk score and carrier snapshot.</p>
              </li>
              <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
                <p className="font-semibold mb-1">Bulk checks</p>
                <p>Validate dozens of carriers at once before you tender a lane.</p>
              </li>
              <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
                <p className="font-semibold mb-1">Audit receipts</p>
                <p>Every lookup is logged so you can prove vetting happened.</p>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-full bg-cyan-500 text-slate-950 px-6 py-3 text-sm font-semibold text-center hover:bg-cyan-400 transition"
              >
                Start TenderGuard — log in
              </Link>
              <p className="text-xs text-slate-400 text-center sm:text-left">
                Technology platform only, not a broker or load board. We never
                hold freight dollars.
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div id="pricing" className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold">
              Pricing built for real brokerages
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Starter */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col">
                <h4 className="text-sm font-semibold text-slate-200">
                  Starter Broker
                </h4>
                <p className="mt-2 text-2xl font-bold">$39</p>
                <p className="text-xs text-slate-400 mb-4">per month</p>
                <ul className="text-xs text-slate-300 space-y-1 mb-4">
                  <li>Single + bulk lookups</li>
                  <li>Up to 500 checks / month</li>
                  <li>History & audit log</li>
                </ul>
                <span className="mt-auto text-[11px] text-slate-500">
                  Great for solo brokers and small teams.
                </span>
              </div>
              {/* Pro */}
              <div className="rounded-2xl border border-cyan-500 bg-slate-950/80 p-5 flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                <h4 className="text-sm font-semibold text-cyan-300">
                  Pro Brokerage
                </h4>
                <p className="mt-2 text-2xl font-bold">$99</p>
                <p className="text-xs text-slate-400 mb-4">per month</p>
                <ul className="text-xs text-slate-200 space-y-1 mb-4">
                  <li>5 team seats</li>
                  <li>5,000 checks / month</li>
                  <li>Priority alerts on authority & insurance</li>
                  <li>Full lookup history</li>
                </ul>
                <span className="mt-auto text-[11px] text-slate-500">
                  For growing brokerages that live in the load board.
                </span>
              </div>
              {/* Enterprise */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col">
                <h4 className="text-sm font-semibold text-slate-200">
                  Enterprise 3PL
                </h4>
                <p className="mt-2 text-2xl font-bold">Let&apos;s talk</p>
                <p className="text-xs text-slate-400 mb-4">custom</p>
                <ul className="text-xs text-slate-300 space-y-1 mb-4">
                  <li>Unlimited seats</li>
                  <li>API access for your TMS</li>
                  <li>Dedicated support & SLAs</li>
                </ul>
                <span className="mt-auto text-[11px] text-slate-500">
                  For 3PLs and digital brokers that need deeper integrations.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 py-4 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex gap-4">
            <a
              href="/terms"
              className="hover:text-slate-300 underline underline-offset-4"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="hover:text-slate-300 underline underline-offset-4"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-[11px] sm:text-xs">
            Technology platform only, not a broker or load board. We never hold
            freight dollars. Operated by Deadhead Zero Logistics LLC.
          </p>
        </div>
      </footer>
    </main>
  );
}
