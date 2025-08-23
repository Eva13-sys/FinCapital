"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  Select as RadixSelect,
  SelectTrigger as RadixSelectTrigger,
  SelectValue as RadixSelectValue,
  SelectContent as RadixSelectContent,
  SelectItem as RadixSelectItem,
} from "@radix-ui/react-select"
import { cn } from "../../lib/utils"

const Select = RadixSelect
const SelectTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <RadixSelectTrigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
      className
    )}
    {...props}
  />
))
SelectTrigger.displayName = RadixSelectTrigger.displayName

const SelectValue = RadixSelectValue
const SelectContent = RadixSelectContent
const SelectItem = RadixSelectItem

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
