import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">InfraPulse Pro · $399/mo</p>
            <h1 className="text-2xl font-semibold">Create your account</h1>
          </div>
          <Badge label="Technology platform only" />
        </div>
        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Full name</label>
              <input className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Company</label>
              <input className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Email</label>
              <input type="email" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Password</label>
              <input type="password" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none" />
            </div>
          </div>
          <Button className="w-full" size="lg" type="submit">
            Launch checkout
          </Button>
        </form>
        <p className="text-xs text-white/60">
          By starting, you agree this is a technology platform only. We do not negotiate freight or hold funds.
        </p>
        <p className="text-sm text-white/60">
          Already subscribed? <Link href="/login" className="text-aurora-300">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
