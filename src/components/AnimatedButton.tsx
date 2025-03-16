
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const AnimatedButton = ({
  children,
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  ...props
}: AnimatedButtonProps) => {
  // Define base styles for different variants
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none";
  
  // Handle different variant styles
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98]",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
    ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
    link: "text-primary underline-offset-4 hover:underline",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
  };
  
  // Handle different size styles
  const sizeStyles = {
    default: "h-10 py-2 px-6 rounded-lg",
    sm: "h-8 px-4 text-sm rounded-md",
    lg: "h-12 px-8 rounded-xl",
    icon: "h-10 w-10 rounded-full p-0",
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "group overflow-hidden",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-lg" />
      
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : null}
      
      <span className={cn("flex items-center gap-2", isLoading ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;
