import React, { createContext, useContext, useSyncExternalStore } from "react"

import { useSearch } from "~hooks"

import Content from "../Content"
import Header from "../Header"

// 创建 Context
export const SearchContext = createContext<ReturnType<typeof useSearch> | null>(
  null
)

// 创建 Provider 组件
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const searchProps = useSearch()
  return (
    <SearchContext.Provider value={searchProps}>
      {children}
    </SearchContext.Provider>
  )
}

// 创建自定义 Hook 来使用 Context
export const useSearchContext = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider")
  }

  // 使用 useSyncExternalStore 来确保状态同步
  const subscribe = (callback: () => void) => {
    return () => {}
  }

  const getSnapshot = () => {
    return context
  }

  const searchState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return searchState
}

export default function Layout() {
  return (
    <SearchProvider>
      <div className="lh-flex lh-flex-col lh-h-auto lh-w-[360px] lh-overflow-hidden lh-bg-gradient-to-br lh-from-slate-50 lh-via-gray-50 lh-to-slate-100">
        {/* S 头部 */}
        <Header />
        {/* E 头部 */}

        {/* S 内容部分 */}
        <Content />
        {/* E 内容部分 */}
      </div>
    </SearchProvider>
  )
}
