import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-default text-white",
        outlineDefault:
          "border-2 border-primary-default text-primary-default bg-white hover:bg-primary-default hover:text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline:
          "border-2 border-primary-dark text-primary-dark bg-white hover:bg-primary-dark hover:text-white",
        secondary: "bg-primary-light text-white hover:bg-primary-dark",
        ghost: "hover:bg-gray-100 hover:text-primary-dark",
        link: "text-primary-default underline-offset-4 hover:underline hover:text-primary-accent",
        gradient: "bg-gradient-stat-1 text-white hover:opacity-90 shadow-md",
        yellow:
          "bg-accent-yellow text-primary-dark hover:bg-accent-gold shadow-sm",
        dark: "bg-primary-dark text-white shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
