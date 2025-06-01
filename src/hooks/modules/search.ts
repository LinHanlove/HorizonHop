import { useCallback, useEffect, useState } from "react"

import { getLocal, setLocal } from "~utils"

export const useSearch = () => {
  // 搜索值
  const [searchQuery, setSearchQuery] = useState("")

  // 搜索目标网址
  const [searchTarget, setSearchTarget] = useState<TYPE.Shortcuts | null>(null)

  // 当前类目
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // 是否展开左侧面板
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false)

  // 功能区当前鼠标悬停的快捷方式索引
  const [hoveredFunction, setHoveredFunction] = useState<number | null>(null)

  // 初始化时从本地存储加载数据
  useEffect(() => {
    getLocal({
      key: "searchTarget",
      chrome
    }).then((data) => {
      setSearchTarget(data || {})
      console.log("读取数据searchTarget", data, searchTarget)
    })
  }, [chrome])

  // 监听搜索值变化
  useEffect(() => {
    setLocal({
      key: "searchTarget",
      value: JSON.stringify(searchTarget),
      chrome
    })
  }, [searchTarget])

  /**
   * @function 选中快捷方式
   */
  const onSelectShortcut = (shortcut: TYPE.Shortcuts) => {
    if (!shortcut.id) return
    setSearchTarget(shortcut)
  }

  /**
   * @function 回车搜索
   */
  const onEnterSearch = (e) => {
    if (!searchTarget || !searchQuery || e.key !== "Enter") return
    window.open(
      `${searchTarget.prefix}${encodeURIComponent(searchQuery)}${searchTarget.suffix}`,
      "_blank"
    )
  }
  return {
    searchQuery,
    setSearchQuery,
    searchTarget,
    setSearchTarget,
    activeCategory,
    setActiveCategory,
    leftPanelExpanded,
    setLeftPanelExpanded,
    hoveredFunction,
    setHoveredFunction,
    onSelectShortcut,
    onEnterSearch
  }
}
