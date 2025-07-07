import {
  menuList,
  MESSAGE_TYPE,
  MODEL_TYPE,
  SEND_FROM,
  SHORTCUT_TYPE
} from "~constants"
import {
  closePopup,
  lightIcon,
  onListenerMessage,
  openSidePanel,
  sendMessage
} from "~utils"

let isPopupOpen = true

/**
 * @function 监听快捷键命令
 */
chrome.commands.onCommand.addListener((command) => {
  // 打开popup
  if (command === SHORTCUT_TYPE.openPopup) {
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
  if (command === SHORTCUT_TYPE.openFunctionArea)
    sendMessage({
      type: MODEL_TYPE.functionArea,
      origin: SEND_FROM.background,
      chrome
    })

  // 打开书签搜索面板
  if (command === SHORTCUT_TYPE.openBookmarkSearch)
    sendMessage({
      type: MODEL_TYPE.bookmarkSearch,
      origin: SEND_FROM.background,
      chrome
    })

  // 打开/关闭侧边栏
  if (command === SHORTCUT_TYPE.openSidePanel) {
    openSidePanel({ chrome })
  }
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
    // 获取书签
    if (type === MESSAGE_TYPE.getBookmarks) {
      chrome.bookmarks.getTree(async (nodes) => {
        const updated = await updateBookmark(nodes[0])
        sendResponse({ bookmarks: updated })
      })
      return true
    }
  }
  // 从popup发送的消息
  if (origin === SEND_FROM.popup) {
    // 打开侧边栏
    if (message.type === MODEL_TYPE.sidePanel)
      openSidePanel({
        chrome
      })
  }
}
onListenerMessage(onMessage)

/**
 * @function 创建右键菜单
 */
chrome.contextMenus.removeAll(() => {
  menuList
    .filter((i) => i.hasContextMenus)
    .forEach((item) => {
      chrome.contextMenus.create({
        id: item.id,
        title: item.title,
        contexts: ["all"]
      })
    })
})

/**
 * @function 右键菜单点击事件
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const active = menuList.find((item) => item.id === info.menuItemId)
  if (active)
    active.event({
      isBack: true
    })
})

/**
 * @function 递归处理单个节点
 * @param node
 */
const updateBookmark = async (node: chrome.bookmarks.BookmarkTreeNode) => {
  try {
    if (node.url) {
      // 这是书签，获取父文件夹名称并更新
      const parentId = node.parentId
      if (parentId) {
        const parentArr = await chrome.bookmarks.get(parentId)
        if (parentArr && parentArr.length) {
          const parentTitle = parentArr[0].title
          const newTitle = `${node.title} ✫ ${parentTitle}`
          node.title = newTitle
        }
      }
    } else if (node.children && node.children.length) {
      // 这是文件夹，递归处理每个子节点
      for (const child of node.children) {
        await updateBookmark(child)
      }
    }
    return node
  } catch (e) {
    return []
  }
}
