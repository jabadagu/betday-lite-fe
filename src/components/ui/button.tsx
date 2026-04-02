import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@betday/lib";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-inverse hover:bg-brand-primary-hover",
        secondary: "bg-brand-secondary text-inverse hover:bg-brand-secondary-hover",
        outline:
          "border border-line-secondary text-primary bg-transparent hover:bg-surface-secondary",
        ghost: "text-secondary bg-transparent hover:bg-surface-secondary",
        danger: "bg-status-error text-inverse hover:opacity-90",
        accent: "bg-brand-accent text-primary hover:bg-brand-accent-hover",
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1",
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-11 px-5 text-base gap-2",
        xl: "h-12 px-6 text-base gap-2.5",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-radius-sm",
        md: "rounded-radius-md",
        lg: "rounded-radius-lg",
        xl: "rounded-radius-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "lg",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, isLoading, disabled, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, rounded }), className)}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
export { Button };
