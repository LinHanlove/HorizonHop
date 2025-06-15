import JSZip from "jszip"

import { Message } from "~components/base/Message"
import { CONFIG, safePages, SEND_FROM } from "~constants"
import Compressor from "~utils/ability/Compressor"
import UPNG from "~utils/ability/UPNG"

import { notify, sendMessageRuntime } from "./chrome.tools"

/**
 * @function 打开githubDev 线上查看github项目
 */
export const openGitHubDev = () => {
  notify({
    message: "启动中请稍后...",
    chrome
  })
  sendMessageRuntime({
    type: "lightIcon",
    origin: SEND_FROM.content,
    chrome
  })
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url
    const reg = /^(https?:\/\/)?(www\.)?github\.com\/(.*)\/(.*)/

    if (!reg.test(url)) return

    // 在当前标签页后面打开新的标签页
    chrome.tabs.create({
      url: url.replace("github.com", "github.dev"),
      index: tabs[0].index + 1
    })
  })
}

/**
 * @function 定义将Blob转换为File的函数
 */
export const blobToFile = (blob, extraData) => {
  return new File([blob], extraData.fileName, {
    type: blob.type,
    lastModified: Date.now()
  })
}

/**
 * @function 压缩图片
 * @description 使用UPNG库
 * @param file 要压缩的文件
 * @returns Promise<File>
 */
export const UPNG_PNG = async (file: File, quality: number): Promise<File> => {
  const arrayBuffer = await file.arrayBuffer()
  const decoded = UPNG.decode(arrayBuffer)
  console.log(decoded, "decoded")
  const rgba8 = UPNG.toRGBA8(decoded)

  // 这里 保持宽高不变，保持80%的质量（接近于 tinypng 的压缩效果）
  const compressed = UPNG.encode(
    rgba8,
    decoded.width,
    decoded.height,
    256 * quality
  )
  return new File([compressed], file.name, { type: "image/png" })
}

/**
 * @function 压缩图片
 * @description 使用Compressor库
 * @param file 要压缩的文件
 * @returns Promise<File>
 */
export const Compressor_PNG = async (
  file: File,
  quality: number,
  window
): Promise<File> => {
  return new Promise((resolve, reject) => {
    console.log(file, quality)
    new Compressor(file, {
      quality,
      success(result) {
        resolve(result)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

/**
 * @function formatFileSize
 * @description 根据文件大小换算单位
 * @returns string
 */
export const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + "B"
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB"
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + "MB"
  }
}

/**
 * @function convertImageFormat
 * @description 将图片转换为需要的格式
 * @param file 要转换的文件
 * @param quality 压缩质量
 * @param callback 回调函数
 */
export const convertImageFormat = (option): Promise<File> => {
  const { file, quality = 1, format } = option
  return new Promise((resolve, reject) => {
    // 使用FileReader读取文件内容
    const reader = new FileReader()
    reader.onload = (e) => {
      // 将读取到的数据URL转换为Image对象
      const img = new Image()
      img.onload = async () => {
        // 创建canvas并设置宽高为图片的宽高
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = img.width
        canvas.height = img.height

        // 将图片绘制到canvas上
        ctx.drawImage(img, 0, 0)

        // 将canvas上的图片转换为指定格式的DataURL
        const formatImage = canvas.toDataURL(`image/${format}`, quality)
        // DataURL转换为File对象
        const blob = await dataURLtoBlob(formatImage)
        // Blob对象转换为File对象
        const fileObj = new File(
          [blob],
          file.name.split(".")[0] + `.${format}`,
          { type: blob.type }
        )
        resolve(fileObj)
      }
      img.src = e.target.result as string
    }
    reader.onerror = (e) => {
      console.error("Error reading file", e)
      reject(e)
    }
    reader.readAsDataURL(file) // 读取文件内容并转换为DataURL
  })
}

/**
 * @function dataURLtoBlob
 * @description 将数据URL转换为Blob对象
 * @param {string} dataurl 数据URL字符串
 * @returns {Promise<Blob>} Blob对象
 */
export const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * @function 消除网站安全页面跳转限制
 */
export const interceptLink = (chrome?: any) => {
  // @match        *://link.juejin.cn/*
  // @match        *://juejin.cn/*
  // @match        *://www.jianshu.com/p/*
  // @match        *://www.jianshu.com/go-wild?*
  // @match        *://*.zhihu.com/*
  // @match        *://tieba.baidu.com/*
  // @match        *://*.oschina.net/*
  // @match        *://gitee.com/*
  // @match        *://leetcode.cn/link/*
  // @match        *://blog.51cto.com/*
  // @match        *://*.baidu.com/*

  for (let safePage of safePages) {
    if (!location.href.includes(safePage.url)) continue
    sendMessageRuntime({
      type: "lightIcon",
      origin: SEND_FROM.content,
      chrome
    })
    // 清除网站弹窗
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
    for (let handler of safePage.handlers) {
      // 处理跳转
      document.body.append(
        Message({
          title: `${CONFIG.name}提醒您！正在跳转...`,
          subTitle: decodeURIComponent(location.href.split(handler.start)[1])
        })
      )
      location.replace(
        decodeURIComponent(location.href.split(handler.start)[1])
      )
      return
    }
  }
}

/**
 * @function 消除csdn一些垃圾限制
 * @description 经过分析发现，点击关注展开其实只是样式层面上的隐藏，
 * 所以找到对应类名修改样式就可以了
 * 按钮class【hide-article-box hide-article-pos text-center】
 * 内容id【article_content】
 */
export const killCsdn = (chrome?: any) => {
  const scdnWhiteLink = "https://blog.csdn.net/"
  console.log(location.href.includes(scdnWhiteLink))

  if (!location.href.includes(scdnWhiteLink)) return
  const hideArticleBox = document.querySelector(
    ".hide-article-box"
  ) as HTMLElement
  const articleContent = document.querySelector(
    "#article_content"
  ) as HTMLElement
  console.log(hideArticleBox, articleContent)

  if (hideArticleBox) {
    sendMessageRuntime({
      type: "lightIcon",
      origin: SEND_FROM.content,
      chrome
    })
    hideArticleBox.style.display = "none"
    articleContent.style.height = "auto"
  }
}

/**
 * @function downloadFilesAsZip
 * @description 将多个文件打包成ZIP并下载
 * @param files 要下载的文件数组
 * @param zipFileName ZIP文件的名称
 */
export const downloadFilesAsZip = async (files: any[], zipFileName: string) => {
  const zip = new JSZip()
  files.forEach((file) => {
    zip.file(file.name, file.file)
  })

  const content = await zip.generateAsync({ type: "blob" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(content)
  a.download = zipFileName
  a.click()
  URL.revokeObjectURL(a.href)
}
