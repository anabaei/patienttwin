"use client";

import { cn } from '@/lib/utils';
import React from 'react';

export interface HealthcareCornerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const HealthcareCornerButton = React.forwardRef<HTMLButtonElement, HealthcareCornerButtonProps>(({
  className,
  children = "Get Started",
  variant = 'primary',
  ...props
}, ref) => {
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90",
    secondary: "bg-secondary hover:bg-secondary/90", 
    outline: "bg-background border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
  };

  const cornerAccentClasses = {
    primary: "bg-primary-foreground/20",
    secondary: "bg-secondary-foreground/20",
    outline: "bg-primary/20"
  };

  const slidingBgClasses = {
    primary: "bg-primary-foreground/10",
    secondary: "bg-secondary-foreground/10", 
    outline: "bg-primary/10"
  };

  return (
    <button 
      ref={ref}
      className={cn(
        "relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all rounded-md group",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Top right corner accent */}
      <span className={cn(
        "absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded group-hover:-mr-4 group-hover:-mt-4",
        cornerAccentClasses[variant]
      )}>
        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-background/80" />
      </span>
      
      {/* Bottom left corner accent */}
      <span className={cn(
        "absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded group-hover:-ml-4 group-hover:-mb-4",
        cornerAccentClasses[variant]
      )}>
        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-background/80" />
      </span>
      
      {/* Sliding background */}
      <span className={cn(
        "absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0",
        slidingBgClasses[variant]
      )} />
      
      {/* Button text */}
      <span className={cn(
        "relative w-full text-left transition-colors duration-200 ease-in-out",
        variant === 'outline' ? "text-primary group-hover:text-primary-foreground" : "text-primary-foreground group-hover:text-primary-foreground"
      )}>
        {children}
      </span>
    </button>
  );
});

HealthcareCornerButton.displayName = "HealthcareCornerButton";
