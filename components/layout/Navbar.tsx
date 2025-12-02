"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Platform" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 nav-blur border-b border-white/5 bg-midnight/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-aurora-400 via-emerald-400 to-rose-400 glow-ring flex items-center justify-center text-midnight font-black">
            IP
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">InfraPulse™</p>
            <p className="text-xs text-white/60">Corridor Health Intelligence</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm text-white/70">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-full transition hover:text-white ${
                  active
                    ? "bg-white/10 text-white border border-white/10"
                    : "border border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild>
              <Link href="/register">Start InfraPulse</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
