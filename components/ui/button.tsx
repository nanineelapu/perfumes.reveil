import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-accent text-black hover:opacity-90",
      outline: "border border-border bg-transparent hover:bg-muted",
      ghost: "hover:bg-muted",
    }
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-10 py-4 text-base",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
