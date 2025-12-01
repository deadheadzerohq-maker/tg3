"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiActivity, FiBookOpen, FiHome, FiLayers, FiSearch, FiSettings } from "react-icons/fi";
import { SignOutButton } from "../auth/SignOutButton";

const navItems = [
  { href: "/app", label: "Dashboard", icon: FiHome },
  { href: "/app/deep-search", label: "Deep Search", icon: FiSearch },
  { href: "/app/carriers", label: "Carriers", icon: FiLayers },
  { href: "/app/monitoring", label: "Monitoring", icon: FiActivity },
  { href: "/app/history", label: "History", icon: FiBookOpen },
  { href: "/app/account", label: "Account & Billing", icon: FiSettings },
];

export function Sidebar({ email, firstName }: { email: string; firstName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-900/60 bg-slate-950/80 px-5 py-6 backdrop-blur">
      <div className="flex items-center gap-2 pb-8">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-glow" />
        <div>
          <p className="text-lg font-semibold text-slate-50 leading-tight">TenderGuard</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">by Deadhead Zero Logistics</p>
        </div>
      </div>

      <nav className="space-y-2 text-sm">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${
                active
                  ? "border-cyan-500/70 bg-cyan-500/10 text-cyan-100 shadow-glow"
                  : "border-slate-900 bg-slate-900/60 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signed in</p>
          <p className="font-semibold text-slate-50">{firstName}</p>
          <p className="text-xs text-slate-400 truncate">{email}</p>
        </div>
        <SignOutButton className="w-full justify-center" />
      </div>
    </aside>
  );
}
