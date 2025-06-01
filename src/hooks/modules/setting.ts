import { useState } from "react"

import { toast } from "~components/base/Sonner"
import { defaultShortcuts } from "~constants"
import { copyText, getLocal, setLocal } from "~utils"

export const useSetting = () => {
  // 是否启用明亮模式
  const [isLightModeEnabled, setIsLightModeEnabled] = useState(false)
  // 是否启用毛玻璃效果
  const [isGlassEffectEnabled, setIsGlassEffectEnabled] = useState(true)
  // 是否启用界面动画
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true)
  // 功能面板：是否显示描述
  const [isShowDescriptionEnabled, setIsShowDescriptionEnabled] = useState(true)
  // 行为：是否在新标签页中打开链接
  const [isOpenInNewTabEnabled, setIsOpenInNewTabEnabled] = useState(true)

  // 删除弹窗相关状态
  const [isDeleteShortcutDialogOpen, setIsDeleteShortcutDialogOpen] =
    useState(false)
  const [shortcuts, setShortcuts] = useState<TYPE.Shortcuts[]>([]) // 存储要删除的快捷方式列表

  /**
   * @constants 开关类设置的配map
   */
  const switchConfigMap = [
    {
      title: "外观",
      items: [
        {
          title: "明亮模式",
          description: "当前主题模式",
          checked: isLightModeEnabled,
          onChange: setIsLightModeEnabled
        },
        {
          title: "毛玻璃效果",
          description: "启用背景模糊效果",
          checked: isGlassEffectEnabled,
          onChange: setIsGlassEffectEnabled
        },
        {
          title: "动画效果",
          description: "启用动画效果",
          checked: isAnimationEnabled,
          onChange: setIsAnimationEnabled
        }
      ]
    },
    {
      title: "功能",
      items: [
        {
          title: "显示描述",
          description: "在卡片上显示描述",
          checked: isShowDescriptionEnabled,
          onChange: setIsShowDescriptionEnabled
        }
      ]
    },
    {
      title: "行为",
      items: [
        {
          title: "在新标签页中打开",
          description: "在浏览器的新标签页中打开链接",
          checked: isOpenInNewTabEnabled,
          onChange: setIsOpenInNewTabEnabled
        }
      ]
    }
  ]

  /**
   * @description 导出数据
   */
  const exportData = () => {
    getLocal({
      key: "shortcutsSearch",
      chrome: chrome
    }).then((data) => {
      console.log("要导出的数据", data)
      copyText(JSON.stringify(data))
      toast("已复制到剪贴板", {
        type: "success"
      })
    })
  }

  /**
   * @description 加载快捷方式列表到删除弹窗
   */
  const loadShortcutsToDelete = () => {
    getLocal({
      key: "shortcutsSearch",
      chrome: chrome
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setShortcuts(data)
        } else {
          setShortcuts([])
        }
      })
      .catch((error) => {
        console.error("加载快捷方式失败:", error)
        toast("加载快捷方式失败，请稍后再试", { type: "error" })
        setShortcuts([])
      })
  }

  /**
   * @description 删除指定快捷方式
   * @param id 要删除的快捷方式的唯一标识
   */
  const deleteShortcut = (id: string) => {
    // 过滤掉要删除的快捷方式
    const updatedShortcuts = shortcuts.filter((shortcut) => shortcut.id !== id)

    // 更新本地存储
    setLocal({
      key: "shortcutsSearch",
      value: JSON.stringify(updatedShortcuts),
      chrome: chrome
    })
      .then(() => {
        // 更新组件状态
        setShortcuts(updatedShortcuts)
        toast("快捷方式删除成功", { type: "success" })
      })
      .catch((error) => {
        console.error("删除快捷方式失败:", error)
        toast("删除快捷方式失败，请稍后再试", { type: "error" })
      })
  }

  /**
   * @function 一件导入预设
   */
  const importData = () => {
    setLocal({
      key: "shortcutsSearch",
      value: JSON.stringify([...defaultShortcuts, ...shortcuts]),
      chrome
    })
    toast("导入成功", {
      type: "success"
    })
  }

  // 返回状态和更新函数
  return {
    isLightModeEnabled,
    setIsLightModeEnabled,
    isGlassEffectEnabled,
    setIsGlassEffectEnabled,
    isAnimationEnabled,
    setIsAnimationEnabled,
    isShowDescriptionEnabled,
    setIsShowDescriptionEnabled,
    isOpenInNewTabEnabled,
    setIsOpenInNewTabEnabled,
    switchConfigMap,
    exportData,
    // 导出删除弹窗相关状态和函数
    isDeleteShortcutDialogOpen,
    setIsDeleteShortcutDialogOpen,
    shortcuts,
    loadShortcutsToDelete,
    deleteShortcut,
    importData
  }
}
