import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  bgChecked?: string
  bgUnchecked?: string
}

export function Switch({ checked, onCheckedChange, bgChecked, bgUnchecked, className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-[1.435rem] w-12 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
        checked
          ? bgChecked || "bg-green-500"     
          : bgUnchecked || "bg-gray-300"     
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow-md transition-transform",
          checked ? "translate-x-[calc(100%+6px)]" : "translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}
