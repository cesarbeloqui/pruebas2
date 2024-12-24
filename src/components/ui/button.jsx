import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#646cff] px-4 py-2 text-base font-medium text-white transition-colors",
        "hover:bg-[#747bff] hover:scale-[1.02]",
        "active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-[#646cff] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }