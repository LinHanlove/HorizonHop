import type { PlasmoCSConfig } from "plasmo"
import { onListenerMessage } from "~utils"
import { useState, useEffect } from "react"
import { POPUP_TYPE } from "~constants"
import './style'
import NewAddShortcut from "~components/base/newAddShortcut"


export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export default function IndexContent () {
  const [dialogName, setDialogName] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (message: TYPE.ListenerMessageOption, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      // 根据不同的 type 设置不同的 dialogName
      if (message.type === POPUP_TYPE.addNewShortcut) { // 仅处理需要打开弹窗的消息类型
        setDialogName(message.type);
        setIsDialogOpen(true); // 设置弹窗为打开状态
      } else {
        setDialogName(null);
        setIsDialogOpen(false); // 关闭其他不需要的弹窗
      }

      // 如果需要发送响应，可以在这里调用 sendResponse
      // sendResponse({});
      console.log('content监听消息---->', message.origin, message.type, message.data,isDialogOpen, dialogName);

    };

    onListenerMessage(handleMessage);

    // 清理函数，在组件卸载时移除监听器
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }); // 空依赖数组表示只在组件挂载和卸载时运行

  return (
    <>
      {dialogName === POPUP_TYPE.addNewShortcut && (<NewAddShortcut open={isDialogOpen} setOpen={(flag)=>setIsDialogOpen(flag)}/>)}
    </>
  )
}

