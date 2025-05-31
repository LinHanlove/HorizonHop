import { useEffect, useState } from "react"

import { toast } from "~components/base/Sonner"
import { getLocal, setLocal } from "~utils"

export const useNewAddShortcut = (option: TYPE.InitConfig) => {
  const { chrome } = option
  // 新增的快捷方式
  const [newShortcut, setNewShortcut] = useState<TYPE.Shortcuts>({
    alias: "",
    icon: "🔗",
    prefix: "",
    suffix: "",
    category: "other"
  })

  /**
   * @data 本地储存的快捷方式
   */
  const [shortcutsSearchLocal, setShortcutsSearchLocal] = useState<
    TYPE.Shortcuts[]
  >([])

  useEffect(() => {
    // 在组件挂载后异步获取数据
    getLocal({
      key: "shortcutsSearch",
      chrome: chrome
    }).then((data) => {
      setShortcutsSearchLocal(data || [])
    })
  }, [chrome]) // 依赖项为 chrome 对象，确保在 chrome 可用时执行

  /**
   * @function 设置新增的快捷方式
   */
  const onSubmitNewShortcut = (shortcut) => {
    const { alias, prefix } = shortcut
    if (!alias) {
      return toast("请输入快捷方式名称", {
        title: "添加错误",
        type: "error"
      })
    } else if (!prefix) {
      return toast("请输入快捷方式前缀", {
        title: "添加错误",
        type: "error"
      })
    }
    //检查重复性
    const isExist = shortcutsSearchLocal.find(
      (item: TYPE.Shortcuts) => item.alias === alias
    )
    if (isExist) {
      return toast("快捷方式名称已存在", {
        title: "添加错误",
        type: "error"
      })
    }
    // 储存到本地
    setLocal({
      key: "shortcutsSearch",
      value: JSON.stringify([...shortcutsSearchLocal, shortcut]),
      chrome
    })
  }

  return {
    newShortcut,
    setNewShortcut,
    onSubmitNewShortcut
  }
}
