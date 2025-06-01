import { CircleX } from "lucide-react"
import React, { createContext, useCallback, useContext, useState } from "react"

import { Button } from "~components/ui/button"
import { cn } from "~utils/shadcn"

// 1. 创建 Context
interface DialogContextType {
  open: boolean
  setOpen: (isOpen: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

// Custom hook to use the context
const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider")
  }
  return context
}

// 2. 主 Dialog 组件 (Provider)
interface DialogProps {
  open: boolean
  onOpenChange: (isOpen: boolean) => void // 使用 onOpenChange 替代 setOpen，更符合事件命名
  children: React.ReactNode
}

export default function Dialog({ open, onOpenChange, children }: DialogProps) {
  const setOpen = useCallback(onOpenChange, [onOpenChange])

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {open && (
        <div
          className=" lh-w-auto lh-fixed lh-inset-0 lh-z-50 lh-flex lh-items-center lh-justify-center lh-bg-black/50 lh-backdrop-blur-sm"
          onClick={() => setOpen(false)} // 点击背景关闭
        >
          {/* Content is now rendered by DialogContent */}
          {children}
        </div>
      )}
    </DialogContext.Provider>
  )
}

// 3. 子组件

// Dialog Content (handles the dialog panel and its layout)
interface DialogContentProps {
  children: React.ReactNode
  className?: string // 允许自定义样式
}

export function DialogContent({ children, className }: DialogContentProps) {
  const { setOpen } = useDialogContext()
  return (
    <div
      className={cn(
        "lh-bg-white lh-rounded-lg lh-shadow-lg lh-p-4 lh-m-4 lh-flex lh-flex-col lh-gap-4",
        className
      )}
      onClick={(e) => e.stopPropagation()} // 阻止点击内容区域关闭
    >
      {children}
    </div>
  )
}

// Dialog Header
interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  const { setOpen } = useDialogContext()
  return (
    <div
      className={cn("lh-flex lh-justify-between lh-items-center", className)}>
      <div className="lh-flex-1">{children}</div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
        className="lh-ml-auto lh-p-0">
        <CircleX />
      </Button>
    </div>
  )
}

// Dialog Title
interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h3
      className={cn(
        "lh-text-lg lh-font-semibold lh-leading-none lh-tracking-tight",
        className
      )}>
      {children}
    </h3>
  )
}

// Dialog Description
interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function DialogDescription({
  children,
  className
}: DialogDescriptionProps) {
  return (
    <p className={cn("lh-text-sm lh-text-muted-foreground", className)}>
      {children}
    </p>
  )
}

// Dialog Footer
interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return <div className={cn(className)}>{children}</div>
}
