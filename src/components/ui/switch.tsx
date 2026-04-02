"use client";

import { cn } from "@/lib/cn";
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
    sm: "w-8 h-5",
    md: "w-11 h-6",
    lg: "w-14 h-7",
  };

  const thumbSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const thumbTranslateClasses = {
    sm: "translate-x-3.5",
    md: "translate-x-5",
    lg: "translate-x-7",
  };

  const iconSizeClasses = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  };

  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out justify-start pl-1.5 pr-1",
        sizeClasses[size],
        checked ? "bg-brand-primary" : "bg-border-secondary",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}>
      {/* Icon OFF - shows on left when unchecked */}
      {iconOff && !checked && (
        <span
          className={cn(
            "absolute pointer-events-none flex items-center justify-center text-white/90",
            iconSizeClasses[size],
          )}>
          {iconOff}
        </span>
      )}
      {/* Icon ON - shows on right when checked */}
      {iconOn && checked && (
        <span
          className={cn(
            "absolute pointer-events-none flex items-center justify-center text-white/90",
            iconSizeClasses[size],
            "right-1.5",
          )}>
          {iconOn}
        </span>
      )}
      {/* Thumb - white circle that slides */}
      <span
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
          thumbSizeClasses[size],
          checked ? thumbTranslateClasses[size] : "translate-x-0.5",
        )}
      />
    </button>
  );
}
