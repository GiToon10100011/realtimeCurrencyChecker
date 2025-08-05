import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl",
        destructive:
          "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl",
        outline:
          "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 border-0",
        secondary:
          "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-xl",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm hover:shadow-md",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }