import { ManageBillingButton } from "@/components/app/ManageBillingButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function AccountPage() {
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

  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const renewal = subscriber?.current_period_end
    ? new Date(subscriber.current_period_end).toLocaleDateString()
    : "Pending";

  return (
    <main className="px-4 py-8 md:px-8 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Account</p>
        <h1 className="text-3xl font-semibold">Billing & access</h1>
        <p className="text-sm text-slate-400">Manage your TenderGuard subscription.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10 space-y-2">
          <h2 className="text-lg font-semibold">User</h2>
          <p className="text-sm text-slate-300">{profile?.first_name || email.split("@")[0]}</p>
          <p className="text-sm text-slate-400">{email}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-card shadow-cyan-500/10 space-y-2">
          <h2 className="text-lg font-semibold">Plan</h2>
          <p className="text-slate-50 font-semibold">TenderGuard – $399/month</p>
          <p className="text-sm text-slate-400">Status: {subscriber?.status || "inactive"}</p>
          <p className="text-sm text-slate-400">Renews: {renewal}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ManageBillingButton />
        <SignOutButton />
      </div>
    </main>
  );
}
