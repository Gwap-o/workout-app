"use client"

import { format, parse } from "date-fns"
import { useState, useRef, useEffect } from "react"

import { cn } from "@/lib/utils"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [inputValue, setInputValue] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update input value when date changes externally
  useEffect(() => {
    if (date && !isEditing) {
      setInputValue(format(date, "yyyy-MM-dd"))
    }
  }, [date, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

    // Try to parse the date as user types
    if (e.target.value.length === 10) { // yyyy-MM-dd format
      try {
        const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date())
        if (!isNaN(parsedDate.getTime())) {
          onSelect?.(parsedDate)
        }
      } catch (error) {
        // Invalid date format, ignore
      }
    }
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    // Reformat to display format if we have a valid date
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"))
    }
  }

  return (
    <input
      ref={inputRef}
      type="date"
      value={inputValue}
      onChange={handleInputChange}
      onFocus={() => setIsEditing(true)}
      onBlur={handleInputBlur}
      className={cn(
        "date-picker-input flex h-10 w-full rounded-md border border-[#E8EAED] dark:border-[#30363D] bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD]",
        !date && "text-[#80868B] dark:text-[#6E7681]"
      )}
    />
  )
}
