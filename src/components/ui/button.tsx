import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 ease-[var(--ease-out-quint)] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-400 hover:shadow-[0_0_32px_-8px_var(--color-accent-500)]",
  secondary:
    "border border-white/15 bg-white/5 text-ink-50 hover:border-white/30 hover:bg-white/10",
  ghost: "text-ink-200 hover:text-white",
} as const;

const sizes = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-13 px-8 text-[0.95rem]",
} as const;

type ButtonStyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonStyleProps & React.ComponentProps<"button">) {
  return (
    <button className={buttonClass({ variant, size, className })} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonStyleProps & React.ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass({ variant, size, className })} {...props} />
  );
}
