import * as React from "react"
import { cn } from "cn"

const Select = React.forwardRef(function Select({ className, ...props }, ref) {
  return <select ref={ref} data-slot="select" className={cn("h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50", className)} {...props} />
}
)
Select.displayName = "Select"

export { Select }
