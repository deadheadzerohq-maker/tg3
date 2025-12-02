import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";
import { ArrowUpRightIcon, ShieldIcon } from "@/components/ui/Icons";

const pillars = [
  {
    title: "Data fidelity first",
    copy:
      "We surface raw payloads and explanations next to every score so ops teams and compliance can audit the inputs.",
    tone: "positive",
  },
  {
    title: "Calm, signal-only alerts",
    copy:
      "Threshold-triggered email alerts with context. No spam, no SMS noise—just corridor signals that matter.",
    tone: "warning",
  },
  {
    title: "Design belongs in logistics",
    copy:
      "Every surface is crafted to feel like a supercar cockpit, not a legacy TMS UI, so your teams actually want to use it.",
    tone: "default",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-10">
      <Card className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Our stance</p>
            <h1 className="text-4xl font-semibold leading-tight">Built for critical infrastructure teams</h1>
            <p className="text-white/70 max-w-3xl">
              Deadhead Zero is engineered by Deadhead Zero Logistics LLC as a pure technology platform. We fuse public infrastructure data, AI risk models, and human-grade design so brokers and carriers get clarity without introducing brokerage risk.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Domain: deadheadzero.com</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Email alerts only</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Grok narratives</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <a href="/register" className="flex items-center gap-2">
                Start Deadhead Zero <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/pricing">See pricing</a>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-aurora-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Principle</p>
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
              </div>
            </div>
            <p className="text-sm text-white/70">{pillar.copy}</p>
            <Badge
              label={pillar.tone === "positive" ? "Data-led" : pillar.tone === "warning" ? "Calm alerts" : "Design-forward"}
              tone={pillar.tone === "default" ? undefined : pillar.tone}
            />
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-400/15 flex items-center justify-center">
            <ShieldIcon className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-sm text-white/60">Compliance-first</p>
            <h2 className="text-2xl font-semibold">Platform, not a broker</h2>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Deadhead Zero is not a freight broker or money transmitter. We do not negotiate rates, move freight dollars, or provide credit. Our role is to model corridor health, forecast disruptions, and deliver alerts. That clarity keeps compliance teams confident and lets your ops leaders move faster.
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-white/70">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SOC2 in motion</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">PII minimized</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">U.S. corridor coverage</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="/dashboard">View dashboard</a>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <a href="mailto:info@deadheadzero.com" className="flex items-center gap-2">
              Talk with us <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
