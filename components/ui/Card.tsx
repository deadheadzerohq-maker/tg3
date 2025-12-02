import { cn } from "./utils";
import { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("card-backdrop rounded-2xl p-6 relative overflow-hidden", className)}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
