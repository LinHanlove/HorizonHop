import { menuList, MODEL_TYPE, SEND_FROM } from "~constants"
import { closePopup, lightIcon, onListenerMessage, sendMessage } from "~utils"

let isPopupOpen = true

/**
 * @function 监听快捷键命令
 */
chrome.commands.onCommand.addListener((command) => {
  // 打开popup
  if (command === "openPopup") {
    // 获取当前popup状态
    chrome.action.getPopup({}, (popupPath) => {
      if (!isPopupOpen) {
        closePopup({
          chrome
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
  const { origin, type, data } = message
  // 从contentScript发送的消息
  if (origin === SEND_FROM.content) {
    // 功能区事件
    if (type === MODEL_TYPE.functionArea) {
      menuList.find((item) => item.title === data.target)?.event()
    }
    // 点亮徽标
    if (type === "lightIcon") {
      lightIcon({
        chrome
      })
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
