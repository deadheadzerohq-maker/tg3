import { CheckoutButton } from "@/components/app/CheckoutButton";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function UpgradePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-card shadow-cyan-500/10 space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Subscription required</p>
        <h1 className="text-3xl font-semibold">Upgrade to TenderGuard</h1>
        <p className="text-sm text-slate-300">
          TenderGuard access requires an active subscription. Activate the $399/mo plan to unlock Deep Search, monitoring, and bulk checks for your brokerage team.
        </p>
        <div className="pt-2">
          <CheckoutButton />
        </div>
      </div>
    </main>
  );
}
