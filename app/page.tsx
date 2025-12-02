import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/charts/Sparkline";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BellIcon,
  RadarIcon,
  ShieldIcon,
  ZapIcon,
} from "@/components/ui/Icons";

const corridors = [
  {
    name: "I-80 | WY → NE",
    health: 82,
    change: "+6.4%",
    risks: ["weather", "congestion"],
    trend: [50, 60, 54, 62, 74, 82],
  },
  {
    name: "LAX → DFW",
    health: 44,
    change: "-18%",
    risks: ["closure", "port"],
    trend: [88, 83, 71, 62, 55, 44],
  },
  {
    name: "I-95 | NJ → CT",
    health: 67,
    change: "+3.1%",
    risks: ["congestion"],
    trend: [59, 64, 63, 65, 66, 67],
  },
];

export default function LandingPage() {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-aurora-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-20 pt-8 sm:pt-12 lg:pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <Badge label="Freight corridor intelligence" tone="positive" />
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-glow">
                  Deadhead Zero keeps the nation&apos;s freight corridors alive.
                </h1>
                <p className="text-lg text-white/70 max-w-2xl">
                  AI-grade health scores for every U.S. corridor, predicted disruptions before they strike, and instant alerts when your network is at risk. Built to feel like a supercar UI—powered by real infrastructure data.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="hover:-translate-y-0.5 hover:scale-105 duration-300 ease-out">
                  <Link href="/register" className="flex items-center gap-2">
                    Start Deadhead Zero Pro <ArrowUpRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="hover:-translate-y-0.5 duration-300 ease-out">
                  <Link href="/pricing">See pricing</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-white/70">
                <div className="card-backdrop rounded-xl p-4 border border-white/10 animate-fade-up animate-delay-75">
                  <p className="text-2xl font-semibold text-white">0-100</p>
                  <p>Corridor Health Index with live telemetry.</p>
                </div>
                <div className="card-backdrop rounded-xl p-4 border border-white/10 animate-fade-up animate-delay-150">
                  <p className="text-2xl font-semibold text-white">+12k</p>
                  <p>Disruption alerts projected monthly.</p>
                </div>
                <div className="card-backdrop rounded-xl p-4 border border-white/10 animate-fade-up animate-delay-225">
                  <p className="text-2xl font-semibold text-white">99.9%</p>
                  <p>Uptime SLA on data delivery.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SOC2 controls in motion</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Uptime &amp; status: always-on</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Email + SMS alerting wired</span>
              </div>
            </div>
            <Card className="relative overflow-hidden border-white/10 shadow-lg hover:-translate-y-1 duration-300 ease-out">
              <div className="absolute inset-0 bg-gradient-to-br from-aurora-500/10 via-transparent to-emerald-400/10" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Live Corridor Health</p>
                    <p className="text-2xl font-semibold">National view</p>
                  </div>
                  <Badge label="Autopilot" tone="warning" />
                </div>
                <div className="grid gap-3">
                  {corridors.map((corridor) => (
                    <div
                      key={corridor.name}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex flex-col gap-2 backdrop-blur-md hover:-translate-y-0.5 duration-300 ease-out"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{corridor.name}</p>
                          <p className="text-xs text-white/50">Live telemetry · 7d outlook</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-aurora-300">{corridor.health}</p>
                          <p className="text-xs text-white/60">{corridor.change}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <BellIcon className="h-3.5 w-3.5 text-aurora-300" />
                        <p>Risks: {corridor.risks.join(", ")}</p>
                      </div>
                      <Sparkline data={corridor.trend} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20 grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-aurora-500/20 flex items-center justify-center">
              <RadarIcon className="h-5 w-5 text-aurora-300" />
            </div>
            <div>
              <p className="text-sm text-white/60">Risk telemetry</p>
              <h3 className="text-2xl font-semibold">Signals that never sleep</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div className="space-y-3">
              <p className="font-semibold text-white">Corridor Health Map</p>
              <p>
                Every U.S. freight corridor scored 0-100 with weather severity, closure probability, congestion pressure, port + border delays, and seasonal stress layered together.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-white">Disruption Alerts</p>
              <p>
                AI watches your corridors and fires email/SMS when thresholds are crossed, drops in health are material, or border delays spike beyond SLA.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-white">AI Reports</p>
              <p>
                Daily + weekly briefings summarizing the seven-day forecast— pure operational guidance, no pricing or brokerage language.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-white">API Ready</p>
              <p>
                REST endpoints for your TMS and control tower workflows. Designed to drop into carrier scorecards and network twins.
              </p>
            </div>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-400/15 flex items-center justify-center">
              <ShieldIcon className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm text-white/60">Compliance-first</p>
              <h3 className="text-xl font-semibold">Platform, not a broker</h3>
            </div>
          </div>
            <p className="text-sm text-white/70">
              Deadhead Zero is a technology platform only. We model infrastructure risk, forecast disruptions, and notify operators. We never negotiate rates or move freight dollars.
            </p>
          <div className="space-y-3">
            <Badge label="SOC2 in motion" />
            <Badge label="PII minimized" tone="positive" />
            <Badge label="U.S. corridor coverage" tone="warning" />
          </div>
        </Card>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/15 flex items-center justify-center">
                <ZapIcon className="h-5 w-5 text-rose-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Automation</p>
                <h3 className="text-2xl font-semibold">Edge functions & cron risk engine</h3>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Supabase Edge Functions pull public weather, DOT, maritime and congestion signals every 30–60 minutes.</li>
              <li>AI-normalized scoring writes fresh snapshots to corridor_risk_snapshots with raw payloads for auditability.</li>
              <li>evaluate-alerts detects threshold crossings for watched corridors and dispatches email/SMS with contextual narratives.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-2xl font-semibold mb-4">Billing that stays out of the way</h3>
            <p className="text-sm text-white/70 mb-4">
              Stripe Checkout for subscriptions, webhook-backed entitlements in Supabase, and instant customer portals for receipts. One price: $399/mo for brokers & carriers; enterprise plans on request.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/register">Launch Pro</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
