"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }

    setStatus("sending");
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/app`
          : undefined;

      const { error } = await supabaseClient.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) throw error;

      setStatus("sent");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send login link.");
      setStatus("error");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.4)",
          backgroundColor: "#0f172a",
          boxShadow: "0 18px 45px rgba(15,23,42,0.9)"
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            color: "#e5e7eb"
          }}
        >
          Sign in to TenderGuard
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 18 }}>
          Use the same email you used at checkout. We&apos;ll send you a secure
          login link.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{
              fontSize: 13,
              display: "block",
              marginBottom: 6,
              opacity: 0.9
            }}
          >
            Work email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              fontSize: 14,
              marginBottom: 12
            }}
          />

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#06b6d4",
              color: "#020617",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 4
            }}
          >
            {status === "sending" ? "Sending link..." : "Send magic link"}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: 10, color: "#f97373", fontSize: 13 }}>{error}</p>
        )}

        {status === "sent" && (
          <p style={{ marginTop: 10, color: "#4ade80", fontSize: 13 }}>
            Check your email for a login link. After clicking it, you&apos;ll be
            redirected to your TenderGuard dashboard.
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            marginTop: 16,
            background: "transparent",
            border: "none",
            color: "#93c5fd",
            fontSize: 13,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          ← Back to homepage
        </button>
      </div>
    </main>
  );
}
