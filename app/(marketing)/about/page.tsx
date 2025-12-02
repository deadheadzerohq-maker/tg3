import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm text-white/60">Our stance</p>
        <h1 className="text-4xl font-semibold">Built for critical infrastructure teams</h1>
          <p className="text-white/60 max-w-3xl">
            Deadhead Zero is engineered by Deadhead Zero Logistics LLC as a pure technology platform. We fuse public infrastructure data, AI risk models, and human-grade design so brokers and carriers get clarity without introducing brokerage risk.
          </p>
      </div>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">What we believe</h2>
        <ul className="space-y-3 text-sm text-white/70">
          <li>Data fidelity beats guesswork. We surface raw payloads and explanations alongside every score.</li>
          <li>Alerts must be calm. No spam—only threshold-based notices tied to watched corridors.</li>
          <li>Design belongs in logistics. Every screen is crafted to feel like the cockpit of a supercar, not a legacy TMS.</li>
        </ul>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold">Compliance & boundaries</h2>
          <p className="text-sm text-white/70">
            Deadhead Zero is not a freight broker or money transmitter. We do not negotiate rates, move freight dollars, or provide credit. Our role is to model corridor health, forecast disruptions, and deliver alerts. That clarity keeps compliance teams confident and lets your ops leaders move faster.
          </p>
      </Card>
    </div>
  );
}
