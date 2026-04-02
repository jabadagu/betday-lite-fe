import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@betday/lib";

const inputVariants = cva(
  "w-full rounded-radius-lg border bg-surface-primary font-medium text-primary transition-all duration-200 placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      },
      variant: {
        default: "border-line-primary focus-visible:border-line-active",
        error:
          "border-status-error focus-visible:border-status-error focus-visible:ring-status-error/30",
      },
    },
    defaultVariants: {
      inputSize: "md",
      variant: "default",
    },
  },
);

interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, variant, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ inputSize, variant }), className)}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = "Input";
export { Input };
