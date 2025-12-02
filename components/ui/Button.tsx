import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-400 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-aurora-500 via-emerald-400 to-rose-400 text-midnight shadow-glow",
        ghost:
          "bg-white/5 text-white hover:bg-white/10 border border-white/10",
        outline:
          "border border-white/20 text-white hover:border-white/40 hover:bg-white/5",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
