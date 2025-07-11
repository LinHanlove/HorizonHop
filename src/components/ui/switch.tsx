import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as React from "react"

import { cn } from "~utils/shadcn"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "lh-peer lh-inline-flex lh-h-5 lh-w-9 lh-shrink-0 lh-cursor-pointer lh-items-center lh-rounded-full lh-border-2 lh-border-transparent lh-shadow-sm lh-transition-colors focus-visible:lh-outline-none focus-visible:lh-ring-2 focus-visible:lh-ring-ring focus-visible:lh-ring-offset-2 focus-visible:lh-ring-offset-background disabled:lh-cursor-not-allowed disabled:lh-opacity-50 data-[state=checked]:lh-bg-primary data-[state=unchecked]:lh-bg-input",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "lh-pointer-events-none lh-block lh-h-4 lh-w-4 lh-rounded-full lh-bg-background lh-shadow-lg lh-ring-0 lh-transition-transform data-[state=checked]:lh-translate-x-4 data-[state=unchecked]:lh-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
