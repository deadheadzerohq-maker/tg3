"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSupabaseClient } from "@/lib/supabaseClient";

type LookupResponse = {
  carrierName: string | null;
  mcNumber: string | null;
  dotNumber: string | null;
  authorityStatus: string;
  insuranceStatus: string;
  riskScore: number;
  riskLevel: string;
  details?: any;
  error?: string;
};

type BulkLookupResult = LookupResponse;

function RiskBadge({ level }: { level: string }) {
  const classes =
    level === "high"
      ? "bg-red-500/15 text-red-200 border border-red-500/40"
      : level === "medium"
      ? "bg-amber-400/15 text-amber-200 border border-amber-400/40"
      : level === "error"
      ? "bg-slate-500/20 text-slate-200 border border-slate-500/40"
      : "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
      {level}
    </span>
  );
}

export default function TenderGuardDashboard() {
  const router = useRouter();
  const supabaseClient = supabase ?? getSupabaseClient();
  const [email, setEmail] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  const [singleQuery, setSingleQuery] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<LookupResponse | null>(null);

  const [bulkInput, setBulkInput] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkLookupResult[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!supabaseClient) {
        setConfigError(
          "Supabase is not configured. Add env vars to enable dashboard access."
        );
        setCheckingAccess(false);
        return;
      }

      const { data } = await supabaseClient.auth.getUser();

      if (!data.user?.email) {
        router.replace("/login");
        return;
      }

      const userEmail = data.user.email;
      setEmail(userEmail);

      const { data: subs, error: subsError } = await supabaseClient
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
        (!sub.current_period_end || new Date(sub.current_period_end) > now);

      if (!active) {
        router.replace("/");
        return;
      }

      setHasAccess(true);
      setCheckingAccess(false);
    };

    run();
  }, [router, supabaseClient]);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError(null);
    setSingleResult(null);

    if (!singleQuery.trim()) {
      setSingleError("Enter a DOT or MC number to run a TenderGuard check.");
      return;
    }

    setSingleLoading(true);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: singleQuery,
          email,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Lookup failed.");
      }

      setSingleResult(json as LookupResponse);
    } catch (err: any) {
      console.error(err);
      setSingleError(err.message || "Lookup failed.");
    } finally {
      setSingleLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError(null);
    setBulkResults([]);

    const values = bulkInput
      .split(/\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);

    if (values.length === 0) {
      setBulkError("Paste up to 100 DOT or MC numbers (one per line).");
      return;
    }

    setBulkLoading(true);

    try {
      const res = await fetch("/api/bulk-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, email }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Bulk lookup failed.");
      }

      setBulkResults((json as { results: BulkLookupResult[] }).results);
    } catch (err: any) {
      console.error(err);
      setBulkError(err.message || "Bulk lookup failed.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabaseClient) {
      console.warn("Supabase is not configured. Add env vars to enable auth.");
      return;
    }

    await supabaseClient.auth.signOut();
    router.replace("/");
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Checking access…</p>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          <p className="text-lg font-semibold">Dashboard unavailable</p>
          <p className="text-sm text-slate-400">{configError}</p>
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                TenderGuard
              </p>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Black Vault Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              href="/app/history"
              className="rounded-full border border-slate-700 px-4 py-2 hover:bg-slate-800 transition"
            >
              History
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-slate-700 px-4 py-2 hover:bg-slate-800 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-cyan-500/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-base sm:text-lg font-medium">
                  Paste carrier MC or DOT numbers to run TenderGuard checks.
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-time FMCSA/SAFER data. Every lookup is logged as an audit
                  receipt.
                </p>
              </div>
              {email && (
                <div className="text-[11px] sm:text-xs text-slate-500">
                  Signed in as <span className="font-mono text-slate-200">{email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm mb-4">
              <button
                onClick={() => setActiveTab("single")}
                className={`rounded-full px-4 py-2 border transition ${
                  activeTab === "single"
                    ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                Single lookup
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`rounded-full px-4 py-2 border transition ${
                  activeTab === "bulk"
                    ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                Bulk lookup
              </button>
            </div>

            {activeTab === "single" ? (
              <form onSubmit={handleSingleSubmit} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={singleQuery}
                    onChange={(e) => setSingleQuery(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-base outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 transition"
                    placeholder="e.g., MC 123456 or DOT 789012"
                  />
                  <button
                    type="submit"
                    disabled={singleLoading}
                    className="sm:min-w-[150px] rounded-xl bg-cyan-500 text-slate-950 font-semibold px-5 py-3 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {singleLoading ? "Checking…" : "Run check"}
                  </button>
                </div>

                {singleError && (
                  <p className="text-sm text-red-400">{singleError}</p>
                )}
              </form>
            ) : (
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500 transition font-mono"
                  placeholder="One DOT/MC per line (max 100)"
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-400">
                    We&apos;ll run each through TenderGuard and log the results.
                  </p>
                  <button
                    type="submit"
                    disabled={bulkLoading}
                    className="sm:min-w-[180px] rounded-xl bg-cyan-500 text-slate-950 font-semibold px-5 py-3 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {bulkLoading ? "Running…" : "Run bulk check"}
                  </button>
                </div>
                {bulkError && <p className="text-sm text-red-400">{bulkError}</p>}
              </form>
            )}
          </div>

          {activeTab === "single" && singleResult && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-cyan-500/10 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {singleResult.carrierName || "Carrier found"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    DOT {singleResult.dotNumber || "—"}
                    {singleResult.mcNumber && <> · MC {singleResult.mcNumber}</>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge level={singleResult.riskLevel} />
                  <span className="text-sm text-slate-300 font-semibold">
                    Risk score: {singleResult.riskScore}
                  </span>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-400">Operating status</dt>
                  <dd className="font-medium">
                    {singleResult.authorityStatus || "Unknown"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Insurance status</dt>
                  <dd className="font-medium">
                    {singleResult.insuranceStatus || "Unknown"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">DOT number</dt>
                  <dd className="font-medium">{singleResult.dotNumber || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">MC / Docket</dt>
                  <dd className="font-medium">{singleResult.mcNumber || "—"}</dd>
                </div>
              </dl>

              <p className="mt-6 text-xs text-slate-500">
                FMCSA/SAFER data is used as-is. TenderGuard provides signals and
                scoring only and does not replace your own internal carrier
                vetting process.
              </p>
            </div>
          )}

          {activeTab === "bulk" && bulkResults.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-cyan-500/10 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold">Bulk results</h2>
                <p className="text-xs text-slate-400">Showing {bulkResults.length} carriers</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-slate-900/80 text-slate-400">
                    <tr className="text-left">
                      <th className="px-3 py-2">Carrier</th>
                      <th className="px-3 py-2">DOT</th>
                      <th className="px-3 py-2">MC</th>
                      <th className="px-3 py-2">Authority</th>
                      <th className="px-3 py-2">Insurance</th>
                      <th className="px-3 py-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkResults.map((r, idx) => (
                      <tr
                        key={`${r.dotNumber}-${r.mcNumber}-${idx}`}
                        className="border-t border-slate-800/60 hover:bg-slate-900/80"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <RiskBadge level={r.riskLevel} />
                            <span>{r.carrierName || "—"}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{r.dotNumber || "—"}</td>
                        <td className="px-3 py-2 font-mono text-xs">{r.mcNumber || "—"}</td>
                        <td className="px-3 py-2">{r.authorityStatus}</td>
                        <td className="px-3 py-2">{r.insuranceStatus}</td>
                        <td className="px-3 py-2 font-semibold">{r.riskScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                All bulk checks are logged to your audit history automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-800 px-4 sm:px-6 py-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
