import { sleep } from "./public"
export const icon = require("assets/icon.png")


/**
 * @function 通知信息
 * type 类型
 * origin 来源
 * data 数据
 */
export const sendMessage = (option: TYPE.SendMessage) => {
  const { type, origin, data, chrome } = option
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type,
          origin,
          data
        },
        (res) => {
          resolve(res)
        }
      )
    })
  })
}

/**
 * @function 通知信息
 */
export const sendMessageRuntime = (option: TYPE.SendMessage) => {
  const { type, origin, data, chrome } = option
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type,
        origin,
        data
      },
      (res: any) => {
        resolve(res)
      }
    )
  })
}

/**
 * @function 系统通知信息
 * @param option {message,type,iconUrl}
 * @returns
 */
export const notify = (option: TYPE.ChromeMessage) => {
  const { message, type, iconUrl, chrome, timeout } = option
  console.log(option)

  return new Promise((resolve, reject) => {
    try {
      chrome.notifications.create(
        {
          type: type || "basic",
          title: "Atom Honeycomb",
          message: message || "Atom Honeycomb",
          iconUrl: iconUrl || icon
        },
        (notificationId) => {
          sleep(timeout || 3000).then(() => {
            chrome.notifications.clear(notificationId)
            resolve(notificationId)
          })
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @function 创建一个新的标签页
 */
export const createTab = (option: any) => {
  const { chrome, url } = option
  chrome.tabs.create({ url: `../tabs/${url}.html` })
}
