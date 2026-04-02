import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@betday/lib";

const typographyVariants = cva("text-secondary", {
  variants: {
    variant: {
      h1: "text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl",
      h2: "text-xl font-bold tracking-tight text-primary md:text-2xl lg:text-3xl",
      h3: "text-lg font-semibold text-primary md:text-xl",
      subtitle: "text-base font-medium text-secondary md:text-lg",
      body1: "text-base text-secondary md:text-lg",
      body2: "text-sm text-secondary md:text-base",
      body3: "text-xs text-tertiary md:text-sm",
      eyebrow: "text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand",
    },
  },
  defaultVariants: {
    variant: "body2",
  },
});

interface TypographyProps
  extends
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {
  component?: React.ElementType;
  variant?: keyof typeof elementMapping;
}

const elementMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  subtitle: "p",
  body1: "p",
  body2: "p",
  body3: "p",
  eyebrow: "p",
} as const;

type ComponentElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

const Typography = React.forwardRef<HTMLHeadingElement | HTMLParagraphElement, TypographyProps>(
  ({ component, className, variant, children, ...props }, ref) => {
    const Comp = (
      component ? component : variant ? elementMapping[variant] : "p"
    ) as ComponentElement;

    return (
      <Comp className={cn(typographyVariants({ variant }), className)} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);

Typography.displayName = "Typography";

export { Typography };
