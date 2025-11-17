import * as React from "react"

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  registerLabel: (value: string, label: string) => void
  getLabel: (value: string) => string | undefined
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
  const labelsRef = React.useRef<Map<string, string>>(new Map())
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  const registerLabel = React.useCallback((value: string, label: string) => {
    const hadLabel = labelsRef.current.has(value)
    labelsRef.current.set(value, label)
    // Force re-render when first label is registered
    if (!hadLabel) {
      forceUpdate()
    }
  }, [])

  const getLabel = React.useCallback((value: string) => {
    return labelsRef.current.get(value)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, registerLabel, getLabel }}>
      <div className="relative w-full">
        {children}
      </div>
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
        className={`flex h-10 w-full items-center justify-between rounded-md border border-[#E8EAED] dark:border-[#30363D] bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
  const { value, getLabel } = useSelectContext()

  // Get the label from registered SelectItems
  const displayValue = value ? (getLabel(value) || value) : placeholder

  return <span className={!value ? 'text-[#80868B] dark:text-[#6E7681]' : ''}>{displayValue}</span>
}

const SelectContent = ({ className = '', children }: { className?: string, children: React.ReactNode }) => {
  const { open, setOpen } = useSelectContext()

  // Always render children in hidden div to register labels
  React.useEffect(() => {
    // Children are already rendered, labels should be registered
  }, [children])

  return (
    <>
      {/* Hidden div to register labels without displaying */}
      {!open && (
        <div className="sr-only" aria-hidden="true">
          {children}
        </div>
      )}

      {/* Only show dropdown UI when open */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#E8EAED] dark:border-[#30363D] bg-[#FCFCF9] dark:bg-[#0D1117] py-1 shadow-lg ${className}`}>
            {children}
          </div>
        </>
      )}
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
  const { value: selectedValue, onValueChange, setOpen, registerLabel } = useSelectContext()

  // Register this item's label synchronously on first render
  const labelRegistered = React.useRef(false)
  if (!labelRegistered.current && typeof children === 'string') {
    registerLabel(value, children)
    labelRegistered.current = true
  }

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-[#202124] dark:text-[#E6EDF3] outline-none hover:bg-[#F5F5F5] dark:hover:bg-[#161B22] ${selectedValue === value ? 'bg-[#F5F5F5] dark:bg-[#161B22] font-medium' : ''} ${className}`}
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
