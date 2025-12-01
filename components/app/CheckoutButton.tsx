"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const startCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    setLoading(false);
    if (json.url) {
      window.location.href = json.url as string;
    }
  };
  return (
    <button
      onClick={startCheckout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow hover:bg-cyan-400 disabled:opacity-60"
    >
      {loading ? "Redirecting..." : "Start TenderGuard – $399/mo"}
    </button>
  );
}
