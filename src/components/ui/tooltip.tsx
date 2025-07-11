import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"

import { cn } from "~utils/shadcn"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "lh-z-50 lh-overflow-hidden lh-rounded-md lh-bg-primary lh-px-3 lh-py-1.5 lh-text-xs lh-text-primary-foreground lh-animate-in lh-fade-in-0 lh-zoom-in-95 data-[state=closed]:lh-animate-out data-[state=closed]:lh-fade-out-0 data-[state=closed]:lh-zoom-out-95 data-[side=bottom]:lh-slide-in-from-top-2 data-[side=left]:lh-slide-in-from-right-2 data-[side=right]:lh-slide-in-from-left-2 data-[side=top]:lh-slide-in-from-bottom-2 lh-origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
