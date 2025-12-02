import { cn } from "./utils";

export function Badge({ label, tone = "default" }: { label: string; tone?: "default" | "positive" | "warning" | "critical" }) {
  const tones: Record<string, string> = {
    default: "bg-white/10 text-white border-white/20",
    positive: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    warning: "bg-amber-400/15 text-amber-100 border-amber-300/40",
    critical: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  };
  return (
    <span className={cn("px-3 py-1 text-xs font-semibold rounded-full border", tones[tone])}>
      {label}
    </span>
  );
}
