"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSupabaseClient } from "@/lib/supabaseClient";

type LookupRow = {
  id: string;
  created_at: string;
  input_value: string;
  carrier_name: string | null;
  dot_number: string | null;
  mc_number: string | null;
  risk_score: number | null;
  risk_level: string | null;
};

export default function HistoryPage() {
  const router = useRouter();
  const supabaseClient = supabase ?? getSupabaseClient();
  const [email, setEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<LookupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!supabaseClient) {
        setConfigError("Supabase is not configured. Add env vars to view history.");
        setLoading(false);
        return;
      }

      const { data } = await supabaseClient.auth.getUser();
      if (!data.user?.email) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email);

      const { data: lookups, error } = await supabaseClient
        .from("lookups")
        .select(
          "id, created_at, input_value, carrier_name, dot_number, mc_number, risk_score, risk_level"
        )
        .eq("email", data.user.email)
        .order("created_at", { ascending: false })
        .limit(200);

      if (!error && lookups) {
        setRows(lookups as LookupRow[]);
      }
      setLoading(false);
    };

    run();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading history…</p>
      </main>
    );
  }

  if (configError) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          <p className="text-lg font-semibold">History unavailable</p>
          <p className="text-sm text-slate-400">{configError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Lookup history</h1>
            <p className="text-xs text-slate-400 mb-6">
              Every TenderGuard check is logged here as your audit trail.
            </p>
          </div>
          {email && (
            <p className="text-xs text-slate-500">
              Signed in as <span className="font-mono text-slate-200">{email}</span>
            </p>
          )}
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/70">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-slate-900/80">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3">Carrier</th>
                <th className="px-4 py-3">DOT</th>
                <th className="px-4 py-3">MC</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-slate-800/70 hover:bg-slate-900/80"
                >
                  <td className="px-4 py-2 text-slate-400">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {r.input_value}
                  </td>
                  <td className="px-4 py-2">{r.carrier_name || "—"}</td>
                  <td className="px-4 py-2">{r.dot_number || "—"}</td>
                  <td className="px-4 py-2">{r.mc_number || "—"}</td>
                  <td className="px-4 py-2">
                    {r.risk_score != null ? `${r.risk_score} (${r.risk_level})` : "—"}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No lookups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
