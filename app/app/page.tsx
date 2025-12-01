"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type LookupResponse = {
  carrierName: string | null;
  mcNumber: string | null;
  dotNumber: string | null;
  authorityStatus: string;
  insuranceStatus: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | string;
  details: any;
};

export default function TenderGuardDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResponse | null>(null);

  // 1) Check auth & subscription
  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user?.email) {
        router.replace("/login");
        return;
      }

      const userEmail = data.user.email;
      setEmail(userEmail);

      // Check subscribers table
      const { data: subs, error: subsError } = await supabase
        .from("subscribers")
        .select("status, current_period_end")
        .eq("email", userEmail)
        .order("current_period_end", { ascending: false })
        .limit(1);

      if (subsError) {
        console.error("Error checking subscribers:", subsError);
      }

      const sub = subs?.[0] ?? null;
      const now = new Date();

      const active =
        sub &&
        sub.status &&
        sub.status !== "canceled" &&
        (!sub.current_period_end ||
          new Date(sub.current_period_end) > now);

      if (!active) {
        router.replace("/");
        return;
      }

      setHasAccess(true);
      setCheckingAccess(false);
    };

    run();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!query.trim()) {
      setError("Enter a DOT or MC number to run a TenderGuard check.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: query,
          email, // for logging in Supabase
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Lookup failed.");
      }

      setResult(json as LookupResponse);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lookup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Checking access…</p>
      </main>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              TenderGuard Dashboard
            </h1>
            {email && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Logged in as{" "}
                <span className="font-mono text-slate-100">{email}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-slate-700 px-4 py-2 text-xs sm:text-sm hover:bg-slate-800 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <section className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
          {/* Lookup card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-cyan-500/10 p-6 sm:p-8">
            <p className="text-base sm:text-lg font-medium mb-3">
              Paste a carrier MC or DOT number to run a TenderGuard check.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mb-5">
              We ping FMCSA/SAFER in real time. No scraping, no spreadsheets,
              just an instant risk signal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-base outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 transition"
                  placeholder="e.g., MC 123456 or DOT 789012"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="sm:min-w-[150px] rounded-xl bg-cyan-500 text-slate-950 font-semibold px-5 py-3 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Checking…" : "Run check"}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-400">
                  {error}
                </p>
              )}
            </form>
          </div>

          {/* Result card */}
          {result && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-cyan-500/10 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {result.carrierName || "Carrier found"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    DOT {result.dotNumber || "—"}
                    {result.mcNumber && <> · MC {result.mcNumber}</>}
                  </p>
                </div>

                <span
                  className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${
                    result.riskLevel === "high"
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : result.riskLevel === "medium"
                      ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  TenderGuard risk: {result.riskScore} ({result.riskLevel})
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-400">Operating status</dt>
                  <dd className="font-medium">
                    {result.authorityStatus || "Unknown"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Insurance status</dt>
                  <dd className="font-medium">
                    {result.insuranceStatus || "Unknown"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">DOT number</dt>
                  <dd className="font-medium">{result.dotNumber || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">MC / Docket</dt>
                  <dd className="font-medium">{result.mcNumber || "—"}</dd>
                </div>
              </dl>

              <p className="mt-6 text-xs text-slate-500">
                FMCSA/SAFER data is used as-is. TenderGuard provides signals and
                scoring only and does not replace your own internal carrier
                vetting process.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 py-4 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex gap-4">
            <a
              href="/terms"
              className="hover:text-slate-300 underline underline-offset-4"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="hover:text-slate-300 underline underline-offset-4"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Technology platform only, not a broker or load board. We never hold
            freight dollars. Operated by Deadhead Zero Logistics LLC.
          </p>
        </div>
      </footer>
    </main>
  );
}
