import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  actionIcon?: LucideIcon;
  onActionClick?: () => void;
  actionDisabled?: boolean;
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ 
    icon: Icon, 
    iconPosition = "left", 
    actionIcon: ActionIcon, 
    onActionClick, 
    actionDisabled = false,
    className,
    ...props 
  }, ref) => {
    return (
      <div className="relative">
        {Icon && iconPosition === "left" && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          ref={ref}
          className={cn(
            Icon && iconPosition === "left" && "pl-10",
            ActionIcon && "pr-10",
            className
          )}
          {...props}
        />
        {ActionIcon && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onActionClick}
            disabled={actionDisabled}
          >
            <ActionIcon className="h-4 w-4" />
          </Button>
        )}
        {Icon && iconPosition === "right" && (
          <Icon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";
