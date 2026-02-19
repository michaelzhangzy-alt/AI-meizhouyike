import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
}

export function Modal({ isOpen, onClose, children, title, description }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:p-0 backdrop-blur-sm">
      <div 
        className={cn(
          "relative w-full max-w-lg rounded-lg border bg-white p-6 shadow-xl duration-200 animate-in fade-in zoom-in-95 sm:rounded-xl",
          "max-h-[90vh] overflow-y-auto"
        )}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-between">
            {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
