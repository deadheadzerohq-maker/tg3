"use client";

import { useState } from "react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    const res = await fetch("/api/create-portal-session", { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (json.url) {
      window.location.href = json.url as string;
    }
  };

  return (
    <button
      onClick={openPortal}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/60 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-glow hover:bg-cyan-500/20 disabled:opacity-60"
    >
      {loading ? "Opening..." : "Manage billing"}
    </button>
  );
}
