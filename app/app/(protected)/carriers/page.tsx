import { CarriersClient, CarrierRow } from "@/components/app/CarriersClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function CarriersPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const { data: lookups } = await supabase
    .from("lookups")
    .select(
      "dot_number, mc_number, carrier_name, risk_score, risk_level, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(200);

  const grouped = new Map<string, CarrierRow>();
  (lookups || []).forEach((l) => {
    if (!l.dot_number) return;
    const existing = grouped.get(l.dot_number);
    if (!existing) {
      grouped.set(l.dot_number, {
        carrierName: l.carrier_name || "Unknown Carrier",
        dot: l.dot_number,
        mc: l.mc_number || "—",
        lastRiskLevel: l.risk_level,
        lastRiskScore: l.risk_score,
        lastChecked: l.created_at,
        count: 1,
      });
    } else {
      existing.count += 1;
      existing.lastChecked = l.created_at;
      existing.lastRiskLevel = l.risk_level;
      existing.lastRiskScore = l.risk_score;
    }
  });

  return (
    <main className="px-4 py-8 md:px-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Carriers</p>
          <h1 className="text-3xl font-semibold">Roster & history</h1>
          <p className="text-sm text-slate-400">Grouped by DOT number with last known risk state.</p>
        </div>
      </div>

      <CarriersClient carriers={Array.from(grouped.values())} />
    </main>
  );
}
