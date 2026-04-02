"use client";

import { cn } from "@betday/lib";
import { ReactNode } from "react";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
  iconOff?: ReactNode;
  iconOn?: ReactNode;
};

export function Switch({
  checked,
  onChange,
  disabled = false,
  className = "",
  ariaLabel,
  size = "md",
  iconOff,
  iconOn,
}: SwitchProps) {
  const sizeClasses = {
    sm: "w-11 h-6",
    md: "w-16 h-8",
    lg: "w-20 h-10",
  };

  const thumbSizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
  };

  const thumbTranslateClasses = {
    sm: "translate-x-5",
    md: "translate-x-8",
    lg: "translate-x-10",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out",
        sizeClasses[size],
        checked
          ? "bg-brand-primary border-brand-primary/70"
          : "bg-surface-tertiary border-line-secondary",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {/* Thumb - white circle that slides */}
      <span
        className={cn(
          "pointer-events-none absolute left-0.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white ring-1 shadow-md transition-transform duration-200 ease-in-out",
          thumbSizeClasses[size],
          checked ? "ring-brand-primary/45" : "ring-line-secondary",
          checked ? thumbTranslateClasses[size] : "translate-x-0",
        )}
      >
        {((checked && iconOn) || (!checked && iconOff)) && (
          <span
            className={cn(
              "inline-flex items-center justify-center",
              iconSizeClasses[size],
              checked ? "text-brand-primary" : "text-zinc-700",
            )}
          >
            {checked ? iconOn : iconOff}
          </span>
        )}
      </span>
    </button>
  );
}
