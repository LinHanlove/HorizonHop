import Dialog, {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import SelectedCornerMark from "@/components/base/SelectedCornerMark"
import { cn } from "@/utils/shadcn"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"

import { menuList, MODEL_TYPE, SEND_FROM, SHORTCUT_TYPE_MAP } from "~constants"
import { sendMessageRuntime } from "~utils"

export default function FunctionArea({ ...props }) {
  const { open, setOpen } = props

  // 功能列表
  const [tabList, setTabList] = useState(SHORTCUT_TYPE_MAP)

  // 当前选中的分类
  const [activeTab, setActiveTab] = useState<
    "all" | "dev" | "design" | "other"
  >("all")

  // 当前选中的功能
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null)

  // 根据分类过滤功能
  const filteredFunctions = menuList.filter((func) => {
    if (activeTab === "all") return true
    return func.category === activeTab
  })

  /**
   * @function 选中了当前功能，给background发送信息，让它去执行
   * @description 因为chrome对象不同
   */
  const onSelectFunction = (eventBar: any) => {
    sendMessageRuntime({
      type: MODEL_TYPE.functionArea,
      origin: SEND_FROM.content,
      data: {
        target: eventBar.title
      },
      chrome
    })
    // 关闭弹窗
    setOpen(false)
  }

  useEffect(() => {
    // 获取所有分类
    const categories = Array.from(
      new Set(menuList.map((item) => item.category))
    )

    // 过滤出有效的分类
    const validTabs = SHORTCUT_TYPE_MAP.filter((tab) => {
      return categories.includes(tab.value)
    })

    setTabList([
      {
        value: "all",
        label: "全部"
      },
      ...validTabs
    ])
    setSelectedFunction(filteredFunctions[0].id)
  }, [])

  // 处理键盘事件，切换选中功能
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      // 如果按下了 Tab 键
      if (e.key === "Tab") {
        e.preventDefault()
        const currentIndex = filteredFunctions.findIndex(
          (func) => func.id === selectedFunction
        )
        const nextIndex = (currentIndex + 1) % filteredFunctions.length
        setSelectedFunction(filteredFunctions[nextIndex].id)
      }
      // 如果按下了 Enter 键
      if (e.key === "Enter") {
        e.preventDefault()
        const selectedFunc = filteredFunctions.find(
          (func) => func.id === selectedFunction
        )
        if (selectedFunc) {
          onSelectFunction(selectedFunc)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, selectedFunction, filteredFunctions])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:lh-w-[480px] lh-bg-white/95 lh-backdrop-blur-sm lh-border-slate-200/60 lh-shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <DialogHeader>
          <DialogTitle>
            <div className="lh-flex lh-items-center lh-justify-center">
              <h2 className="lh-text-xl lh-font-bold lh-text-slate-800 lh-text-center lh-tracking-tight lh-bg-gradient-to-r lh-from-slate-800 lh-to-slate-600 lh-bg-clip-text lh-text-transparent lh-drop-shadow-sm">
                功能区
              </h2>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="lh-space-y-1.5">
            <p className="lh-text-sm lh-text-slate-500 lh-leading-relaxed">
              这里包含了所有可用的功能，你可以通过分类快速找到需要的功能
            </p>
            <div className="lh-flex lh-items-center lh-justify-center lh-space-x-1.5 lh-text-xs lh-text-slate-400">
              <Icon icon="mdi:keyboard-tab" className="lh-w-4 lh-h-4" />
              <span>可通过</span>
              <kbd className="lh-px-1.5 lh-py-0.5 lh-bg-slate-100 lh-rounded lh-border lh-border-slate-200/60 lh-text-slate-600 lh-font-mono lh-text-[10px]">
                Tab
              </kbd>
              <span>键快速切换功能</span>
            </div>
          </div>
        </DialogDescription>

        {/* Tab 切换 */}
        <div className="lh-flex lh-justify-center lh-space-x-2 lh-p-2 lh-border-b lh-border-slate-200/60">
          {tabList.map((tab) => (
            <button
              key={tab.value}
              className={cn(
                "lh-px-3 lh-py-1 lh-rounded-[4px] lh-text-sm lh-font-medium lh-whitespace-nowrap lh-transition-all lh-shadow-sm",
                activeTab === tab.value
                  ? "lh-bg-slate-800 lh-text-white lh-shadow-slate-800/25"
                  : "lh-bg-white/90 lh-text-slate-600 hover:lh-bg-white hover:lh-shadow-md lh-border lh-border-slate-200/50"
              )}
              onClick={() => setActiveTab(tab.value as any)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 功能列表 */}
        <div className="lh-p-4 lh-overflow-y-auto lh-max-h-[calc(80vh-200px)]">
          <div className="lh-grid lh-grid-cols-3 lh-gap-2">
            {filteredFunctions.map((func) => (
              <motion.button
                key={func.title}
                className={cn(
                  "lh-group lh-relative lh-flex lh-flex-col lh-items-center lh-justify-center lh-p-2.5 lh-rounded-lg lh-bg-white/80 lh-border lh-transition-all hover:lh-border-slate-300/80 hover:lh-bg-white hover:lh-shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] hover:lh-scale-[1.02]",
                  selectedFunction === func.id
                    ? "lh-border-slate-300/80 lh-bg-white lh-shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] lh-ring-2 lh-ring-slate-200/50"
                    : "lh-border-slate-200/60"
                )}
                onClick={() => {
                  setSelectedFunction(func.id)
                  onSelectFunction(func)
                }}>
                <div
                  className={cn(
                    "lh-absolute lh-inset-0 lh-rounded-lg lh-bg-gradient-to-br lh-transition-all lh-z-0",
                    selectedFunction === func.id
                      ? "lh-from-slate-50/50 lh-to-slate-100/50 lh-opacity-100"
                      : "lh-from-slate-50/0 lh-to-slate-100/0 lh-opacity-0 group-hover:lh-from-slate-50/50 group-hover:lh-to-slate-100/50 group-hover:lh-opacity-100"
                  )}
                />
                {selectedFunction === func.id && <SelectedCornerMark />}
                <div
                  className={cn(
                    "lh-flex lh-items-center lh-justify-center lh-w-7 lh-h-7 lh-mb-1.5 lh-rounded-lg lh-bg-gradient-to-br lh-text-slate-600 lh-transition-all lh-shadow-sm lh-relative lh-z-10",
                    selectedFunction === func.id
                      ? "lh-from-slate-200/80 lh-to-slate-300/80 lh-text-slate-800 lh-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                      : "lh-from-slate-100/80 lh-to-slate-200/80 group-hover:lh-from-slate-200/80 group-hover:lh-to-slate-300/80 group-hover:lh-text-slate-800"
                  )}>
                  <func.icon className="lh-w-3.5 lh-h-3.5" />
                </div>
                <div className="lh-text-center lh-relative lh-z-10">
                  <div
                    className={cn(
                      "lh-text-xs lh-font-medium lh-tracking-tight",
                      selectedFunction === func.id
                        ? "lh-text-slate-900 lh-font-semibold"
                        : "lh-text-slate-700 group-hover:lh-text-slate-900"
                    )}>
                    {func.title}
                  </div>
                  <div
                    className={cn(
                      "lh-text-[10px] lh-mt-0.5 lh-leading-tight",
                      selectedFunction === func.id
                        ? "lh-text-slate-600"
                        : "lh-text-slate-500 group-hover:lh-text-slate-600 lh-opacity-80"
                    )}>
                    {func.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
