import { useState } from "react"

import "../../style"

export const useNewAddShortcut = () => {
  // 新增的快捷方式
  const [newShortcut, setNewShortcut] = useState<TYPE.Shortcuts>({
    alias: "",
    icon: "🔗",
    prefix: "",
    suffix: "",
    category: "other"
  })

  /**
   * @function 设置新增的快捷方式
   */
  const onSubmitNewShortcut = (shortcut) => {
    const { alias, icon, prefix, suffix, category } = shortcut
    console.log("submitNewShortcut--->", shortcut)
    if (!alias) {
    }
  }

  return {
    newShortcut,
    setNewShortcut,
    onSubmitNewShortcut
  }
}
