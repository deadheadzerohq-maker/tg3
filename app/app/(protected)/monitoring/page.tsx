import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function MonitoringPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const { data: lookups } = await supabase
    .from("lookups")
    .select("dot_number")
    .eq("user_id", userId)
    .limit(500);

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id, carrier_name, dot_number, mc_number, alert_type, alert_message, resolved, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const distinctDots = new Set((lookups || []).map((l) => l.dot_number).filter(Boolean) as string[]);

  return (
    <main className="px-4 py-8 md:px-8 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Monitoring</p>
        <h1 className="text-3xl font-semibold">Status & future alerts</h1>
        <p className="text-sm text-slate-400">
          Monitoring hooks into your lookup history. Future Supabase Edge Functions can re-run authority and insurance daily and write alerts here.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-card shadow-cyan-500/10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Carriers checked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-50">{distinctDots.size}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-card shadow-cyan-500/10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Alerts</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{alerts?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-card shadow-cyan-500/10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Automation</p>
          <p className="mt-2 text-sm text-slate-300">
            Suggestion: a Supabase Edge Function can re-run checks nightly and insert alerts when authority or insurance downgrades.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Alerts</h2>
          <p className="text-xs text-slate-400">Showing most recent events</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950/40 text-slate-400">
              <tr className="text-left">
                <th className="px-3 py-2">Carrier</th>
                <th className="px-3 py-2">DOT</th>
                <th className="px-3 py-2">MC</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(alerts || []).map((a) => (
                <tr key={a.id} className="border-t border-slate-800/60 hover:bg-slate-950/50">
                  <td className="px-3 py-2 text-slate-100">{a.carrier_name || "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{a.dot_number || "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{a.mc_number || "—"}</td>
                  <td className="px-3 py-2 capitalize">{a.alert_type}</td>
                  <td className="px-3 py-2 text-slate-200">{a.alert_message}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{new Date(a.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.resolved
                          ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40"
                          : "bg-amber-500/15 text-amber-200 border border-amber-400/40"
                      }`}
                    >
                      {a.resolved ? "Resolved" : "Open"}
                    </span>
                  </td>
                </tr>
              ))}
              {(alerts || []).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                    No alerts yet. Future automated checks will populate this table.
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
