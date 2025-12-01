"use client";

import { useState } from "react";

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
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runLookup = async () => {
    setError(null);
    setResult(null);

    if (!inputValue.trim()) {
      setError("Enter an MC or DOT number.");
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>TenderGuard Dashboard</h1>
      <p style={{ marginBottom: 16 }}>
        Enter a carrier MC or DOT number to run a risk check. (In v1 this will be limited to active subscribers.)
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
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            minWidth: 140
          }}
        >
          {loading ? "Checking..." : "Run check"}
        </button>
      </div>

      {error && <p style={{ color: "#f97373", marginBottom: 12 }}>{error}</p>}

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
