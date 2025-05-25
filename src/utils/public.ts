/**
 * @function 将类转换为单例类
 */
export const sington = (className) => {
  let ins = null
  const proxy = new Proxy(className, {
    construct(target, args) {
      if (!ins) {
        ins = Reflect.construct(target, args)
      }
      return ins
    }
  })
  return proxy
}

/**
 * @function 睡眠函数
 */
export const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({})
    }, time)
  })
}

/**
 * @function 复制文字
 */
/**
 * @function 一键复制
 * @param value 要复制的文本
 * @param callback 回调函数
 * @returns
 */
export const copyText = async (value: string) => {
  return new Promise<string>((resolve, reject) => {
    try {
      if (window.navigator.clipboard) {
        window.navigator.clipboard.writeText(value)
      } else {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        textarea.value = value
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      resolve(value)
    } catch (error) {
      reject(error)
    }
  })
}