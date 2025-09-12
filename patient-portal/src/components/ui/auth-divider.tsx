import { cn } from "@/lib/utils";
import * as React from "react";

interface AuthDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const AuthDivider = React.forwardRef<HTMLDivElement, AuthDividerProps>(
  ({ className, text = "OR", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex items-center justify-center", className)}
        {...props}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">
            {text}
          </span>
        </div>
      </div>
    );
  }
);
AuthDivider.displayName = "AuthDivider";

export { AuthDivider };
