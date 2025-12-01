"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, go straight to dashboard
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/app");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Enter your work email to get a login link.");
      return;
    }

    setStatus("sending");

    const redirectTo =
      (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "") + "/app";

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo || undefined,
      },
    });

    if (error) {
      console.error(error);
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-xlShadow shadow-cyan-500/10">
        <h1 className="text-2xl font-semibold mb-2">Log in to TenderGuard</h1>
        <p className="text-sm text-slate-400 mb-6">
          We&apos;ll email you a magic link. No passwords, no friction.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Work email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500"
              placeholder="you@brokerage.com"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-cyan-500 text-slate-950 text-sm font-semibold py-2.5 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {status === "sending" ? "Sending link..." : "Send magic link"}
          </button>
        </form>

        {status === "sent" && (
          <p className="mt-4 text-xs text-emerald-300">
            Magic link sent. Check your email and open the link on this device
            to enter your dashboard.
          </p>
        )}

        <p className="mt-6 text-xs text-slate-500 text-center">
          Technology platform only, not a freight broker or money transmitter.
          We never hold freight dollars.
        </p>
      </div>
    </main>
  );
}
