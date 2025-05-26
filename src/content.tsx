import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { POPUP_TYPE } from "~constants"
import { onListenerMessage } from "~utils"

import "./style"

import NewAddShortcut from "~components/base/NewAddShortcut"
import Setting from "~components/base/Setting"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export default function IndexContent() {
  const [dialogName, setDialogName] = useState<string | null>(
    POPUP_TYPE.addNewShortcut
  )
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  useEffect(() => {
    const handleMessage = (
      message: TYPE.ListenerMessageOption,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (!!message.type) {
        setDialogName(message.type)
        setIsDialogOpen(true)
      }
    }

    onListenerMessage(handleMessage)

    // 清理函数，在组件卸载时移除监听器
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
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
    <>
      {/* S 新增快捷方式 */}
      {dialogName === POPUP_TYPE.addNewShortcut && (
        <NewAddShortcut
          open={isDialogOpen}
          setOpen={(flag) => closeDialog(flag)}
        />
      )}
      {/* S 新增快捷方式 */}

      {/* S 设置 */}
      {dialogName === POPUP_TYPE.setting && (
        <Setting open={isDialogOpen} setOpen={(flag) => closeDialog(flag)} />
      )}
      {/* E 设置 */}
    </>
  )
}
