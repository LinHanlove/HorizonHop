import Dialog, {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import React from "react"

import { Input } from "~components/ui/input"
import { presetIcons, SHORTCUT_TYPE_MAP } from "~constants"
import { useNewAddShortcut, useSearch } from "~hooks"
import { cn } from "~utils/shadcn"

export default function NewAddShortcut({ ...props }) {
  const { open, setOpen } = props

  const { newShortcut, setNewShortcut, onSubmitNewShortcut } =
    useNewAddShortcut({ chrome })

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="sm:lh-max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <div className="lh-flex lh-items-center lh-justify-center ">
                <h2 className="lh-text-xl lh-font-bold lh-text-slate-800 lh-text-center">
                  添加快捷方式
                </h2>
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="lh-text-sm lh-text-slate-500">
              可添加通过url地址栏拼接参数来搜索的网址 示例：
            </p>
            <p className="lh-text-sm lh-text-slate-500 lh-mt-1 lh-p-1 lh-bg-slate-100 lh-rounded-[6px]">
              https://github.com/search?q=搜索值&type=repositories
            </p>
          </DialogDescription>
          <div className="lh-space-y-4">
            <div>
              <label className="lh-block lh-text-sm lh-font-medium lh-text-slate-700 lh-mb-2">
                名称
              </label>
              <Input
                placeholder="输入网址名称"
                value={newShortcut.alias}
                onChange={(e) =>
                  setNewShortcut({ ...newShortcut, alias: e.target.value })
                }
                className="lh-h-8 lh-rounded-lg lh-border-slate-200 lh-bg-white/80 focus:lh-border-slate-400 focus:lh-ring focus:lh-ring-slate-200 focus:lh-ring-opacity-50"
              />
            </div>

            <div>
              <label className="lh-block lh-text-sm lh-font-medium lh-text-slate-700 lh-mb-2">
                前缀
              </label>
              <Input
                placeholder="https://..."
                value={newShortcut.prefix}
                onChange={(e) =>
                  setNewShortcut({ ...newShortcut, prefix: e.target.value })
                }
                className="lh-h-8 lh-rounded-lg lh-border-slate-200 lh-bg-white/80 focus:lh-border-slate-400 focus:lh-ring focus:lh-ring-slate-200 focus:lh-ring-opacity-50"
              />
            </div>

            <div>
              <label className="lh-block lh-text-sm lh-font-medium lh-text-slate-700 lh-mb-2">
                后缀
              </label>
              <Input
                placeholder="... 没有可不填"
                value={newShortcut.suffix}
                onChange={(e) =>
                  setNewShortcut({ ...newShortcut, suffix: e.target.value })
                }
                className="lh-h-8 lh-rounded-lg lh-border-slate-200 lh-bg-white/80 focus:lh-border-slate-400 focus:lh-ring focus:lh-ring-slate-200 focus:lh-ring-opacity-50"
              />
            </div>

            <div>
              <label className="lh-block lh-text-sm lh-font-medium lh-text-slate-700 lh-mb-2">
                图标
              </label>
              <div className="lh-mb-4">
                <label className="lh-block lh-text-sm lh-font-medium lh-text-gray-500 lh-mb-2">
                  滚动选择预设图标
                </label>
                <div className="lh-flex lh-flex-wrap lh-gap-2 lh-max-h-[80px] lh-overflow-x-auto lh-pb-2 lh-pr-1">
                  {presetIcons.map((icon) => (
                    <button
                      key={icon}
                      className={cn(
                        "lh-flex lh-items-center lh-justify-center lh-flex-shrink-0 lh-h-8 lh-w-8 lh-rounded-md lh-transition-all lh-p-1",
                        newShortcut.icon === icon
                          ? "lh-bg-slate-400 lh-text-white lh-shadow-md lh-border-teal-400"
                          : "lh-bg-slate-100 lh-text-slate-700 hover:lh-bg-slate-200"
                      )}
                      onClick={() => setNewShortcut({ ...newShortcut, icon })}>
                      <Icon icon={icon} className={cn("lh-h-4 lh-w-4")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="lh-block lh-text-sm lh-font-medium lh-text-slate-700 lh-mb-2">
                分类
              </label>
              <div className="lh-grid lh-grid-cols-3 lh-gap-2">
                {SHORTCUT_TYPE_MAP.map(({ value, label }) => (
                  <button
                    key={value}
                    className={cn(
                      "lh-py-2 lh-px-3 lh-rounded-lg lh-text-sm lh-font-medium lh-transition-all",
                      newShortcut.category === value
                        ? "lh-bg-slate-800 lh-text-white lh-shadow-md"
                        : "lh-bg-slate-100 lh-text-slate-700 hover:lh-bg-slate-200"
                    )}
                    onClick={() =>
                      setNewShortcut({ ...newShortcut, category: value })
                    }>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="lh-flex lh-justify-end">
            <Button onClick={() => onSubmitNewShortcut(newShortcut, setOpen)}>
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
