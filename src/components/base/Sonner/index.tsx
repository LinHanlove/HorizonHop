// 导入 Lucide 图标
import { CheckCircle, Info, XCircle } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "~utils/shadcn"

// 定义通知的数据结构
interface Toast {
  id: string
  message: string // 现在主要用作描述
  title?: string // 新增：通知标题
  type?: "default" | "success" | "error" | "info"
  duration?: number // 通知显示时长，默认为 3000ms
  // 用于动画状态的管理
  state?: "entering" | "idle" | "leaving"
}

// 全局变量，用于存储 addToast 函数的引用
let globalAddToast: ((toast: Toast) => void) | null = null

// 存储在 SonnerProvider 未就绪时发出的通知请求的队列
const toastQueue: Toast[] = []

// 全局 toast 函数，用于在应用任何地方触发通知
// message: 通知内容 (现在主要用作描述)
// options: 可选参数，如 type, duration, title
// 注意：此函数只有在 SonnerProvider 被渲染后才能正常工作。
export const toast = (
  message: string,
  options?: Omit<Toast, "id" | "message" | "state">
) => {
  const id = Math.random().toString(36).substring(2, 15)
  const newToast: Toast = { id, message, ...options, state: "entering" }

  if (globalAddToast) {
    // 如果 provider 已就绪，直接添加 toast
    globalAddToast(newToast)
  } else {
    // 如果 provider 未就绪，将 toast 添加到队列
    console.warn("SonnerProvider not yet ready, queuing toast:", newToast)
    toastQueue.push(newToast)
  }

  return id
}

interface SonnerProviderProps {
  children?: React.ReactNode // 使 children 变为可选
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" // 新增：通知显示位置
}

export function SonnerProvider({
  children,
  position = "top-right"
}: SonnerProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  // addToast 函数只负责添加到状态
  const addToast = useCallback((toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast])
  }, [])

  // 在 SonnerProvider 挂载时注册 addToast，卸载时注销
  useEffect(() => {
    globalAddToast = addToast

    // Provider 挂载时，处理队列中等待的 toasts
    if (toastQueue.length > 0) {
      console.log("SonnerProvider ready, processing queued toasts:", [
        ...toastQueue
      ])
      setToasts((prevToasts) => [...prevToasts, ...toastQueue])
      toastQueue.length = 0 // 清空队列
    }

    return () => {
      globalAddToast = null
      // 可选：在 Provider 卸载时处理当前显示的 toasts (例如，将它们移回队列或标记为即将移除)
      // 这里我们选择清空队列，因为 Content Script 通常在页面导航时销毁
      toastQueue.length = 0 // 在卸载时清空队列，防止内存泄漏
    }
  }, [addToast, setToasts]) // 添加 setToasts 作为依赖项

  // 用于存储 timer IDs
  const timerRefs = useRef<{ [id: string]: NodeJS.Timeout }>({})

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    // 清理对应的 timer
    if (timerRefs.current[id]) {
      clearTimeout(timerRefs.current[id])
      delete timerRefs.current[id]
    }
  }, [])

  // 自动清除通知 (当 toast 状态变为 entering 或 idle 时设置定时器)
  useEffect(() => {
    toasts.forEach((toast) => {
      // 当 toast 状态为 entering 或 idle 且没有定时器时设置定时器
      if (
        (toast.state === "entering" || toast.state === "idle") &&
        !timerRefs.current[toast.id]
      ) {
        const timer = setTimeout(() => {
          console.log(
            `Timer for ${toast.id} triggered. Removing toast directly.`
          )
          removeToast(toast.id) // 直接移除 toast
        }, toast.duration || 3000)

        // 存储定时器引用
        timerRefs.current[toast.id] = timer
        console.log(`Timer for ${toast.id} set.`)
      }
    })

    // 清理函数：在 toasts 数组变化时（如移除），清除不再需要的定时器引用
    const toastIds = toasts.map((t) => t.id)
    for (const id in timerRefs.current) {
      if (!toastIds.includes(id)) {
        clearTimeout(timerRefs.current[id])
        delete timerRefs.current[id]
      }
    }
  }, [toasts, removeToast]) // 添加 removeToast 作为依赖项

  // 在 SonnerProvider 卸载时清理所有定时器
  useEffect(() => {
    return () => {
      for (const id in timerRefs.current) {
        clearTimeout(timerRefs.current[id])
      }
      // 确保卸载时清空队列
      toastQueue.length = 0
    }
  }, [])

  return (
    <>
      {children}
      {/* 通知容器 */}
      <div
        className={cn(
          "lh-fixed lh-z-[999999] lh-flex lh-flex-col lh-gap-3", // 增加 gap
          position === "top-left" && "lh-top-4 lh-left-4",
          position === "top-right" && "lh-top-4 lh-right-4",
          position === "bottom-left" && "lh-bottom-4 lh-left-4",
          position === "bottom-right" && "lh-bottom-4 lh-right-4"
        )}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              // 基础样式：相对定位，flex布局，圆角，阴影，边框，背景色，文本颜色
              "lh-relative lh-flex lh-items-center lh-justify-between lh-space-x-4 group",
              "lh-p-4 lh-rounded-lg lh-shadow-lg lh-bg-card lh-text-card-foreground"
            )}>
            {/* 图标区域 */}
            <div className="lh-flex-shrink-0 lh-mt-1">
              {toast.type === "success" && (
                // 替换为 Lucide 的 CheckCircle 图标
                <CheckCircle className="lh-text-green-500 lh-h-5 lh-w-5" /> // 使用 h-5 w-5 设置大小
              )}
              {toast.type === "error" && (
                // 替换为 Lucide 的 XCircle 图标
                <XCircle className="lh-text-red-500 lh-h-5 lh-w-5" /> // 使用 h-5 w-5 设置大小
              )}
              {toast.type === "info" && (
                // 替换为 Lucide 的 Info 图标
                <Info className="lh-text-blue-500 lh-h-5 lh-w-5" /> // 使用 h-5 w-5 设置大小
              )}
            </div>
            <div className="lh-flex-1 lh-text-sm">
              {toast.title && (
                // 标题使用更突出的样式
                <p className="lh-font-medium lh-text-card-foreground">
                  {toast.title}
                </p>
              )}
              {/* message 现在用作描述，使用次要文本颜色 */}
              <p className="lh-text-muted-foreground">{toast.message}</p>
            </div>
            {/* 关闭按钮 */}
            <button
              onClick={() => removeToast(toast.id)}
              className="lh-text-muted-foreground hover:lh-text-foreground lh-p-1 lh-rounded-sm lh-opacity-0 group-hover:lh-opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lh-h-4 lh-w-4">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

// 为了向后兼容或提供一个更像组件的入口，可以保留 Sonner 函数
interface SonnerProps {
  children?: React.ReactNode
}

export function Sonner(props: SonnerProps) {
  // 这里的 Sonner 只是一个包装，确保 SonnerProvider 被渲染
  // 推荐直接使用 SonnerProvider
  console.warn("推荐使用 SonnerProvider 替代 Sonner 组件")
  return <SonnerProvider {...props} />
}

export default Sonner
