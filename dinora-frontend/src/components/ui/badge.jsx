import { cn } from "cn"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "text-foreground",
    destructive: "border-transparent bg-destructive/10 text-destructive",
  }
  return <span data-slot="badge" className={cn("inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />
}

export { Badge }
