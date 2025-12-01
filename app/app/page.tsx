"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

type LookupResult = {
  carrierName: string;
  mcNumber: string | null;
  dotNumber: string | null;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  authorityStatus: string;
  insuranceStatus: string;
  details: any;
};

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [subscriptionOk, setSubscriptionOk] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1) Check Supabase auth + subscription
  useEffect(() => {
    const check = async () => {
      try {
        const {
          data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user || !user.email) {
          router.replace("/login");
          return;
        }

        setUserEmail(user.email);

        const { data, error } = await supabaseClient
          .from("subscribers")
          .select("status, current_period_end")
          .eq("email", user.email)
          .maybeSingle();

        if (error) {
          console.error("Error checking subscribers:", error);
          setSubscriptionOk(false);
        } else if (!data) {
          setSubscriptionOk(false);
        } else {
          setSubscriptionOk(data.status === "active");
        }
      } catch (err) {
        console.error(err);
        setSubscriptionOk(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    check();
  }, [router]);

  const runLookup = async () => {
    setError(null);
    setResult(null);

    if (!inputValue.trim()) {
      setError("Enter an MC or DOT number.");
      return;
    }

    setLoadingLookup(true);
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: inputValue.trim() })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || "Lookup failed");
      }

      const data = (await res.json()) as LookupResult;
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Lookup failed");
    } finally {
      setLoadingLookup(false);
    }
  };

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.replace("/login");
  };

  // Loading state while we check auth + subscription
  if (checkingAccess) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <p>Checking access…</p>
      </main>
    );
  }

  // Logged in but no active subscription
  if (subscriptionOk === false) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Subscription required</h1>
        <p style={{ maxWidth: 420, opacity: 0.8 }}>
          We couldn&apos;t find an active TenderGuard subscription for{" "}
          <strong>{userEmail}</strong>. Make sure you use the same email you used
          at checkout, or start a new subscription from the homepage.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#06b6d4",
              color: "#020617",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Go to homepage
          </button>
          <button
            onClick={handleSignOut}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid #4b5563",
              backgroundColor: "transparent",
              color: "#e5e7eb",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  // Otherwise: access granted
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>TenderGuard Dashboard</h1>
          <p style={{ opacity: 0.8, fontSize: 13 }}>
            Logged in as <strong>{userEmail}</strong>
          </p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid #4b5563",
            backgroundColor: "transparent",
            color: "#e5e7eb",
            fontSize: 13,
            cursor: "pointer"
          }}
        >
          Sign out
        </button>
      </header>

      <p style={{ marginBottom: 16 }}>
        Paste a carrier MC or DOT number to run a TenderGuard check.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., MC 123456 or DOT 789012"
          style={{
            flex: "1 1 220px",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #4b5563",
            backgroundColor: "#020617",
            color: "#f9fafb",
            minWidth: 0
          }}
        />
        <button
          onClick={runLookup}
          disabled={loadingLookup}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            minWidth: 140,
            backgroundColor: "#06b6d4",
            color: "#020617"
          }}
        >
          {loadingLookup ? "Checking..." : "Run check"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#f97373", marginBottom: 12, fontSize: 13 }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 8,
            border: "1px solid #4b5563",
            backgroundColor: "#020617"
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>{result.carrierName}</h2>
          <p>MC: {result.mcNumber || "N/A"}</p>
          <p>DOT: {result.dotNumber || "N/A"}</p>
          <p>Authority: {result.authorityStatus}</p>
          <p>Insurance: {result.insuranceStatus}</p>
          <p>
            Risk: <strong>{result.riskScore}</strong> ({result.riskLevel})
          </p>
        </div>
      )}
    </main>
  );
}
