import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import BookmarkSearch from "~components/base/BookmarkSearch"
import DeleteShortcut from "~components/base/DeleteShortcut"
import FunctionArea from "~components/base/FunctionArea"
import NewAddShortcut from "~components/base/NewAddShortcut"
import SalaryCalculation from "~components/base/SalaryCalculation"
import Setting from "~components/base/Setting"
import { SonnerProvider } from "~components/base/Sonner"
import { MODEL_TYPE, SEND_FROM } from "~constants"
import { interceptLink, killCsdn, onListenerMessage } from "~utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize
    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement
}

/**
 * @function 取消外链的默认行为
 */
interceptLink(chrome)

/**
 * @function scdn默认打开内容，不需要点击关注
 */
killCsdn(chrome)

export default function IndexContent() {
  // 弹窗名称
  const [dialogName, setDialogName] = useState<string | null>(null)

  // 弹窗是否打开
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const onMessage = (
      message: TYPE.ListenerMessageOption,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      console.log("content.tsx onMessage", message)

      // 弹窗事件
      const isOpenModel = [
        MODEL_TYPE.addNewShortcut,
        MODEL_TYPE.setting,
        MODEL_TYPE.deleteShortcut,
        MODEL_TYPE.functionArea,
        MODEL_TYPE.bookmarkSearch,
        MODEL_TYPE.salaryCalculation
      ].includes(message.type)

      // 来自popup
      if (message.origin === SEND_FROM.popup) {
        // 打开弹窗
        if (!!message.type && isOpenModel) {
          setDialogName(message.type)
          setIsDialogOpen(true)
        }
        // 切换类目
        if (message.type === "categoryChange") {
          closeDialog(false)
        }
      }

      // 来自background
      if (message.origin === SEND_FROM.background) {
        // 打开弹窗
        if (!!message.type && isOpenModel) {
          setDialogName(message.type)
          setIsDialogOpen(!isDialogOpen)
        }
        // 聚焦当前页面body
        if (message.type === "focusBody") {
          // 使用页面级别的操作
          document.body.click()
          window.focus()
          document.body.focus()
        }
      }

      // 来自侧边栏
      if (message.origin === SEND_FROM.sidebar) {
        // 打开弹窗
        if (!!message.type && isOpenModel) {
          setDialogName(message.type)
          setIsDialogOpen(true)
        }
      }
    }

    onListenerMessage(onMessage)

    // 清理函数，在组件卸载时移除监听器
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage)
    }
  })

  /**
   * @function 卸载弹窗
   */
  const closeDialog = (flag) => {
    setDialogName(null)
    setIsDialogOpen(flag)
  }

  return (
    <SonnerProvider>
      {/* S 新增快捷方式 */}
      {dialogName === MODEL_TYPE.addNewShortcut && (
        <NewAddShortcut
          open={isDialogOpen}
          setOpen={(flag) => closeDialog(flag)}
        />
      )}
      {/* S 新增快捷方式 */}

      {/* S 设置 */}
      {dialogName === MODEL_TYPE.setting && (
        <Setting open={isDialogOpen} setOpen={(flag) => closeDialog(flag)} />
      )}
      {/* E 设置 */}

      {/* S 删除 */}
      {dialogName === MODEL_TYPE.deleteShortcut && (
        <DeleteShortcut
          open={isDialogOpen}
          setOpen={(flag) => closeDialog(flag)}
        />
      )}
      {/* S 删除 */}

      {/* S 功能选区 */}
      {dialogName === MODEL_TYPE.functionArea && (
        <FunctionArea
          open={isDialogOpen}
          setOpen={(flag) => closeDialog(flag)}
        />
      )}
      {/* E 功能选区 */}

      {/* S 书签搜索 */}
      {dialogName === MODEL_TYPE.bookmarkSearch && (
        <BookmarkSearch open={isDialogOpen} setOpen={closeDialog} />
      )}
      {/* E 书签搜索 */}

      {/* S 工资计算器 */}
      {dialogName === MODEL_TYPE.salaryCalculation && (
        <SalaryCalculation
          open={isDialogOpen}
          setOpen={(flag) => closeDialog(flag)}
        />
      )}
      {/* E 工资计算器 */}
    </SonnerProvider>
  )
}
