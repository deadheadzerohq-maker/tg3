import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "TenderGuard",
  description: "Unlimited carrier vetting for freight brokers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
        <footer
          style={{
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            padding: "16px 24px",
            fontSize: 12,
            backgroundColor: "#020617"
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap"
              }}
            >
              <Link href="/terms" style={{ textDecoration: "underline" }}>
                Terms of Service
              </Link>
              <Link href="/privacy" style={{ textDecoration: "underline" }}>
                Privacy Policy
              </Link>
            </div>
            <div style={{ opacity: 0.7 }}>
              <div>
                Technology platform only, not a broker or load board. We never hold freight dollars.
              </div>
              <div>Operated by Deadhead Zero Logistics LLC</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
