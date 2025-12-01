import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");

  const { data: rows } = await supabase
    .from("lookups")
    .select(
      "id, created_at, input_value, carrier_name, dot_number, mc_number, risk_score, risk_level"
    )
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <main className="px-4 py-8 md:px-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">History</p>
          <h1 className="text-3xl font-semibold">Lookup audit log</h1>
          <p className="text-sm text-slate-400">Every TenderGuard check your team has run.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/70 shadow-card shadow-cyan-500/10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950/40 text-slate-400">
            <tr className="text-left">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Input</th>
              <th className="px-4 py-3">Carrier</th>
              <th className="px-4 py-3">DOT</th>
              <th className="px-4 py-3">MC</th>
              <th className="px-4 py-3">Risk</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r) => (
              <tr key={r.id} className="border-t border-slate-800/60 hover:bg-slate-950/50">
                <td className="px-4 py-2 text-slate-400">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 font-mono text-xs">{r.input_value}</td>
                <td className="px-4 py-2">{r.carrier_name || "—"}</td>
                <td className="px-4 py-2">{r.dot_number || "—"}</td>
                <td className="px-4 py-2">{r.mc_number || "—"}</td>
                <td className="px-4 py-2">{r.risk_score != null ? `${r.risk_score} (${r.risk_level})` : "—"}</td>
              </tr>
            ))}
            {(rows || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No lookups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
