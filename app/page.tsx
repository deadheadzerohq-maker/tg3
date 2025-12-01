"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a Supabase session exists, send user straight to /app
  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await supabaseClient.auth.getUser();
        if (data.user) {
          router.replace("/app");
          return;
        }
      } catch (err) {
        console.error("Error checking session", err);
      } finally {
        setCheckingSession(false);
      }
    };

    check();
  }, [router]);

  const startCheckout = async () => {
    setError(null);
    setStartingCheckout(true);
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
      setStartingCheckout(false);
    }
  };

  // Optional: small “checking” state, but it will usually be very quick
  if (checkingSession) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          color: "#e5e7eb"
        }}
      >
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 16px 80px",
        backgroundColor: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          textAlign: "center"
        }}
      >
        <h1
          style={{
            fontSize: 48,
            lineHeight: 1.1,
            fontWeight: 800,
            marginBottom: 16,
            color: "#06b6d4"
          }}
        >
          Deadhead Zero Logistics
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#e5e7eb",
            opacity: 0.9,
            maxWidth: 640,
            margin: "0 auto 40px"
          }}
        >
          AI-powered carrier vetting for freight brokers. One price. Unlimited
          checks. 100% automated.
        </p>

        <section
          style={{
            margin: "0 auto",
            maxWidth: 800,
            padding: "32px 24px 28px",
            borderRadius: 24,
            background:
              "radial-gradient(circle at top, rgba(34,211,238,0.28), transparent 55%), #020617",
            boxShadow: "0 24px 80px rgba(8,145,178,0.6)",
            border: "1px solid rgba(56,189,248,0.35)"
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 12,
              color: "#f9fafb"
            }}
          >
            TenderGuard
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#e5e7eb",
              opacity: 0.9,
              maxWidth: 620,
              margin: "0 auto 24px"
            }}
          >
            Unlimited carrier safety &amp; compliance lookups using real FMCSA/SAFER
            signals. No scraping. No manual work. Just paste a DOT or MC number.
          </p>

          <button
            onClick={startCheckout}
            disabled={startingCheckout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 28px",
              borderRadius: 999,
              border: "2px solid #0ea5e9",
              backgroundColor: "#22d3ee",
              color: "#020617",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 12px 40px rgba(34,211,238,0.8)",
              minWidth: 260
            }}
          >
            {startingCheckout ? "Redirecting…" : "Start TenderGuard — $399/mo"}
          </button>

          {error && (
            <p
              style={{
                marginTop: 12,
                color: "#f97373",
                fontSize: 13
              }}
            >
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
