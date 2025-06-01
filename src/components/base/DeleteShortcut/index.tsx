import Dialog, {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { Trash2 } from "lucide-react"
import React, { useEffect } from "react"

import { useSetting } from "~hooks"
import { cn } from "~utils/shadcn"

import "@/assets/style/base.scss"

export default function DeleteShortcut({ ...props }) {
  const { shortcuts, loadShortcutsToDelete, deleteShortcut } = useSetting()
  const { open, setOpen } = props
  useEffect(() => {
    if (open) {
      loadShortcutsToDelete()
    }
  }, [open, loadShortcutsToDelete])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lh-w-[400px] lh-flex lh-flex-col lh-max-h-[70vh] lh-hide-scrollbar">
        <DialogHeader>
          <DialogTitle>删除预设快捷方式</DialogTitle>
        </DialogHeader>
        <DialogDescription>选择要删除的预设快捷方式。</DialogDescription>
        <div className="lh-space-y-3 lh-overflow-y-auto lh-py-2 lh-flex-1 lh-pr-2">
          {!shortcuts.length ? (
            <p className="lh-text-center lh-text-slate-500">
              没有可删除的快捷方式。
            </p>
          ) : (
            shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className="lh-flex lh-items-center lh-justify-between lh-p-2 lh-rounded-md lh-bg-card hover:lh-bg-accent lh-text-card-foreground lh-transition-colors lh-border lh-border-border">
                <div className="lh-flex-shrink-0 lh-mr-4 lh-p-2 lh-bg-background lh-rounded-full lh-shadow-sm lh-flex lh-items-center lh-justify-center">
                  <Icon
                    icon={shortcut.icon}
                    color={shortcut.iconColor}
                    className={cn("lh-h-4 lh-w-4")}
                  />
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
