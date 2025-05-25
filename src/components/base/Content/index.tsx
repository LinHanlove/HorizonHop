import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from '~components/ui/button'
import { cn } from "@/utils/shadcn"

import {
  Search,
  Settings,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Camera,
  Code,
  FileText,
  Zap,
  RefreshCw,
  Download,
  Menu,
} from "lucide-react"



export default function Content() {
  // Special function buttons (left side)
const functionButtons = [
  { id: 1, name: "截图", icon: Camera, action: "screenshot", description: "快速截取屏幕" },
  { id: 2, name: "刷新", icon: RefreshCw, action: "refresh", description: "刷新当前页面" },
  { id: 3, name: "格式化", icon: Code, action: "format", description: "JSON格式化工具" },
  { id: 4, name: "下载", icon: Download, action: "download", description: "下载管理器" },
  { id: 5, name: "文档", icon: FileText, action: "docs", description: "查看帮助文档" },
  { id: 6, name: "工具", icon: Zap, action: "tools", description: "更多实用工具" },
]

// Website shortcuts (right side)
const defaultShortcuts = [
  { id: 1, name: "baidu", icon: "🔍", url: "https://baidu.com", category: "search" },
  { id: 2, name: "google", icon: "🌐", url: "https://google.com", category: "search" },
  { id: 3, name: "github", icon: "🐙", url: "https://github.com", category: "dev" },
  { id: 4, name: "npm", icon: "📦", url: "https://npmjs.com", category: "dev" },
  { id: 5, name: "juejin", icon: "💎", url: "https://juejin.cn", category: "dev" },
  { id: 6, name: "csdn", icon: "📝", url: "https://csdn.net", category: "dev" },
  { id: 7, name: "iconify", icon: "🎨", url: "https://iconify.design", category: "design" },
  { id: 8, name: "vant", icon: "📱", url: "#", category: "dev" },
  { id: 9, name: "element", icon: "🐳", url: "#", category: "dev" },
  { id: 10, name: "antd", icon: "🐜", url: "#", category: "dev" },
  { id: 11, name: "figma", icon: "🎨", url: "https://figma.com", category: "design" },
  { id: 12, name: "dribbble", icon: "🏀", url: "https://dribbble.com", category: "design" },
]
  const [searchQuery, setSearchQuery] = useState("")
  const [shortcuts, setShortcuts] = useState(defaultShortcuts)
  const [isAddingShortcut, setIsAddingShortcut] = useState(false)
  const [newShortcut, setNewShortcut] = useState({ name: "", url: "", icon: "🔗", category: "other" })
  const [showSettings, setShowSettings] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false)
  const [hoveredFunction, setHoveredFunction] = useState<number | null>(null)

   const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group shortcuts by category
  const categories = Array.from(new Set(filteredShortcuts.map((s) => s.category)))

  // Get shortcuts for active category or all if no category is selected
  const displayedShortcuts = activeCategory
    ? filteredShortcuts.filter((s) => s.category === activeCategory)
    : filteredShortcuts



  // Handle function button click
  const handleFunctionClick = (action: string) => {
    switch (action) {
      case "screenshot":
        console.log("Taking screenshot...")
        break
      case "refresh":
        window.location.reload()
        break
      case "format":
        console.log("Opening JSON formatter...")
        break
      case "download":
        console.log("Opening download manager...")
        break
      case "docs":
        window.open("https://docs.example.com", "_blank")
        break
      case "tools":
        console.log("Opening tools...")
        break
      default:
        break
    }
  }

   // Handle shortcut click
  const handleShortcutClick = (url: string) => {
    window.open(url, "_blank")
  }

  return (
     <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Function Panel */}
        <motion.div
          animate={{ width: leftPanelExpanded ? 160 : 60 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative bg-white/90 backdrop-blur-sm border-r border-slate-200/60 shadow-sm z-10"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Toggle button */}
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

            {/* Function buttons */}
            <div className="flex-1 px-2 pb-3">
              <div className="space-y-1">
                {functionButtons.map((func, index) => (
                  <motion.button
                    key={func.id}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group relative w-full flex items-center p-2.5 rounded-lg transition-all duration-200 hover:bg-slate-100/80 focus:outline-none"
                    onClick={() => handleFunctionClick(func.action)}
                    onMouseEnter={() => setHoveredFunction(func.id)}
                    onMouseLeave={() => setHoveredFunction(null)}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100/80 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-200/80 transition-all shadow-sm">
                      <func.icon className="h-4 w-4" />
                    </div>

                    <AnimatePresence>
                      {leftPanelExpanded && (
                        <motion.div
                          transition={{ duration: 0.15 }}
                          className="ml-3 flex-1 text-left"
                        >
                          <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                            {func.name}
                          </div>
                          <div className="text-xs text-slate-500 group-hover:text-slate-600 leading-tight">
                            {func.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed state */}
                    <AnimatePresence>
                      {!leftPanelExpanded && hoveredFunction === func.id && (
                        <motion.div
                          exit={{ opacity: 0, x: -5 }}
                          className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap border border-slate-700"
                        >
                          {func.name}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Shortcuts Area */}
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm">
          {/* Category Pills */}
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

          {/* Shortcuts Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {displayedShortcuts.map((shortcut, index) => (
                <motion.button
                  key={shortcut.id}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative flex flex-col items-center justify-center p-2 rounded-[4px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/15 focus:outline-none bg-white/90 backdrop-blur-sm border border-slate-200/50"
                  onClick={() => handleShortcutClick(shortcut.url)}
                >
                  <div className="flex items-center justify-center w-6 h-6 mb-2 text-2xl transition-transform group-hover:scale-110 group-hover:rotate-12">
                    {shortcut.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate w-full text-center transition-colors">
                    {shortcut.name}
                  </span>

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-[4px] bg-gradient-to-br from-slate-500/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              ))}

              {/* Add new shortcut button */}
              <motion.button
                transition={{ duration: 0.3, delay: displayedShortcuts.length * 0.05 }}
                className="group relative flex flex-col items-center justify-center p-2 rounded-[4px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/15 focus:outline-none bg-white/60 backdrop-blur-sm border border-slate-200/50 border-dashed"
                onClick={() => setIsAddingShortcut(true)}
              >
                <div className="flex items-center justify-center w-6 h-6 mb-2 rounded-full bg-slate-100 text-slate-400 transition-all group-hover:text-slate-600 group-hover:bg-slate-200 group-hover:scale-110">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-[10px] text-nowrap font-medium text-slate-400 group-hover:text-slate-600">添加</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
  )
}
