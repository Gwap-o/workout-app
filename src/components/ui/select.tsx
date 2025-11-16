import * as React from "react"

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('Select components must be used within Select')
  return context
}

export interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }>(
  ({ className = '', children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext()

    return (
      <button
        ref={ref}
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = useSelectContext()
  return <span className={!value ? 'text-gray-400' : ''}>{value || placeholder}</span>
}

const SelectContent = ({ className = '', children }: { className?: string, children: React.ReactNode }) => {
  const { open, setOpen } = useSelectContext()

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setOpen(false)}
      />
      <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ${className}`}>
        {children}
      </div>
    </>
  )
}

const SelectItem = ({
  value,
  children,
  className = ''
}: {
  value: string
  children: React.ReactNode
  className?: string
}) => {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext()

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 ${selectedValue === value ? 'bg-gray-50 font-medium' : ''} ${className}`}
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
