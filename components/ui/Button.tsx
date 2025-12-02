import React from "react";
import { cn } from "./utils";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-400 focus-visible:ring-offset-0";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-aurora-500 via-emerald-400 to-rose-400 text-midnight shadow-glow",
  ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
  outline: "border border-white/20 text-white hover:border-white/40 hover:bg-white/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild,
  children,
  ...props
}: ButtonProps) {
  const combined = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn((children as React.ReactElement).props.className, combined),
    });
  }

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
}
