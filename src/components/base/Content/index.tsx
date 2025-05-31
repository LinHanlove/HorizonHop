import { cn } from "@/utils/shadcn"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, Menu, Plus } from "lucide-react"
import React, { useState } from "react"

import { Button } from "~components/ui/button"
import { defaultShortcuts, menuList, POPUP_TYPE } from "~constants"
import { sendMessage } from "~utils"

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shortcuts, setShortcuts] = useState(defaultShortcuts)
  const [newShortcut, setNewShortcut] = useState({
    name: "",
    url: "",
    icon: "🔗",
    category: "other"
  })
  const [showSettings, setShowSettings] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  // 是否展开左侧面板
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false)
  // 当前鼠标悬停的快捷方式索引
  const [hoveredFunction, setHoveredFunction] = useState<number | null>(null)

  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.alias.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /**
   * @ array 按分类的快捷方式
   */
  const categories = Array.from(
    new Set(filteredShortcuts.map((s) => s.category))
  ) as string[]

  // Get shortcuts for active category or all if no category is selected
  const displayedShortcuts = activeCategory
    ? filteredShortcuts.filter((s) => s.category === activeCategory)
    : filteredShortcuts

  // Handle function button click
  const handleFunctionClick = (event: () => void) => {
    event() // Execute the function directly
  }

  // Handle shortcut click
  const handleShortcutClick = (url: string) => {
    window.open(url, "_blank")
  }

  /**
   * @function 添加快捷方式
   */
  const onAddShortcut = () => {
    sendMessage({
      type: POPUP_TYPE.addNewShortcut,
      origin: "popup",
      chrome
    })
  }

  return (
    <div className="lh-flex-1 lh-flex lh-overflow-hidden">
      {/* S 侧边栏 - 功能菜单 */}
      <motion.div
        animate={{ width: leftPanelExpanded ? 160 : 60 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lh-relative lh-bg-white/90 lh-backdrop-blur-sm lh-border-r lh-border-slate-200/60 lh-shadow-sm lh-z-10">
        {/* S 背景 */}
        <div className="lh-absolute lh-inset-0 lh-opacity-[0.02]">
          <div
            className="lh-absolute lh-inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105) 1px, transparent 0)`,
              backgroundSize: "20px 20px"
            }}></div>
        </div>
        {/* E 背景 */}

        <div className="lh-relative lh-z-10 lh-flex lh-flex-col lh-h-full">
          {/* S 切换键 */}
          <div className="lh-flex lh-justify-end lh-p-2">
            <Button
              variant="ghost"
              size="icon"
              className="lh-w-6 lh-h-6 lh-rounded-md lh-text-slate-400 hover:lh-text-slate-600 hover:lh-bg-slate-100/80"
              onClick={() => setLeftPanelExpanded(!leftPanelExpanded)}>
              {leftPanelExpanded ? (
                <ChevronLeft className="lh-w-3 lh-h-3" />
              ) : (
                <Menu className="lh-w-3 lh-h-3" />
              )}
            </Button>
          </div>
          {/* E 切换键 */}

          {/* S 功能按钮 */}
          <div className="lh-flex-1 lh-px-2 lh-pb-3">
            <div className="lh-space-y-1">
              {menuList.map((func, index) => (
                <motion.button
                  key={func.title}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="lh-group lh-relative lh-w-full lh-flex lh-items-center lh-p-2 lh-rounded-lg lh-transition-all lh-duration-200 hover:lh-bg-slate-100/80 focus:lh-outline-none"
                  onClick={func.event}
                  onMouseEnter={() => setHoveredFunction(index)}
                  onMouseLeave={() => setHoveredFunction(null)}>
                  {!leftPanelExpanded && (
                    <div className="lh-flex lh-items-center lh-justify-center lh-w-7 lh-h-7 lh-rounded-lg lh-bg-slate-100/80 lh-text-slate-500 group-hover:lh-text-slate-700 group-hover:lh-bg-slate-200/80 lh-transition-all lh-shadow-sm">
                      <func.icon className="lh-h-4 lh-w-4" />
                    </div>
                  )}

                  <AnimatePresence>
                    {leftPanelExpanded && (
                      <motion.div
                        transition={{ duration: 0.15 }}
                        className="lh-flex-1 lh-text-left">
                        <div className="lh-text-sm lh-font-medium lh-text-slate-700 group-hover:lh-text-slate-900">
                          {func.title}
                        </div>
                        <div className="lh-text-xs lh-text-slate-500 group-hover:lh-text-slate-600 lh-leading-tight">
                          {func.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* S 鼠标悬浮提示 */}
                  {!leftPanelExpanded && hoveredFunction === index && (
                    <AnimatePresence>
                      <motion.div
                        exit={{ opacity: 0, x: -5 }}
                        className="lh-absolute lh-left-full lh-ml-2 lh-px-3 lh-py-2 lh-bg-slate-800 lh-text-white lh-text-sm lh-rounded-lg lh-shadow-lg lh-z-50 lh-whitespace-nowrap lh-border lh-border-slate-700 lh-pointer-events-none">
                        {func.description}
                        <div className="lh-absolute lh-left-0 lh-top-1/2 lh-transform lh--translate-y-1/2 lh--translate-x-1 lh-w-2 lh-h-2 lh-bg-slate-800 lh-rotate-45 lh-border-l lh-border-b lh-border-slate-700"></div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  {/* E 鼠标悬浮提示 */}
                </motion.button>
              ))}
            </div>
          </div>
          {/* E 功能按钮 */}
        </div>
      </motion.div>
      {/* E 侧边栏 */}

      {/* S 右边内容 - 快捷搜索 */}
      <div className="lh-flex-1 lh-flex lh-flex-col lh-bg-white/70 lh-backdrop-blur-sm">
        {/* S 分类栏 */}
        <div className="lh-p-2 lh-border-b lh-border-slate-200/50">
          <div className="lh-flex lh-space-x-2 lh-overflow-x-auto lh-scrollbar-hide">
            <button
              className={cn(
                "lh-px-3 lh-py-1 lh-rounded-[4px] lh-tex-lg lh-font-medium lh-whitespace-nowrap lh-transition-all lh-shadow-sm",
                activeCategory === null
                  ? "lh-bg-slate-800 lh-text-white lh-shadow-slate-800/25"
                  : "lh-bg-white/90 lh-text-slate-600 hover:lh-bg-white hover:lh-shadow-md lh-border lh-border-slate-200/50"
              )}
              onClick={() => setActiveCategory(null)}>
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={cn(
                  "lh-px-3 lh-py-1 lh-rounded-[4px] lh-tex-lg  lh-font-medium lh-whitespace-nowrap lh-transition-all lh-shadow-sm",
                  activeCategory === category
                    ? "lh-bg-slate-800 lh-text-white lh-shadow-slate-800/25"
                    : "lh-bg-white/90 lh-text-slate-600 hover:lh-bg-white hover:lh-shadow-md lh-border lh-border-200/50"
                )}
                onClick={() => setActiveCategory(category)}>
                {category === "dev" && "开发"}
                {category === "search" && "搜索"}
                {category === "tools" && "工具"}
                {category === "design" && "设计"}
                {category === "other" && "其他"}
              </button>
            ))}
          </div>
        </div>
        {/* E 分类栏 */}
        {/* S 快捷搜索 */}
        <div className="lh-flex-1 lh-p-4 lh-overflow-y-auto">
          <div className="lh-grid lh-grid-cols-4 lh-gap-2">
            {displayedShortcuts.map((shortcut, index) => (
              <motion.button
                key={shortcut.alias}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="lh-group lh-relative lh-flex lh-flex-col lh-items-center lh-justify-center lh-p-2 lh-rounded-[4px] lh-transition-all lh-duration-300 hover:lh-scale-105 hover:lh-shadow-lg hover:lh-shadow-slate-500/15 focus:lh-outline-none lh-bg-white/90 lh-backdrop-blur-sm lh-border lh-border-slate-200/50"
                onClick={() => handleShortcutClick(shortcut.prefix)}>
                <div className="lh-flex lh-items-center lh-justify-center lh-w-6 lh-h-6 lh-mb-2 lh-text-2xl lh-transition-transform lh-group-hover:scale-110 group-hover:lh-rotate-12">
                  {typeof shortcut.icon !== "string" ? (
                    <shortcut.icon
                      className={cn("lh-h-4 lh-w-4")}
                      style={{ color: shortcut.iconColor }}
                    />
                  ) : (
                    <span className="lh-h-4 lh-w-4">shortcut.icon</span>
                  )}
                </div>

                <span className="lh-text-[12px] lh-font-medium lh-text-slate-700 group-hover:lh-text-slate-900 lh-truncate lh-w-full lh-text-center lh-transition-colors">
                  {shortcut.alias}
                </span>

                {/* 悬浮 */}
                <div className="lh-absolute lh-inset-0 lh-rounded-[4px] lh-bg-gradient-to-br lh-from-slate-500/5 lh-to-slate-600/5 lh-opacity-0 group-hover:lh-opacity-100 lh-transition-opacity lh-duration-300"></div>
              </motion.button>
            ))}

            {/* 添加 */}
            <motion.button
              transition={{
                duration: 0.3,
                delay: displayedShortcuts.length * 0.05
              }}
              className="lh-group lh-relative lh-flex lh-flex-col lh-items-center lh-justify-center lh-p-2 lh-rounded-[4px] lh-transition-all lh-duration-300 hover:lh-scale-105 hover:lh-shadow-lg hover:lh-shadow-slate-500/15 focus:lh-outline-none lh-bg-white/60 lh-backdrop-blur-sm lh-border lh-border-slate-200/50 lh-border-dashed"
              onClick={onAddShortcut}>
              <div className="lh-flex lh-items-center lh-justify-center lh-w-6 lh-h-6 lh-mb-2 lh-rounded-full lh-bg-slate-100 lh-text-slate-400 lh-transition-all group-hover:lh-text-slate-600 group-hover:lh-bg-slate-200 group-hover:lh-scale-110">
                <Plus className="lh-h-6 lh-w-6" />
              </div>
              <span className="lh-text-[10px] lh-text-nowrap lh-font-medium lh-text-slate-400 group-hover:lh-text-slate-600">
                添加
              </span>
            </motion.button>
          </div>
        </div>
        {/* E 快捷搜索 */}
      </div>
      {/* E 右边内容 - 快捷搜索 */}
    </div>
  )
}
