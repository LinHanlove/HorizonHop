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