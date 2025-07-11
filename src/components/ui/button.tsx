import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "~utils/shadcn"

const buttonVariants = cva(
  "lh-inline-flex lh-items-center lh-justify-center lh-gap-2 lh-whitespace-nowrap lh-rounded-md lh-text-sm lh-font-medium lh-transition-colors focus-visible:lh-outline-none focus-visible:lh-ring-1 focus-visible:lh-ring-ring disabled:lh-pointer-events-none disabled:lh-opacity-50 [&_svg]:lh-pointer-events-none [&_svg]:lh-size-4 [&_svg]:lh-shrink-0",
  {
    variants: {
      variant: {
        default:
          "lh-bg-primary lh-text-primary-foreground lh-shadow hover:lh-bg-primary/90",
        destructive:
          "lh-bg-destructive lh-text-destructive-foreground lh-shadow-sm hover:lh-bg-destructive/90",
        outline:
          "lh-border lh-border-input lh-bg-background lh-shadow-sm hover:lh-bg-accent hover:lh-text-accent-foreground",
        secondary:
          "lh-bg-secondary lh-text-secondary-foreground lh-shadow-sm hover:lh-bg-secondary/80",
        ghost: "hover:lh-bg-accent hover:lh-text-accent-foreground",
        link: "lh-text-primary lh-underline-offset-4 hover:lh-underline"
      },
      size: {
        default: "lh-h-9 lh-px-4 lh-py-2",
        sm: "lh-h-8 lh-rounded-md lh-px-2 lh-text-xs",
        lg: "lh-h-10 lh-rounded-md lh-px-8",
        icon: "lh-h-9 lh-w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
