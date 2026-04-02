import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const cardVariants = cva(
  "rounded-radius-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-line-primary bg-surface-primary shadow-sm",
        elevated:
          "border-line-primary bg-surface-primary shadow-md hover:shadow-lg",
        outlined: "border-line-secondary bg-transparent",
        ghost: "border-transparent bg-transparent",
        accent: "border-brand-primary/20 bg-brand-primary-soft",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-5 md:p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      ref={ref}
      {...props}
    />
  ),
);

Card.displayName = "Card";
export { Card };
