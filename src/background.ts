import { menuList, MODEL_TYPE } from "~constants"
import { createTab, onListenerMessage, openGitHubDev } from "~utils"

/**
 * @function 监听快捷键命令
 */
chrome.commands.onCommand.addListener((command) => {
  // md表格格式转换
  if (command === "tableMarkdown")
    createTab({
      chrome,
      url: "TableMarkdown"
    })
  // jsonFormatter
  if (command === "jsonFormatter")
    createTab({
      chrome,
      url: "JsonFormatter"
    })
  // 打开githubDev
  if (command === "openGitHubDev") openGitHubDev()
  // 图片压缩
  if (command === "compressHero")
    createTab({
      chrome,
      url: "CompressHero"
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
  // if (active) active.onclick()
})
