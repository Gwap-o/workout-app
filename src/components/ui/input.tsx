import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-[#E8EAED] dark:border-[#30363D] bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#80868B] dark:placeholder:text-[#6E7681] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20808D] dark:focus-visible:ring-[#1FB8CD] disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
