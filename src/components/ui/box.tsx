import * as React from "react";
import { cn } from "@betday/lib";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  display?: "flex" | "grid" | "block" | "inline" | "inline-block";
  direction?: "row" | "col";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  p?: "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const gapMap = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};
const paddingMap = { xs: "p-1", sm: "p-2", md: "p-4", lg: "p-6", xl: "p-8" };
const roundedMap = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};
const displayMap: Record<string, string> = {
  flex: "flex",
  grid: "grid",
  block: "block",
  inline: "inline",
  "inline-block": "inline-block",
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ as, className, display, direction, gap, p, rounded, ...props }, ref) => {
    const Component = (as as React.ElementType) || "div";
    const classes = cn(
      display && displayMap[display],
      direction && `flex-${direction}`,
      gap && gapMap[gap],
      p && paddingMap[p],
      rounded && roundedMap[rounded],
      className,
    );
    return <Component className={classes} ref={ref} {...props} />;
  },
);

Box.displayName = "Box";
export { Box };
