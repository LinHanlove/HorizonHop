import { useEffect, useState } from "react"

import { SEND_FROM } from "~constants"
import { getLocal, sendMessage, setLocal } from "~utils"

interface Option {
  shortcuts?: TYPE.Shortcuts[]
}
export const useSearch = (option?: Option) => {
  const { shortcuts } = option
  // 搜索值
  const [searchQuery, setSearchQuery] = useState("")

  // 搜索目标网址
  const [searchTarget, setSearchTarget] = useState<TYPE.Shortcuts | null>(null)

  // 当前类目
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // 是否展开左侧面板
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false)

  // 当前鼠标hover的快捷方式
  const [hoveredFunction, setHoveredFunction] = useState(null)

  // 当前tab选的快捷方式
  const [tabActiveShortcut, setTabActiveShortcut] =
    useState<TYPE.Shortcuts | null>(null)

  // 当前分类的快捷方式
  const displayedShortcuts = activeCategory
    ? shortcuts?.filter((s) => s.category === activeCategory) || []
    : shortcuts || []

  // 初始化时从本地存储加载数据
  useEffect(() => {
    getLocal({
      key: "searchTarget",
      chrome
    }).then((data) => {
      setSearchTarget(data || null)
      console.log("读取数据searchTarget", data, searchTarget)
    })

    getLocal({
      key: "activeCategory",
      chrome
    }).then((data) => {
      setActiveCategory(data || null)
    })
  }, [chrome])

  // 根据searchTarget或displayedShortcuts初始化tabActiveShortcut
  useEffect(() => {
    if (
      searchTarget &&
      displayedShortcuts.some((s) => s.id === searchTarget.id)
    ) {
      setTabActiveShortcut(searchTarget)
    } else if (displayedShortcuts.length > 0) {
      setTabActiveShortcut(displayedShortcuts[0])
    } else {
      setTabActiveShortcut(null)
    }
  }, [displayedShortcuts, searchTarget])

  // 监听搜索值变化
  useEffect(() => {
    setLocal({
      key: "searchTarget",
      value: JSON.stringify(searchTarget),
      chrome
    })
    setLocal({
      key: "activeCategory",
      value: JSON.stringify(activeCategory),
      chrome
    })
    sendMessage({
      type: "categoryChange",
      origin: SEND_FROM.popup,
      chrome
    })
  }, [searchTarget, activeCategory])

  /**
   * @function 选中快捷方式
   */
  const onSelectShortcut = (shortcut: TYPE.Shortcuts) => {
    if (!shortcut.id) return
    setSearchTarget(shortcut)
    // 如果搜索框有值则直接跳转
    if (searchQuery) {
      onSearch(shortcut)
    }
  }

  /**
   * @function 回车搜索
   */
  const onEnterSearch = (e) => {
    if (!searchTarget || !searchQuery || e.key !== "Enter") return
    onSearch(searchTarget)
  }

  /**
   * @function 跳转搜索
   */
  const onSearch = (option) => {
    window.open(
      `${option.prefix}${encodeURIComponent(searchQuery)}${option.suffix}`,
      "_blank"
    )
  }

  // 处理键盘事件，切换选中快捷方式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (displayedShortcuts.length === 0) return
      if (e.key === "Tab") {
        e.preventDefault()
        const currentIndex = tabActiveShortcut
          ? displayedShortcuts.findIndex((s) => s.id === tabActiveShortcut.id)
          : -1
        const nextIndex = (currentIndex + 1) % displayedShortcuts.length
        const nextShortcut = displayedShortcuts[nextIndex]
        setTabActiveShortcut(nextShortcut)
        setSearchTarget(nextShortcut)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (tabActiveShortcut && searchQuery) {
          onSearch(tabActiveShortcut)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [displayedShortcuts, tabActiveShortcut, searchQuery, onSearch])

  return {
    searchQuery,
    setSearchQuery,
    searchTarget,
    setSearchTarget,
    activeCategory,
    setActiveCategory,
    leftPanelExpanded,
    setLeftPanelExpanded,
    tabActiveShortcut,
    setTabActiveShortcut,
    onSelectShortcut,
    onEnterSearch,
    displayedShortcuts,
    hoveredFunction,
    setHoveredFunction
  }
}
