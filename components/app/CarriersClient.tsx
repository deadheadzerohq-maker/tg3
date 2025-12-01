"use client";

import { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";

export type CarrierRow = {
  carrierName: string;
  dot: string;
  mc: string;
  lastRiskScore: number | null;
  lastRiskLevel: string | null;
  lastChecked: string;
  count: number;
};

type Props = { carriers: CarrierRow[] };

export function CarriersClient({ carriers }: Props) {
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return carriers;
    return carriers.filter((c) => c.lastRiskLevel === filter);
  }, [filter, carriers]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FiFilter className="h-4 w-4" />
          Filter risk
        </div>
        {["all", "low", "medium", "high"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl as any)}
            className={`rounded-full border px-3 py-1.5 text-sm capitalize transition ${
              filter === lvl
                ? "border-cyan-400 bg-cyan-500/10 text-cyan-100"
                : "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-400"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/70 shadow-card shadow-cyan-500/10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950/40 text-slate-400">
            <tr className="text-left">
              <th className="px-4 py-3">Carrier</th>
              <th className="px-4 py-3">DOT</th>
              <th className="px-4 py-3">MC</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Checks</th>
              <th className="px-4 py-3">Last checked</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.dot} className="border-t border-slate-800/60 hover:bg-slate-950/50">
                <td className="px-4 py-3 text-slate-100">{c.carrierName || "Unknown"}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.dot}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.mc}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      c.lastRiskLevel === "high"
                        ? "bg-red-500/15 text-red-200 border border-red-500/40"
                        : c.lastRiskLevel === "medium"
                        ? "bg-amber-500/15 text-amber-200 border border-amber-500/40"
                        : "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
                    }`}
                  >
                    {c.lastRiskScore ?? "—"} {c.lastRiskLevel ? `· ${c.lastRiskLevel}` : ""}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-200">{c.count}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(c.lastChecked).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No carriers match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
