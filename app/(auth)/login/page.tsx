import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-sm text-white/60">Welcome back</p>
          <h1 className="text-2xl font-semibold">Log in to Deadhead Zero</h1>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <Button className="w-full" size="lg" type="submit">
            Continue
          </Button>
        </form>
        <p className="text-sm text-white/60">
          Need access? <Link href="/register" className="text-aurora-300">Start Deadhead Zero</Link>
        </p>
      </Card>
    </div>
  );
}
