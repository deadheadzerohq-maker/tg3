import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid gap-8 md:grid-cols-5 text-sm text-white/70">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-aurora-500 via-emerald-400 to-rose-400" />
            <div>
              <p className="font-semibold text-white">Deadhead Zero</p>
              <p className="text-xs text-white/50">Deadhead Zero Logistics LLC</p>
            </div>
          </div>
          <p className="text-sm text-white/60 max-w-xl">
            Technology platform only — models freight corridors as a health index. Not a freight broker and never a money transmitter.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Status: 99.9% uptime</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Changelog: weekly</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Alerts: email + SMS</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-white font-semibold">Product</h4>
          <ul className="space-y-1">
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link href="/alerts" className="hover:text-white">Alerts</Link></li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-white font-semibold">Company</h4>
          <ul className="space-y-1">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-white font-semibold">Contact</h4>
          <Link href="mailto:info@deadheadzero.com" className="text-white/60 hover:text-white">
            info@deadheadzero.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
