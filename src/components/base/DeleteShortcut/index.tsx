import Dialog, {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import React, { useEffect } from "react"

import { useSetting } from "~hooks"
import { cn } from "~utils/shadcn"

interface DeleteShortcutProps {
  open: boolean
  setOpen: (isOpen: boolean) => void
}

export default function DeleteShortcut({ open, setOpen }: DeleteShortcutProps) {
  const { shortcutsToDelete, loadShortcutsToDelete, deleteShortcut } =
    useSetting()

  useEffect(() => {
    if (open) {
      loadShortcutsToDelete()
    }
  }, [open, loadShortcutsToDelete])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lh-w-[400px] lh-flex lh-flex-col lh-max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>删除预设快捷方式</DialogTitle>
        </DialogHeader>
        <DialogDescription>选择要删除的预设快捷方式。</DialogDescription>
        <div className="lh-space-y-3 lh-overflow-y-auto lh-py-2 lh-flex-1 lh-pr-2">
          {shortcutsToDelete.length === 0 ? (
            <p className="lh-text-center lh-text-slate-500">
              没有可删除的快捷方式。
            </p>
          ) : (
            shortcutsToDelete.map((shortcut) => (
              <div
                key={shortcut.id}
                className="lh-flex lh-items-center lh-justify-between lh-p-2 lh-rounded-md lh-bg-card hover:lh-bg-accent lh-text-card-foreground lh-transition-colors lh-border lh-border-border">
                <div className="lh-flex-shrink-0 lh-mr-4 lh-p-2 lh-bg-background lh-rounded-full lh-shadow-sm lh-flex lh-items-center lh-justify-center">
                  {shortcut.icon &&
                    (typeof shortcut.icon !== "string" ? (
                      <shortcut.icon
                        className={cn(
                          "lh-h-5 lh-w-5",
                          shortcut.iconColor
                            ? `lh-text-[${shortcut.iconColor}]`
                            : "lh-text-muted-foreground"
                        )}
                      />
                    ) : (
                      <span className="lh-h-5 lh-w-5 lh-flex lh-items-center lh-justify-center lh-text-xl">
                        {shortcut.icon}
                      </span>
                    ))}
                </div>

                <div className="lh-flex-1 lh-mr-4 lh-space-y-0.5 lh-min-w-0">
                  <p className="lh-font-semibold lh-text-foreground lh-truncate">
                    {shortcut.alias}
                  </p>
                  {(shortcut.prefix || shortcut.suffix) && (
                    <p className="lh-text-xs lh-text-muted-foreground lh-truncate lh-font-mono">
                      {shortcut.prefix}
                      {shortcut.suffix}
                    </p>
                  )}
                  {shortcut.category && (
                    <p className="lh-text-xs lh-text-muted-foreground">
                      分类: {shortcut.category}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="lh-text-red-500 hover:lh-text-red-700 lh-p-1 lh-flex-shrink-0"
                  onClick={() => deleteShortcut(shortcut.id)}>
                  <Trash2 className="lh-h-4 lh-w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
