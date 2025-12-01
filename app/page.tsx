"use client";

import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || "Failed to start checkout");
      }

      const data = await res.json();
      if ((data as any).url) {
        window.location.href = (data as any).url as string;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 16px",
        backgroundColor: "#020617"
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 12,
            color: "#06b6d4"
          }}
        >
          Deadhead Zero Logistics
        </h1>

        <p style={{ opacity: 0.8, marginBottom: 32 }}>
          AI-powered carrier vetting for freight brokers. One price. Unlimited checks. 100% automated.
        </p>

        <section
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0.92) 60%, rgba(15,23,42,0.85) 100%)",
            padding: 24,
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(6, 182, 212, 0.4)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            marginBottom: 24
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
            TenderGuard
          </h2>

          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 20 }}>
            Unlimited carrier safety & compliance lookups using real FMCSA/SAFER signals.
            No scraping. No manual work. Just paste a DOT or MC number.
          </p>

          <button
            onClick={startCheckout}
            disabled={loading}
            style={{
              background: "#06b6d4",
              color: "#020617",
              padding: "12px 24px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              minWidth: 260
            }}
          >
            {loading ? "Redirecting..." : "Start TenderGuard — $399/mo"}
          </button>

          {error && (
            <p style={{ marginTop: 12, color: "#f87171", fontSize: 13 }}>
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
