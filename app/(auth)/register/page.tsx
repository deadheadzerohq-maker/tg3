"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: company,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const accessToken = data.session?.access_token;
    if (!accessToken) {
      setMessage("Check your email to confirm your account before checkout.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setMessage(body.error ?? "Unable to start checkout. Please try again.");
      setLoading(false);
      return;
    }

    const { url } = (await response.json()) as { url?: string };
    if (url) {
      window.location.href = url;
      return;
    }

    setMessage("Unable to start checkout. Please try again.");
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Deadhead Zero Pro · $399/mo</p>
            <h1 className="text-2xl font-semibold">Create your account</h1>
          </div>
          <Badge label="Technology platform only" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:border-aurora-300 focus:outline-none"
                required
              />
            </div>
          </div>
          <Button className="w-full" size="lg" type="submit" disabled={loading || !supabase}>
            {loading ? "Launching checkout..." : "Launch checkout"}
          </Button>
        </form>
        {message ? <p className="text-sm text-rose-200">{message}</p> : null}
        {!supabase ? (
          <p className="text-sm text-rose-200">
            Missing Supabase configuration. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
          </p>
        ) : null}
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
