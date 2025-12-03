"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) {
      setMessage("App configuration error: Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-sm text-white/60">Welcome back</p>
          <h1 className="text-2xl font-semibold">Log in to Deadhead Zero</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" size="lg" type="submit" disabled={loading || !supabase}>
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </form>
        {message ? <p className="text-sm text-rose-200">{message}</p> : null}
        {!supabase ? (
          <p className="text-sm text-rose-200">
            Missing Supabase configuration. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
          </p>
        ) : null}
        <p className="text-sm text-white/60">
          Need access? <Link href="/register" className="text-aurora-300">Start Deadhead Zero</Link>
        </p>
      </Card>
    </div>
  );
}
