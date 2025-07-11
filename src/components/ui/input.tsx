import * as React from "react"

import { cn } from "~utils/shadcn"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "lh-flex lh-h-9 lh-w-full lh-rounded-md lh-border lh-border-input lh-bg-transparent lh-px-3 lh-py-1 lh-text-base lh-shadow-sm lh-transition-colors file:lh-border-0 file:lh-bg-transparent file:lh-text-sm file:lh-font-medium file:lh-text-foreground placeholder:lh-text-muted-foreground focus-visible:lh-outline-none focus-visible:lh-ring-1 focus-visible:lh-ring-ring disabled:lh-cursor-not-allowed disabled:lh-opacity-50 md:lh-text-sm",
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
