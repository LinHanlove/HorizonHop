import * as React from "react"

import { cn } from "@/utils/shadcn.ts"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "lh-flex lh-min-h-[60px] lh-w-full lh-rounded-md lh-border lh-border-input lh-bg-transparent lh-px-3 lh-py-2 lh-text-base lh-shadow-sm placeholder:lh-text-muted-foreground focus-visible:lh-outline-none focus-visible:lh-ring-1 focus-visible:lh-ring-ring disabled:lh-cursor-not-allowed disabled:lh-opacity-50 md:lh-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
