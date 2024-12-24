import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border-2 border-gray-800 bg-[#1a1a1a] px-4 py-2 text-base text-white transition-colors",
        "placeholder:text-gray-500",
        "focus:border-[#646cff] focus:outline-none focus:ring-2 focus:ring-[#646cff] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }