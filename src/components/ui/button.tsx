import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      default: 'bg-[#20808D] dark:bg-[#1FB8CD] text-white hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8]',
      destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
      outline: 'border border-[#E8EAED] dark:border-[#30363D] bg-transparent hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3]',
      ghost: 'hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3]'
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-11 px-8'
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
