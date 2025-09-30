import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface DockProps {
  className?: string
  items: {
    icon: LucideIcon
    label: string
    onClick?: () => void
  }[]
}

interface DockIconButtonProps {
  icon: LucideIcon
  onClick?: () => void
  className?: string
}


const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, onClick, className }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          "dock-button relative p-3 rounded-xl",
          "border border-[#404040]",
          className
        )}
        style={{
          backgroundColor: '#030303',
          background: '#030303',
        }}
      >
        <Icon className="w-6 h-6 text-[#e5e5e5]" />
      </button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    return (
      <div ref={ref} className={cn("fixed bottom-0 md:bottom-4 left-0 right-0 z-50 flex justify-center", className)}>
        <div
          className={cn(
            "w-full flex items-center justify-center gap-8 px-6 pt-4 pb-10 md:py-4 rounded-t-2xl md:rounded-2xl md:mx-4 md:w-auto",
            "bg-[#222222] border-t border-[#606060] md:border md:border-[#606060]",
            "shadow-[0_-12px_32px_-2px_rgba(0,0,0,0.6)] md:shadow-2xl hover:md:shadow-3xl transition-shadow duration-300"
          )}
        >
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </div>
      </div>
    )
  }
)
Dock.displayName = "Dock"

export { Dock }