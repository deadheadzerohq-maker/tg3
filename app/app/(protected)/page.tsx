import { DashboardClient, LookupRow } from "@/components/app/DashboardClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const email = session.user.email ?? "user@tenderguard";

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("user_id", userId)
    .maybeSingle();

  const greetingName = profile?.first_name || email.split("@")[0];

  const { data: recent } = await supabase
    .from("lookups")
    .select(
      "id, carrier_name, dot_number, mc_number, authority_status, insurance_status, risk_score, risk_level, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: riskRows } = await supabase
    .from("lookups")
    .select("risk_level")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(200);

  const stats = (riskRows || []).reduce(
    (acc, row) => {
      if (row.risk_level === "high") acc.high += 1;
      else if (row.risk_level === "medium") acc.medium += 1;
      else if (row.risk_level === "low") acc.low += 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, low: 0, medium: 0, high: 0 }
  );

  return (
    <main className="px-4 py-8 md:px-8">
      <DashboardClient
        greetingName={greetingName}
        recentLookups={(recent || []) as LookupRow[]}
        stats={stats}
      />
    </main>
  );
}
