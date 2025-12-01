"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { FiLogOut } from "react-icons/fi";

const supabase = createSupabaseBrowserClient();

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition ${className}`}
      disabled={loading}
    >
      <FiLogOut className="h-4 w-4" />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
