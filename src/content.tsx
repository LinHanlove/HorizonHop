import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import DeleteShortcut from "~components/base/DeleteShortcut"
import NewAddShortcut from "~components/base/NewAddShortcut"
import Setting from "~components/base/Setting"
import { SonnerProvider } from "~components/base/Sonner"
import { MODEL_TYPE } from "~constants"
import { onListenerMessage } from "~utils"

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

export default function IndexContent() {
  // 弹窗名称
  const [dialogName, setDialogName] = useState<string | null>(null)

  // 弹窗是否打开
  const [isDialogOpen, setIsDialogOpen] = useState(true)

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
        MODEL_TYPE.deleteShortcut
      ].includes(message.type)

      if (message.origin === "popup") {
        // 打开弹窗
        if (!!message.type && isOpenModel) {
          setDialogName(message.type)
          setIsDialogOpen(true)
        }
        // 切换类目
        if (message.type === "categoryChange") {
          setDialogName(null)
          setIsDialogOpen(false)
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
    </SonnerProvider>
  )
}
