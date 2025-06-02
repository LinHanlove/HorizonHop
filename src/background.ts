import { menuList, MODEL_TYPE, SEND_FROM } from "~constants"
import { onListenerMessage, sendMessage } from "~utils"

let isPopupOpen = false

/**
 * @function 监听快捷键命令
 */
chrome.commands.onCommand.addListener((command) => {
  // 打开popup
  if (command === "openPopup") {
    // 获取当前popup状态
    chrome.action.getPopup({}, (popupPath) => {
      if (!isPopupOpen) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            // 聚焦当前窗口
            chrome.windows.update(tabs[0].windowId, { focused: true })
          }
        })
        isPopupOpen = true
      } else {
        chrome.action.openPopup()
        isPopupOpen = false
      }
    })
  }
  // 打开功能面板
  if (command === "openFunctionArea")
    sendMessage({
      type: MODEL_TYPE.functionArea,
      origin: SEND_FROM.background,
      chrome
    })
})

/**
 * @function 监听消息
 */
const onMessage = (
  message: TYPE.ListenerMessageOption,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  console.log("background.tsx onMessage", message)
  // 从contentScript发送的消息
  if (message.origin === "content") {
    // 功能区事件
    if (message.type === MODEL_TYPE.functionArea) {
      menuList.find((item) => item.title === message.data.target)?.event()
    }
  }
}
onListenerMessage(onMessage)

/**
 * @function 创建右键菜单
 */
menuList.forEach((item) => {
  chrome.contextMenus.create({
    id: item.id,
    title: item.title,
    contexts: ["all"]
  })
})

/**
 * @function 右键菜单点击事件
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const active = menuList.find((item) => item.id === info.menuItemId)
  if (active) active.event()
})
