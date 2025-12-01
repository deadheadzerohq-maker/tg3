import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "TenderGuard",
  description: "Unlimited automated carrier vetting for freight brokers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>{children}</div>

        <footer
          style={{
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            padding: "16px 24px",
            fontSize: 13,
            backgroundColor: "#0f172a",
            color: "#94a3b8",
            textAlign: "center"
          }}
        >
          <div style={{ marginBottom: 10, display: "flex", justifyContent: "center", gap: 18 }}>
            <Link href="/terms" style={{ textDecoration: "underline", opacity: 0.9 }}>
              Terms of Service
            </Link>
            <Link href="/privacy" style={{ textDecoration: "underline", opacity: 0.9 }}>
              Privacy Policy
            </Link>
          </div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>
            Technology platform only — not a freight broker, not a money transmitter.
            We never hold freight payments.
            <br />
            Operated by Deadhead Zero Logistics LLC
          </div>
        </footer>
      </body>
    </html>
  );
}
