import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/utils/shadcn.ts"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "lh-peer lh-h-4 lh-w-4 lh-shrink-0 lh-rounded-sm lh-border lh-border-primary lh-shadow focus-visible:lh-outline-none focus-visible:lh-ring-1 focus-visible:lh-ring-ring disabled:lh-cursor-not-allowed disabled:lh-opacity-50 data-[state=checked]:lh-bg-primary data-[state=checked]:lh-text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("lh-flex lh-items-center lh-justify-center lh-text-current")}
    >
      <Check className="lh-h-4 lh-w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
