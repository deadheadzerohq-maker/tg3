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
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          gap: 32
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 40,
              lineHeight: 1.1,
              marginBottom: 8
            }}
          >
            Deadhead Zero Logistics
          </h1>
          <p style={{ opacity: 0.8, maxWidth: 520 }}>
            A technology platform focused on eliminating empty miles and protecting freight brokers from carrier risk.
          </p>
        </div>

        <section
          style={{
            maxWidth: 520,
            padding: 24,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0.92) 60%, rgba(15,23,42,0.85) 100%)",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(56, 189, 248, 0.25)"
          }}
        >
          <h2 style={{ fontSize: 28, marginBottom: 12 }}>TenderGuard</h2>
          <p style={{ marginBottom: 20 }}>
            Unlimited carrier vetting for freight brokers. Paste a DOT or MC number and get an instant risk score,
            authority status, and insurance check.
          </p>
          <button
            onClick={startCheckout}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              minWidth: 240
            }}
          >
            {loading ? "Redirecting..." : "Start TenderGuard for $399/mo"}
          </button>
          {error && (
            <p style={{ marginTop: 12, color: "#f97373", fontSize: 13 }}>
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
