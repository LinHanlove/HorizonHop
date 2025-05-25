import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from '~components/ui/button'
import { cn } from "@/utils/shadcn"

import {
  Plus,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { defaultShortcuts, menuList, POPUP_TYPE } from '~constants'
import { sendMessage } from '~utils'



export default function Content() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shortcuts, setShortcuts] = useState(defaultShortcuts)
  const [newShortcut, setNewShortcut] = useState({ name: "", url: "", icon: "🔗", category: "other" })
  const [showSettings, setShowSettings] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  // 是否展开左侧面板
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false)
  // 当前鼠标悬停的快捷方式索引
  const [hoveredFunction, setHoveredFunction] = useState<number | null>(null)

   const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.alias.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  /**
   * @ array 按分类的快捷方式
   */
  const categories = Array.from(new Set(filteredShortcuts.map((s) => s.category))) as string[]

  // Get shortcuts for active category or all if no category is selected
  const displayedShortcuts = activeCategory
    ? filteredShortcuts.filter((s) => s.category === activeCategory)
    : filteredShortcuts



  // Handle function button click
  const handleFunctionClick = (event: () => void) => {
      event(); // Execute the function directly
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
     <div className="flex-1 flex overflow-hidden">
        {/* S 侧边栏 - 功能菜单 */}
        <motion.div
          animate={{ width: leftPanelExpanded ? 160 : 60 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative bg-white/90 backdrop-blur-sm border-r border-slate-200/60 shadow-sm z-10"
        >
          {/* S 背景 */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
          {/* E 背景 */}

          <div className="relative z-10 flex flex-col h-full">
            {/* S 切换键 */}
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100/80"
                onClick={() => setLeftPanelExpanded(!leftPanelExpanded)}
              >
                {leftPanelExpanded ? <ChevronLeft className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
              </Button>
            </div>
            {/* E 切换键 */}

            {/* S 功能按钮 */}
            <div className="flex-1 px-2 pb-3">
              <div className="space-y-1">
                {menuList.map((func, index) => (
                  <motion.button
                    key={func.title}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group relative w-full flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-slate-100/80 focus:outline-none"
                    onClick={func.event}
                    onMouseEnter={() => setHoveredFunction(index)}
                    onMouseLeave={() => setHoveredFunction(null)}
                  >
                    {
                      !leftPanelExpanded && 
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100/80 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-200/80 transition-all shadow-sm">
                        <func.icon className="h-4 w-4" />
                      </div>
                    }

                    <AnimatePresence>
                      {leftPanelExpanded && (
                        <motion.div
                          transition={{ duration: 0.15 }}
                          className="flex-1 text-left"
                        >
                          <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                            {func.title}
                          </div>
                          <div className="text-xs text-slate-500 group-hover:text-slate-600 leading-tight">
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
                        className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap border border-slate-700 pointer-events-none"
                      >
                        {func.description}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                      </motion.div>
                    </AnimatePresence>)}
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
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm">
          {/* S 分类栏 */}
          <div className="p-2 border-b border-slate-200/50">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              <button
                className={cn(
                  "px-3 py-1 rounded-[4px] tex-lg font-medium whitespace-nowrap transition-all shadow-sm",
                  activeCategory === null
                    ? "bg-slate-800 text-white shadow-slate-800/25"
                    : "bg-white/90 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200/50",
                )}
                onClick={() => setActiveCategory(null)}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={cn(
                    "px-3 py-1 rounded-[4px] tex-lg  font-medium whitespace-nowrap transition-all shadow-sm",
                    activeCategory === category
                      ? "bg-slate-800 text-white shadow-slate-800/25"
                      : "bg-white/90 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200/50",
                  )}
                  onClick={() => setActiveCategory(category)}
                >
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
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {displayedShortcuts.map((shortcut, index) => (
                <motion.button
                  key={shortcut.alias}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative flex flex-col items-center justify-center p-2 rounded-[4px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/15 focus:outline-none bg-white/90 backdrop-blur-sm border border-slate-200/50"
                  onClick={() => handleShortcutClick(shortcut.prefix)}
                >
                  <div className="flex items-center justify-center w-6 h-6 mb-2 text-2xl transition-transform group-hover:scale-110 group-hover:rotate-12">
                    <shortcut.icon  className={cn('h-4 w-4')} style={{ color: shortcut.iconColor }} />
                  </div>
                  <span className="text-[12px] font-medium text-slate-700 group-hover:text-slate-900 truncate w-full text-center transition-colors">
                    {shortcut.alias}
                  </span>

                  {/* 悬浮 */}
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-br from-slate-500/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              ))}

              {/* 添加 */}
              <motion.button
                transition={{ duration: 0.3, delay: displayedShortcuts.length * 0.05 }}
                className="group relative flex flex-col items-center justify-center p-2 rounded-[4px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/15 focus:outline-none bg-white/60 backdrop-blur-sm border border-slate-200/50 border-dashed"
                onClick={onAddShortcut}
              >
                <div className="flex items-center justify-center w-6 h-6 mb-2 rounded-full bg-slate-100 text-slate-400 transition-all group-hover:text-slate-600 group-hover:bg-slate-200 group-hover:scale-110">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-[10px] text-nowrap font-medium text-slate-400 group-hover:text-slate-600">添加</span>
              </motion.button>
            </div>
          </div>
          {/* E 快捷搜索 */}
        </div>
        {/* E 右边内容 - 快捷搜索 */}
      </div>
  )
}
