import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "@/components/charts/Sparkline";
import {
  BellIcon,
  MapIcon,
  ShieldCheckIcon,
  SignalIcon,
} from "@/components/ui/Icons";

const watchlist = [
  { corridor: "I-40 Amarillo → Albuquerque", health: 41, previous: 82, reason: "Snow & closure probability increased" },
  { corridor: "LAX → DFW", health: 44, previous: 55, reason: "Port dwell + Dallas congestion" },
];

const forecasts = [
  { name: "I-80 | WY → NE", trend: [82, 79, 77, 74, 71, 68, 66] },
  { name: "I-95 | NJ → CT", trend: [67, 66, 65, 64, 64, 65, 66] },
  { name: "LAX → DFW", trend: [44, 46, 52, 58, 63, 65, 68] },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-white/60">Customer dashboard</p>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Corridor Health & Alerts</h1>
            <p className="text-white/60">Live snapshots, forecasted risk, and alert history for your watched corridors.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Start new watch</Button>
            <Button>Open billing portal</Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Active corridors</p>
              <p className="text-3xl font-bold">143</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-aurora-500/20 flex items-center justify-center">
              <MapIcon className="h-5 w-5 text-aurora-200" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Alerts last 24h</p>
              <p className="text-3xl font-bold">38</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <BellIcon className="h-5 w-5 text-rose-200" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">AI reports shipped</p>
              <p className="text-3xl font-bold">712</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <SignalIcon className="h-5 w-5 text-emerald-200" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">High-risk watchlist</p>
              <h2 className="text-xl font-semibold">Corridors needing action</h2>
            </div>
            <Badge label="Auto alerts enabled" tone="warning" />
          </div>
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.corridor} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.corridor}</p>
                  <div className="text-right text-sm">
                    <p className="text-3xl font-bold text-rose-200">{item.health}</p>
                    <p className="text-white/50">prev {item.previous}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">AI forecasts</p>
              <h2 className="text-xl font-semibold">7-day outlook</h2>
            </div>
            <Badge label="Daily + weekly" />
          </div>
          <div className="space-y-4">
            {forecasts.map((forecast) => (
              <div key={forecast.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{forecast.name}</p>
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-200" />
                </div>
                <Sparkline data={forecast.trend} label="Health trajectory" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
