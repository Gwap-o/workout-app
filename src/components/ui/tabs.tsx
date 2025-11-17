import * as React from "react"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('Tabs components must be used within Tabs')
  return context
}

export interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

const Tabs = ({ defaultValue, value: controlledValue, onValueChange, children, className = '' }: TabsProps) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)

  const value = controlledValue ?? uncontrolledValue
  const handleValueChange = onValueChange ?? setUncontrolledValue

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-[#F5F5F5] dark:bg-[#161B22] p-1 text-[#5F6368] dark:text-[#8B949E] ${className}`}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  ({ className = '', value: triggerValue, ...props }, ref) => {
    const { value, onValueChange } = useTabsContext()
    const isActive = value === triggerValue

    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white dark:ring-offset-[#0D1117] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20808D] dark:focus-visible:ring-[#1FB8CD] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] shadow-sm' : 'text-[#5F6368] dark:text-[#8B949E] hover:text-[#202124] dark:hover:text-[#E6EDF3]'} ${className}`}
        onClick={() => onValueChange(triggerValue)}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className = '', value: contentValue, ...props }, ref) => {
    const { value } = useTabsContext()

    if (value !== contentValue) return null

    return (
      <div
        ref={ref}
        className={`mt-2 ring-offset-white dark:ring-offset-[#0D1117] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20808D] dark:focus-visible:ring-[#1FB8CD] focus-visible:ring-offset-2 ${className}`}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
