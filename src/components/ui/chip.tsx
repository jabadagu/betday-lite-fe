import type { ButtonHTMLAttributes } from "react";
import { cn } from "@betday/lib";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ className, active = false, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
        active
          ? "border-brand-primary bg-brand-primary text-inverse"
          : "border-line-primary bg-surface-primary text-secondary hover:bg-surface-secondary hover:border-line-secondary",
        className,
      )}
      {...props}
    />
  );
}
