import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import * as React from "react"

import { cn } from "~utils/shadcn"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("lh-border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="lh-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "lh-flex lh-flex-1 lh-items-center lh-justify-between lh-py-4 lh-text-sm lh-font-medium lh-transition-all hover:lh-underline lh-text-left [&[data-state=open]>svg]:lh-rotate-180",
        className
      )}
      {...props}>
      {children}
      <ChevronDown className="lh-h-4 lh-w-4 lh-shrink-0 lh-text-muted-foreground lh-transition-transform lh-duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="lh-overflow-hidden lh-text-sm data-[state=closed]:lh-animate-accordion-up data-[state=open]:lh-animate-accordion-down"
    {...props}>
    <div className={cn("lh-pb-4 lh-pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
