import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-white/60">Account</p>
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Subscription</p>
            <h2 className="text-xl font-semibold">Deadhead Zero Pro</h2>
            <p className="text-sm text-white/60">$399/mo · billing via Stripe Checkout</p>
          </div>
          <Badge label="Active" tone="positive" />
        </div>
        <Button variant="outline">Manage in customer portal</Button>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Notification channels</h2>
        <p className="text-sm text-white/70">Email is on by default. SMS optional.</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/70">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="h-4 w-4" />
            Email alerts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            SMS alerts (Twilio)
          </label>
        </div>
      </Card>
    </div>
  );
}
