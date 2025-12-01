"use client";

import { useState } from "react";
import { FiLoader, FiSearch } from "react-icons/fi";

type BulkResult = {
  carrierName: string | null;
  mcNumber: string | null;
  dotNumber: string | null;
  authorityStatus: string;
  insuranceStatus: string;
  riskScore: number;
  riskLevel: string;
  error?: string;
};

export default function DeepSearchPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkResult[]>([]);

  const runBulk = async () => {
    setError(null);
    setResults([]);
    const values = input
      .split(/\n|,/)
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 100);

    if (!values.length) {
      setError("Paste up to 100 MC or DOT numbers.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/bulk-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      setError(json.error || "Bulk lookup failed");
    } else {
      setResults(json.results || []);
    }
    setLoading(false);
  };

  return (
    <main className="px-4 py-8 md:px-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deep Search</p>
          <h1 className="text-3xl font-semibold">Bulk MC & DOT checks</h1>
          <p className="text-sm text-slate-400">
            Paste a list of carriers and run TenderGuard checks in one sweep. Every result is logged to history automatically.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
          placeholder="MC123456\nDOT987654\n1234567"
          rows={8}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          onClick={runBulk}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiSearch className="h-4 w-4" />}
          {loading ? "Running checks..." : "Run bulk TenderGuard check"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Results</h2>
            <p className="text-xs text-slate-400">{results.length} carriers processed</p>
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
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr key={`${r.dotNumber}-${idx}`} className="border-t border-slate-800/60 hover:bg-slate-950/40">
                    <td className="px-3 py-2">{r.carrierName || "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.dotNumber || "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.mcNumber || "—"}</td>
                    <td className="px-3 py-2">{r.riskScore} ({r.riskLevel})</td>
                    <td className="px-3 py-2">{r.authorityStatus}</td>
                    <td className="px-3 py-2">{r.insuranceStatus}</td>
                    <td className="px-3 py-2 text-slate-300">{r.error ? r.error : "ok"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
