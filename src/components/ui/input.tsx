import * as React from "react"

import { cn } from "@/lib/utils"

// Apple HIG Input: subtle filled surface, border appears on focus
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base: filled muted bg, no visible border at rest (Apple style)
          "flex h-9 w-full rounded-xl px-3 py-2 text-sm",
          "bg-muted/50 border border-transparent",
          "text-foreground placeholder:text-muted-foreground/60",
          // Focus: reveal subtle border + white bg
          "focus-visible:outline-none focus-visible:bg-background focus-visible:border-border focus-visible:ring-2 focus-visible:ring-primary/20",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-40",
          "transition-all duration-150",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
