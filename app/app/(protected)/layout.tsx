import { Sidebar } from "@/components/layout/Sidebar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const email = session?.user.email ?? "user@tenderguard";
  const userId = session!.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("status")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const status = subscriber?.status ?? "inactive";
  const isPaid = status === "active" || status === "trialing";

  if (!isPaid) {
    redirect("/app/upgrade");
  }

  const firstName = profile?.first_name || email.split("@")[0] || "TenderGuard user";

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar email={email} firstName={firstName} />
      <div className="flex-1 bg-slate-950/80">{children}</div>
    </div>
  );
}
