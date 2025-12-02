import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BellIcon, DownloadIcon } from "@/components/ui/Icons";

const alerts = [
  {
    corridor: "I-40 Amarillo → Albuquerque",
    time: "5m ago",
    message: "Health dropped from 82 to 41. Snow + closure probability increasing.",
    threshold: 50,
  },
  {
    corridor: "I-90 Spokane → Billings",
    time: "1h ago",
    message: "Blowing snow risk; expect rolling closures overnight.",
    threshold: 45,
  },
];

export default function AlertsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">Disruption center</p>
          <h1 className="text-3xl font-semibold">Alerts</h1>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <DownloadIcon className="h-4 w-4" /> Export CSV
        </Button>
      </div>
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center">
            <BellIcon className="h-5 w-5 text-rose-200" />
          </div>
          <div>
            <p className="text-sm text-white/60">Latest alerts</p>
            <p className="text-lg font-semibold">Triggered by evaluate-alerts edge function</p>
          </div>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.message} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{alert.corridor}</p>
                  <p className="text-sm text-white/60">{alert.message}</p>
                </div>
                <Badge label={`Threshold ${alert.threshold}`} tone="warning" />
              </div>
              <p className="text-xs text-white/50">{alert.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
