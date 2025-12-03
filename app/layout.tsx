import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://deadheadzero.com"),
  title: "Deadhead Zero | Freight Corridor Health & Disruption Intelligence",
  description:
    "Deadhead Zero models U.S. freight corridors as a live health index with AI-powered disruption forecasting. Technology platform only; not a freight broker or money transmitter.",
  alternates: {
    canonical: "https://deadheadzero.com",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="bg-midnight text-white min-h-screen">
        <div className="fixed inset-0 -z-10 opacity-60 bg-grid [background-size:32px_32px]" />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
