"use client";

import { useMemo, useState } from "react";
import { RiskDonut } from "../charts/RiskDonut";
import { FiClipboard, FiExternalLink, FiSearch } from "react-icons/fi";

export type LookupRow = {
  id: string;
  carrier_name: string | null;
  dot_number: string | null;
  mc_number: string | null;
  authority_status: string | null;
  insurance_status: string | null;
  risk_score: number | null;
  risk_level: string | null;
  created_at: string;
};

export type LookupResult = {
  carrierName: string;
  dotNumber: string;
  mcNumber: string;
  authorityStatus: string;
  insuranceStatus: string;
  riskScore: number;
  riskLevel: string;
};

type Props = {
  greetingName: string;
  recentLookups: LookupRow[];
  stats: { total: number; low: number; medium: number; high: number };
};

const today = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

export function DashboardClient({ greetingName, recentLookups, stats }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [rows, setRows] = useState(recentLookups);

  const chartData = useMemo(
    () => [
      { label: "Low", value: stats.low, key: "low" as const },
      { label: "Medium", value: stats.medium, key: "medium" as const },
      { label: "High", value: stats.high, key: "high" as const },
    ],
    [stats]
  );

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!value.trim()) {
      setError("Enter a carrier MC or DOT number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Lookup failed");
      }
      const payload: LookupResult = json;
      setResult(payload);
      setRows((prev) => [
        {
          id: crypto.randomUUID(),
          carrier_name: payload.carrierName,
          dot_number: payload.dotNumber,
          mc_number: payload.mcNumber,
          authority_status: payload.authorityStatus,
          insurance_status: payload.insuranceStatus,
          risk_score: payload.riskScore,
          risk_level: payload.riskLevel,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await navigator.clipboard.writeText(`${url}/app`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">{today}</p>
          <h1 className="text-3xl font-semibold text-slate-50">Good afternoon, {greetingName}!</h1>
        </div>
        <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 shadow-inner">
          <FiSearch className="h-4 w-4 text-cyan-300" />
          <form className="flex w-full items-center gap-2" onSubmit={handleLookup}>
            <input
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="Enter carrier's MC or DOT Number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Run TenderGuard check"}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Verify Your Carriers</p>
          <h2 className="text-xl font-semibold">Start every tender with confidence</h2>
          <p className="text-sm text-slate-400">
            Paste MC or DOT numbers and we will log the authority, insurance, and a TenderGuard risk score so you can prove due diligence to every shipper.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/60 bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-100 shadow-glow"
            >
              <FiClipboard className="h-4 w-4" /> Copy onboarding link
            </button>
            <a
              href="/app/deep-search"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-slate-200 hover:border-cyan-400"
            >
              <FiExternalLink className="h-4 w-4" /> Open bulk checker
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Onboarding State</p>
              <h3 className="text-xl font-semibold">{stats.total} Checked Carriers</h3>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Low risk: {stats.low}</p>
              <p>Medium: {stats.medium}</p>
              <p>High: {stats.high}</p>
            </div>
          </div>
          <RiskDonut data={chartData} />
        </div>
      </div>

      {result && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Carrier Summary</p>
              <h3 className="text-2xl font-semibold">{result.carrierName}</h3>
              <p className="text-sm text-slate-400">DOT {result.dotNumber} · MC {result.mcNumber}</p>
            </div>
            <div className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              {result.riskLevel.toUpperCase()} · {result.riskScore}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-slate-400">Authority</p>
              <p className="text-lg font-semibold">{result.authorityStatus}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-slate-400">Insurance</p>
              <p className="text-lg font-semibold">{result.insuranceStatus}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent carriers</p>
            <h3 className="text-xl font-semibold">Audit-ready lookups</h3>
          </div>
          <a className="text-sm text-cyan-200 hover:text-cyan-100" href="/app/history">
            View history
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr className="text-left">
                <th className="px-3 py-2">Carrier</th>
                <th className="px-3 py-2">DOT</th>
                <th className="px-3 py-2">MC</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Authority</th>
                <th className="px-3 py-2">Insurance</th>
                <th className="px-3 py-2">Checked</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-800/60 hover:bg-slate-950/40">
                  <td className="px-3 py-2 text-slate-100">{row.carrier_name || "Unknown"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.dot_number || "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.mc_number || "—"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.risk_level === "high"
                          ? "bg-red-500/15 text-red-200 border border-red-500/40"
                          : row.risk_level === "medium"
                          ? "bg-amber-500/15 text-amber-200 border border-amber-500/40"
                          : "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
                      }`}
                    >
                      {row.risk_score ?? "—"} {row.risk_level ? `· ${row.risk_level}` : ""}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-200">{row.authority_status || "—"}</td>
                  <td className="px-3 py-2 text-slate-200">{row.insurance_status || "—"}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                    No lookups yet. Run your first TenderGuard check.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
