import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TenderGuard | Deadhead Zero Logistics LLC",
  description: "TenderGuard delivers automated carrier vetting, monitoring, and billing.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="fixed inset-0 pointer-events-none bg-grid-radial" aria-hidden />
        <div className="relative min-h-screen flex flex-col">
          {children}
          <footer className="mt-auto border-t border-slate-800/60 bg-slate-950/70 px-6 py-5 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex gap-4">
              <a href="/terms" className="hover:text-slate-200 underline underline-offset-4">
                Terms of Service
              </a>
              <a href="/privacy" className="hover:text-slate-200 underline underline-offset-4">
                Privacy Policy
              </a>
            </div>
            <p className="text-[11px] leading-relaxed">
              TenderGuard is operated by Deadhead Zero Logistics LLC. Technology platform only — not a freight broker or load board. We never hold freight dollars.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
