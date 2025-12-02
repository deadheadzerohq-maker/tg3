import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const tiers = [
  {
    name: "Deadhead Zero Pro",
    price: "$399/mo",
    description: "For brokers and carriers that want AI-grade risk signals.",
    features: [
      "Unlimited corridor health lookups",
      "Disruption alerts (email)",
      "Daily + weekly AI forecasts",
      "Stripe-managed billing portal",
    ],
    cta: "Start Pro",
    href: "/register",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-sm text-white/60">Transparent and flat</p>
        <h1 className="text-4xl font-semibold">Pricing built for high-velocity ops teams</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          One subscription covers your entire team. Deadhead Zero stays laser-focused on corridor health—no brokerage
          features, no freight payments, no distractions.
        </p>
      </div>
      <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto w-full">
        {tiers.map((tier) => (
          <Card key={tier.name} className={tier.highlight ? "border-aurora-300/30" : ""}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/60">{tier.name}</p>
                <p className="text-3xl font-bold">{tier.price}</p>
                <p className="text-sm text-white/60 mt-2">{tier.description}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-aurora-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full" variant={tier.highlight ? "primary" : "outline"}>
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
