import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-sky-500 via-cyan-500 to-slate-950">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.25),transparent_30%)] blur-3xl" />

        <header className="relative z-10 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.85)]" />
              <span className="font-semibold tracking-wide">Deadhead Zero Logistics LLC</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-slate-100/90 hover:text-white transition"
              >
                Log in
              </Link>
              <Link
                href="#pricing"
                className="rounded-full bg-white text-slate-900 px-4 py-2 font-semibold hover:bg-slate-100 transition shadow-lg"
              >
                Start TenderGuard
              </Link>
            </div>
          </div>
        </header>

        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.35em] text-white/80">TenderGuard v1.5</p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Verify every carrier before you tender a load.
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto lg:mx-0">
              TenderGuard automates broker due diligence with instant MC/DOT lookups, bulk vetting, and a real audit trail your shippers will respect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/login"
                className="rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold shadow-[0_15px_40px_rgba(15,23,42,0.35)] hover:bg-slate-800 transition"
              >
                Launch TenderGuard
              </Link>
              <a
                href="#pricing"
                className="rounded-full bg-white/10 text-white px-6 py-3 text-sm font-semibold border border-white/30 backdrop-blur hover:bg-white/20 transition"
              >
                View pricing
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                <span>Unlimited single + bulk lookups</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
                <span>Audit-ready history</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-200 shadow-[0_0_10px_rgba(186,230,253,0.9)]" />
                <span>Broker-first workflow</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-x-6 -inset-y-8 bg-white/20 blur-3xl rounded-[32px]" />
            <div className="relative rounded-[28px] bg-white shadow-[0_20px_120px_rgba(15,23,42,0.45)] overflow-hidden border border-white/50">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> TenderGuard Dashboard
                </div>
                <span className="text-white/70">Live vetting</span>
              </div>

              <div className="bg-slate-50 px-6 py-5 space-y-4 text-slate-900">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      Enter MC or DOT number
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value="1234567"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner"
                      />
                      <button className="rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold shadow-lg">
                        Lookup
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Insurance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span>Authority</span>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Carrier</p>
                        <p className="text-lg font-semibold text-slate-900">Timely Truckers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Risk score</p>
                        <p className="text-2xl font-bold text-slate-900">92</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div className="rounded-xl bg-slate-100 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">DOT</p>
                        <p className="font-semibold text-slate-900">1234567</p>
                      </div>
                      <div className="rounded-xl bg-slate-100 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">MC</p>
                        <p className="font-semibold text-slate-900">7654321</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100 px-3 py-3 text-xs text-emerald-600">
                      Insurance & authority verified. Good to tender.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">Onboarding state</p>
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                        Verified
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full w-[60%] bg-gradient-to-r from-sky-500 to-blue-400" />
                        </div>
                        <span className="text-xs text-slate-600 w-12 text-right">60%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full w-[25%] bg-gradient-to-r from-amber-400 to-orange-400" />
                        </div>
                        <span className="text-xs text-slate-600 w-12 text-right">25%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-400" />
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full w-[15%] bg-gradient-to-r from-rose-400 to-rose-500" />
                        </div>
                        <span className="text-xs text-slate-600 w-12 text-right">15%</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="text-xs text-slate-500 mb-2">Invited carriers</p>
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span>Accepted</span>
                        <span className="font-semibold">88%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span
                              key={i}
                              className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-100"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500">+12 more</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Invited carriers</span>
                    <span>Filter by status</span>
                  </div>
                  <div className="mt-3 divide-y divide-slate-200 text-sm">
                    {[
                      { name: "Timely Truckers", status: "Completed", email: "dispatch@timely.com" },
                      { name: "Black Oak Freight", status: "In progress", email: "ops@blackoak.com" },
                      { name: "Blue Mesa Logistics", status: "Pending", email: "hello@bluemesa.com" },
                    ].map((row) => (
                      <div
                        key={row.name}
                        className="flex flex-wrap items-center justify-between gap-2 py-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.email}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                            row.status === "Completed"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : row.status === "In progress"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="pricing" className="bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">Pricing built for real brokerages</h2>
              <p className="text-sm text-slate-400">Simple plans that scale as your load volume grows.</p>
            </div>
            <Link
              href="/login"
              className="rounded-full bg-cyan-500 text-slate-950 px-5 py-3 text-sm font-semibold hover:bg-cyan-400 transition"
            >
              Start now
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-200">Starter Broker</h3>
              <p className="mt-3 text-3xl font-bold">$39</p>
              <p className="text-xs text-slate-400 mb-4">per month</p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>Single + bulk lookups</li>
                <li>Up to 500 checks / month</li>
                <li>History & audit log</li>
              </ul>
              <span className="mt-auto text-[11px] text-slate-500">
                Great for solo brokers and small teams.
              </span>
            </div>

            <div className="rounded-2xl border border-cyan-500 bg-slate-950/80 p-6 flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.35)]">
              <h3 className="text-sm font-semibold text-cyan-300">Pro Brokerage</h3>
              <p className="mt-3 text-3xl font-bold">$99</p>
              <p className="text-xs text-slate-400 mb-4">per month</p>
              <ul className="text-xs text-slate-200 space-y-2 mb-6">
                <li>5 team seats</li>
                <li>5,000 checks / month</li>
                <li>Priority alerts on authority & insurance</li>
                <li>Full lookup history</li>
              </ul>
              <span className="mt-auto text-[11px] text-slate-500">
                For growing brokerages that live in the load board.
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-200">Enterprise 3PL</h3>
              <p className="mt-3 text-3xl font-bold">Let&apos;s talk</p>
              <p className="text-xs text-slate-400 mb-4">custom</p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
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

      <footer className="border-t border-slate-800 px-4 sm:px-6 py-4 text-xs text-slate-500 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
            Technology platform only, not a broker or load board. We never hold freight dollars. Operated by Deadhead Zero Logistics LLC.
          </p>
        </div>
      </footer>
    </main>
  );
}
