import { cn } from "@/lib/utils";
import * as React from "react";

interface ForgotPasswordButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "link" | "button";
}

const ForgotPasswordButton = React.forwardRef<HTMLButtonElement, ForgotPasswordButtonProps>(
  ({ className, children, variant = "link", ...props }, ref) => {
    if (variant === "button") {
      return (
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "text-primary hover:text-primary/80",
            className
          )}
          ref={ref}
          {...props}
        >
          {children || "Forgot Password?"}
        </button>
      );
    }

    return (
      <button
        type="button"
        className={cn(
          "text-sm text-primary hover:underline font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children || "Forgot your password?"}
      </button>
    );
  }
);
ForgotPasswordButton.displayName = "ForgotPasswordButton";

export { ForgotPasswordButton };
