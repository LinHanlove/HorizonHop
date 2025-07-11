import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

import { cn } from "~utils/shadcn"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "lh-relative lh-h-2 lh-w-full lh-overflow-hidden lh-rounded-full lh-bg-primary/20",
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className="lh-h-full lh-w-full lh-flex-1 lh-bg-primary lh-transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
