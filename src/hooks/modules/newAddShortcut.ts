import { useEffect, useState } from "react"

import { toast } from "~components/base/Sonner"
import { LOCAL_KEY } from "~constants"
import { getLocal, setLocal } from "~utils"
import { getUUID } from "~utils/public"

/**
 * 新增快捷方式的自定义hook。
 * @param {TYPE.InitConfig} option - 初始化配置
 * @returns {object} 新增快捷方式相关状态和操作
 */
export const useNewAddShortcut = (option: TYPE.InitConfig) => {
  const { chrome } = option
  // 新增的快捷方式
  const [newShortcut, setNewShortcut] = useState<TYPE.Shortcuts>({
    id: getUUID(),
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
      key: LOCAL_KEY.shortcutsSearch,
      chrome: chrome
    }).then((data) => {
      setShortcutsSearchLocal(data || [])
    })

    getLocal({
      key: LOCAL_KEY.activeCategory,
      chrome
    }).then((data) => {
      setNewShortcut({
        ...newShortcut,
        category: data || "other"
      })
    })
  }, [chrome]) // 依赖项为 chrome 对象，确保在 chrome 可用时执行

  /**
   * @function 设置新增的快捷方式
   */
  const onSubmitNewShortcut = (shortcut, setOpen) => {
    const { alias, prefix } = shortcut
    shortcut.id = getUUID()
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
      key: LOCAL_KEY.shortcutsSearch,
      value: JSON.stringify([...shortcutsSearchLocal, shortcut]),
      chrome
    })
    toast("添加成功", {
      type: "success"
    })
    setTimeout(() => {
      setOpen(false)
    }, 800)
  }

  return {
    newShortcut,
    setNewShortcut,
    onSubmitNewShortcut
  }
}
