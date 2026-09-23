import * as React from "react"
import { cn } from "cn"

const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return <label ref={ref} data-slot="label" className={cn("text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)} {...props} />
}
)
Label.displayName = "Label"

export { Label }
