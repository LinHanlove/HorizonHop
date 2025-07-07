import Dialog, {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import SelectedCornerMark from "@/components/base/SelectedCornerMark"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@iconify/react"
import React, { useEffect, useRef, useState } from "react"

import { MESSAGE_TYPE, SEND_FROM } from "~constants"
import { sendMessageRuntime } from "~utils"

/**
 * @function BookmarkSearch 书签搜索
 * @param param0 { open, setOpen }
 * @returns
 */
const RenderAccordion = ({ groups }) => {
  const [active, setActive] = React.useState("")
  return (
    <Accordion
      type="single"
      collapsible
      value={active}
      onValueChange={setActive}>
      {groups.map((group) =>
        group.children && group.children.length ? (
          <AccordionItem value={group.id} key={group.id}>
            <div className="lh-relative">
              <AccordionTrigger>
                <span className="lh-font-bold lh-text-base lh-text-slate-700 lh-flex lh-items-center">
                  {group.title}
                  {active === group.id && <SelectedCornerMark />}
                </span>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="lh-space-y-2 lh-pl-2">
                <RenderAccordion groups={group.children} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ) : group.url ? (
          <div
            key={group.id}
            className="lh-flex lh-items-center lh-gap-2 lh-p-2 lh-rounded hover:lh-bg-slate-100 lh-cursor-pointer lh-transition-all"
            onClick={() => window.open(group.url, "_blank")}>
            <Icon icon="mdi:bookmark-outline" className="lh-h-5 lh-w-5" />
            <span
              className="lh-font-medium lh-text-slate-700 lh-whitespace-nowrap lh-overflow-hidden lh-text-ellipsis"
              style={{ maxWidth: "400px", display: "inline-block" }}>
              {group.title}
            </span>
          </div>
        ) : null
      )}
    </Accordion>
  )
}

// 定义书签类型
interface BookmarkNode {
  id: string
  title: string
  url?: string
  children?: BookmarkNode[]
  [key: string]: any
}

export default function BookmarkSearch({ open, setOpen }) {
  const [bookmarks, setBookmarks] = useState<{ children: BookmarkNode[] }>({
    children: []
  })
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<{ children: BookmarkNode[] }>({
    children: []
  })
  const [activeTab, setActiveTab] = useState("1") // 默认tab为书签栏id
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(
    null
  )
  const matchedBookmarksRef = useRef<any[]>([])
  const bookmarkRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      sendMessageRuntime({
        type: MESSAGE_TYPE.getBookmarks,
        origin: SEND_FROM.content,
        chrome
      })
        .then((res) => {
          const result = res as { bookmarks }
          if (result?.bookmarks) {
            setBookmarks(result.bookmarks)
          }
        })
        .finally(() => {
          setLoading(false)
        })
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [open])

  useEffect(() => {
    if (!search) {
      setFiltered(bookmarks)
    } else {
      // 递归过滤，返回对象结构
      const filterBookmarks = (node) => {
        if (!node) return null
        if (node.children) {
          const filteredChildren = node.children
            .map(filterBookmarks)
            .filter(Boolean)
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren }
          }
          // 如果自己是分组但没有匹配的子项，且自己不是匹配项，则不返回
          if (node.title?.toLowerCase().includes(search.toLowerCase())) {
            return { ...node, children: [] }
          }
          return null
        } else if (node.title?.toLowerCase().includes(search.toLowerCase())) {
          return node
        }
        return null
      }
      const filteredResult = filterBookmarks(bookmarks)
      setFiltered(filteredResult || { children: [] })
    }
  }, [search, bookmarks])

  // 获取tab列表（顶层children）
  const tabList = filtered.children || []

  // 获取所有匹配的书签项（递归所有分组，返回一维数组）
  const getMatchedBookmarks = (nodes, keyword) => {
    let result = []
    nodes.forEach((node) => {
      if (node.children) {
        result = result.concat(getMatchedBookmarks(node.children, keyword))
      } else if (node.title?.toLowerCase().includes(keyword.toLowerCase())) {
        result.push(node)
      }
    })
    return result
  }

  // 监听Tab/Enter键切换和打开
  useEffect(() => {
    if (!open || !search) return
    const handleKeyDown = (e: KeyboardEvent) => {
      const matched = matchedBookmarksRef.current
      if (!matched.length) return
      if (e.key === "Tab") {
        e.preventDefault()
        const currentIndex = matched.findIndex(
          (item) => item.id === selectedBookmarkId
        )
        const nextIndex = (currentIndex + 1) % matched.length
        setSelectedBookmarkId(matched[nextIndex].id)
      }
      if (e.key === "Enter") {
        e.preventDefault()
        const selected = matched.find((item) => item.id === selectedBookmarkId)
        if (selected) window.open(selected.url, "_blank")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, search, selectedBookmarkId])

  // 搜索结果变化时，默认选中第一个
  useEffect(() => {
    if (!search) {
      setSelectedBookmarkId(null)
      matchedBookmarksRef.current = []
      return
    }
    const matched = getMatchedBookmarks(bookmarks.children, search)
    matchedBookmarksRef.current = matched
    setSelectedBookmarkId(matched[0]?.id || null)
    bookmarkRefs.current = {}
  }, [search, bookmarks])

  // 选中项变化时自动滚动到可视区域
  useEffect(() => {
    if (!search || !selectedBookmarkId) return
    const el = bookmarkRefs.current[selectedBookmarkId]
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [selectedBookmarkId, search])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:lh-max-w-[500px] lh-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="lh-flex lh-items-center lh-justify-center ">
              <h2 className="lh-text-xl lh-font-bold lh-text-slate-800 lh-text-center">
                书签搜索
              </h2>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="lh-flex lh-flex-col lh-items-center lh-justify-center lh-space-y-2 lh-mb-2">
            <p className="lh-text-sm lh-text-center lh-text-slate-600 lh-font-medium lh-tracking-wide lh-leading-relaxed lh-max-w-[90%]">
              全局模糊搜索书签，输入关键词即可实时查找所有书签。
            </p>
            <div className="lh-flex lh-items-center lh-justify-center lh-space-x-2 lh-text-xs lh-text-slate-400 lh-mt-1">
              <span className="lh-flex lh-items-center lh-space-x-1">
                <kbd className="lh-px-1.5 lh-py-0.5 lh-bg-slate-100 lh-rounded lh-border lh-border-slate-200/60 lh-text-slate-600 lh-font-mono lh-text-[10px]">
                  <Icon icon="mdi:keyboard-tab" className="lh-w-4 lh-h-4" />
                </kbd>
                <span>Tab</span>
                <span>切换选中</span>
              </span>
              <span className="lh-h-3 lh-w-px lh-bg-slate-200 lh-mx-2"></span>
              <span className="lh-flex lh-items-center lh-space-x-1">
                <kbd className="lh-px-1.5 lh-py-0.5 lh-bg-slate-100 lh-rounded lh-border lh-border-slate-200/60 lh-text-slate-600 lh-font-mono lh-text-[10px]">
                  Enter
                </kbd>
                <span>打开书签</span>
              </span>
            </div>
            {loading && (
              <div className="lh-w-full lh-flex lh-flex-col lh-items-center lh-justify-center lh-my-6">
                <span className="lh-flex lh-items-center lh-gap-2 lh-text-lg lh-font-bold lh-text-blue-500">
                  <svg
                    className="lh-animate-spin"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#3B82F6"
                      strokeWidth="4"
                      opacity="0.2"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="#3B82F6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  正在加载书签...
                </span>
              </div>
            )}
          </div>
        </DialogDescription>
        <Input
          ref={inputRef}
          placeholder="输入书签名称搜索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lh-mb-2"
        />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {tabList && tabList.length > 0 ? (
            <TabsList>
              {tabList &&
                tabList
                  .filter(
                    (tab) =>
                      !(
                        Array.isArray(tab.children) &&
                        tab.children.length === 0 &&
                        !tab.url
                      )
                  )
                  .map((tab) => (
                    <TabsTrigger
                      value={tab.id}
                      key={tab.id}
                      className="lh-relative">
                      {tab.title}
                    </TabsTrigger>
                  ))}
            </TabsList>
          ) : null}

          {tabList && tabList.length ? (
            tabList.map((tab) => (
              <TabsContent value={tab.id} key={tab.id}>
                <div className="lh-max-h-96 lh-overflow-y-auto lh-space-y-2">
                  {search ? (
                    <div className="lh-space-y-2">
                      {getMatchedBookmarks(bookmarks.children, search).map(
                        (item) => (
                          <div
                            key={item.id}
                            className={
                              "lh-relative lh-flex lh-items-center lh-gap-2 lh-p-2 lh-rounded hover:lh-bg-slate-100 lh-cursor-pointer lh-transition-all lh-overflow-hidden" +
                              (selectedBookmarkId === item.id
                                ? " lh-border lh-border-slate-400"
                                : "")
                            }
                            ref={(el) => (bookmarkRefs.current[item.id] = el)}
                            onClick={() => window.open(item.url, "_blank")}>
                            <Icon
                              icon="mdi:bookmark-outline"
                              className="lh-h-5 lh-w-5"
                            />
                            <span
                              className="lh-font-medium lh-text-slate-700 lh-whitespace-nowrap lh-overflow-hidden lh-text-ellipsis"
                              style={{
                                maxWidth: "400px",
                                display: "inline-block"
                              }}>
                              {item.title}
                            </span>
                            {selectedBookmarkId === item.id && (
                              <div className="lh-absolute lh-top-[-1px] lh-right-[-1px]">
                                <SelectedCornerMark />
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : tab.children && tab.children.length > 0 ? (
                    <RenderAccordion groups={tab.children} />
                  ) : (
                    <div className="lh-text-center lh-text-slate-400">
                      暂无结果
                    </div>
                  )}
                </div>
              </TabsContent>
            ))
          ) : (
            <div className="lh-w-full lh-text-center lh-text-slate-400">
              暂无结果
            </div>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
