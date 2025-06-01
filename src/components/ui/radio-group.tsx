import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/utils/shadcn.ts"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("lh-grid lh-gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "lh-aspect-square lh-h-4 lh-w-4 lh-rounded-full lh-border lh-border-primary lh-text-primary lh-shadow focus:lh-outline-none focus-visible:lh-ring-1 focus-visible:lh-ring-ring disabled:lh-cursor-not-allowed disabled:lh-opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="lh-flex lh-items-center lh-justify-center">
        <Circle className="lh-h-3.5 lh-w-3.5 lh-fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
