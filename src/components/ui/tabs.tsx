import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/utils/shadcn.ts"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "lh-inline-flex lh-h-9 lh-items-center lh-justify-center lh-rounded-lg lh-bg-muted lh-p-1 lh-text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "lh-inline-flex lh-items-center lh-justify-center lh-whitespace-nowrap lh-rounded-md lh-px-3 lh-py-1 lh-text-sm lh-font-medium lh-ring-offset-background lh-transition-all focus-visible:lh-outline-none focus-visible:lh-ring-2 focus-visible:lh-ring-ring focus-visible:lh-ring-offset-2 disabled:lh-pointer-events-none disabled:lh-opacity-50 data-[state=active]:lh-bg-background data-[state=active]:lh-text-foreground data-[state=active]:lh-shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "lh-mt-2 lh-ring-offset-background focus-visible:lh-outline-none focus-visible:lh-ring-2 focus-visible:lh-ring-ring focus-visible:lh-ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
