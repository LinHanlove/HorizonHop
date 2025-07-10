import React, { useRef, useState } from "react"

import { toast } from "~components/base/Sonner"
import { copyText } from "~utils"

export type ConfigItem =
  | {
      type: "input"
      label: React.ReactNode
      value: string | number
      onChange: (v: string) => void
      inputProps?: React.InputHTMLAttributes<HTMLInputElement>
      group: "block"
    }
  | {
      type: "select"
      label: React.ReactNode
      value: string | number
      onChange: (v: string) => void
      options: string[]
      group: "block"
    }
  | {
      type: "switch"
      label: React.ReactNode
      value: boolean
      onChange: (checked: boolean) => void
      group: "inline"
    }

export type OutputAction = { label: string; onClick: () => void }

export type UseJsonViewConfigReturn = {
  theme: string
  iconStyle: "triangle" | "circle" | "square"
  indentWidth: number
  collapsed: false | number
  collapseStringsAfterLength: number
  displayDataTypes: boolean
  displayObjectSize: boolean
  enableEdit: boolean
  enableClipboard: boolean
  sortKeys: boolean
  quotesOnKeys: boolean
  configList: ConfigItem[]
  outputActions: OutputAction[]
  objectToJsLiteral: (obj: any, indent?: number, level?: number) => string // 新增类型声明
}

/**
 * @typedef {Object} UseJsonViewConfigParams
 * @property {string} data - 输入的 JSON 字符串
 * @property {(v: string) => void} setData - 设置 JSON 字符串的方法
 * @property {React.RefObject<HTMLInputElement>} fileInputRef - 文件 input 的 ref
 */

/**
 * @function objectToJsLiteral
 * @description 将 JS 对象转为 JS 字面量字符串（key 不加引号）。
 * @param {any} obj - 需要转换的对象
 * @param {number} indent - 缩进宽度
 * @param {number} level - 当前递归层级
 * @returns {string}
 */
const objectToJsLiteral = (obj: any, indent = 2, level = 0): string => {
  const pad = (n: number) => " ".repeat(n)
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]"
    return (
      "[\n" +
      obj
        .map(
          (item) =>
            pad((level + 1) * indent) +
            objectToJsLiteral(item, indent, level + 1)
        )
        .join(",\n") +
      "\n" +
      pad(level * indent) +
      "]"
    )
  } else if (typeof obj === "object" && obj !== null) {
    const keys = Object.keys(obj)
    if (keys.length === 0) return "{}"
    return (
      "{\n" +
      keys
        .map(
          (k) =>
            pad((level + 1) * indent) +
            k +
            ": " +
            objectToJsLiteral(obj[k], indent, level + 1)
        )
        .join(",\n") +
      "\n" +
      pad(level * indent) +
      "}"
    )
  } else {
    return JSON.stringify(obj)
  }
}

/**
 * 统一管理 json-view 配置和操作。
 * @param {Object} params - 配置参数
 * @param {string} params.data - 输入的 JSON 字符串
 * @param {(v: string) => void} params.setData - 设置 JSON 字符串的方法
 * @param {React.RefObject<HTMLInputElement>} params.fileInputRef - 文件 input 的 ref
 * @returns {UseJsonViewConfigReturn}
 */
export const useJsonViewConfig = ({
  data,
  setData,
  fileInputRef
}: {
  data: string
  setData: (v: string) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}): UseJsonViewConfigReturn => {
  // 主题、icon风格、缩进、折叠等配置
  const themeOptions = [
    "rjv-default",
    "monokai",
    "solarized",
    "summerfruit",
    "eighties",
    "apathy",
    "paraiso",
    "twilight",
    "grayscale",
    "harmonic",
    "hopscotch",
    "marrakesh",
    "ocean",
    "tomorrow"
  ]
  const iconStyleOptions = ["triangle", "circle", "square"]
  const [theme, setTheme] = useState("rjv-default" as any)
  const [iconStyle, setIconStyle] = useState<"triangle" | "circle" | "square">(
    "triangle"
  )
  const [indentWidth, setIndentWidth] = useState(2)
  const [collapsed, setCollapsed] = useState<false | number>(false)
  const [collapseStringsAfterLength, setCollapseStringsAfterLength] =
    useState(0)
  const [displayDataTypes, setDisplayDataTypes] = useState(true)
  const [displayObjectSize, setDisplayObjectSize] = useState(false)
  const [enableEdit, setEnableEdit] = useState(false)
  const [enableClipboard, setEnableClipboard] = useState(true)
  const [sortKeys, setSortKeys] = useState(false)
  const [quotesOnKeys, setQuotesOnKeys] = useState(false)

  // 配置栏表单项
  const configList: ConfigItem[] = [
    {
      type: "input",
      label: "折叠层级",
      value: typeof collapsed === "number" ? collapsed : "",
      onChange: (v: string) => {
        if (v === "" || v === undefined || v === null) {
          setCollapsed(false)
        } else {
          setCollapsed(Number(v))
        }
      },
      inputProps: { type: "number", min: 0, max: 6, placeholder: "全部展开" },
      group: "block"
    },
    {
      type: "select",
      label: "主题",
      value: theme,
      onChange: (v: string) => setTheme(v),
      options: themeOptions,
      group: "block"
    },
    {
      type: "select",
      label: "Icon风格",
      value: iconStyle,
      onChange: (v: string) =>
        setIconStyle(v as "triangle" | "circle" | "square"),
      options: iconStyleOptions,
      group: "block"
    },
    {
      type: "input",
      label: "缩进宽度",
      value: indentWidth,
      onChange: (v: string) => setIndentWidth(Number(v)),
      inputProps: { type: "number", min: 2, max: 8 },
      group: "block"
    },
    {
      type: "input",
      label: "折叠字符串长度",
      value: collapseStringsAfterLength,
      onChange: (v: string) => setCollapseStringsAfterLength(Number(v)),
      inputProps: { type: "number", min: 0, max: 100 },
      group: "block"
    },
    {
      type: "switch",
      label: "显示类型",
      value: displayDataTypes,
      onChange: (checked: boolean) => setDisplayDataTypes(checked),
      group: "inline"
    },
    {
      type: "switch",
      label: "显示对象长度",
      value: displayObjectSize,
      onChange: (checked: boolean) => setDisplayObjectSize(checked),
      group: "inline"
    },
    {
      type: "switch",
      label: "可编辑",
      value: enableEdit,
      onChange: (checked: boolean) => setEnableEdit(checked),
      group: "inline"
    },
    {
      type: "switch",
      label: "可复制",
      value: enableClipboard,
      onChange: (checked: boolean) => setEnableClipboard(checked),
      group: "inline"
    },
    {
      type: "switch",
      label: "排序key",
      value: sortKeys,
      onChange: (checked: boolean) => setSortKeys(checked),
      group: "inline"
    },
    {
      type: "switch",
      label: (
        <span>
          key加引号
          <span className="lh-text-[10px] lh-text-gray-400 lh-ml-1">
            （部分主题有效）
          </span>
        </span>
      ),
      value: quotesOnKeys,
      onChange: (checked: boolean) => setQuotesOnKeys(checked),
      group: "inline"
    }
  ]

  /**
   * @function handleFormat
   * @description 一键格式化 JSON
   */
  const handleFormat = () => {
    try {
      setData(JSON.stringify(JSON.parse(data), null, 2))
    } catch {}
  }
  /**
   * @function handleCompress
   * @description 一键压缩 JSON
   */
  const handleCompress = () => {
    try {
      setData(JSON.stringify(JSON.parse(data)))
    } catch {}
  }
  /**
   * @function handleCopyAll
   * @description 复制全部内容，按 quotesOnKeys 决定 key 是否加引号
   * @param {boolean} minify - 是否压缩
   */
  const handleCopyAll = (minify = false) => {
    try {
      const obj = JSON.parse(data)
      let text = ""
      if (quotesOnKeys) {
        text = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2)
      } else {
        text = objectToJsLiteral(obj, indentWidth)
        if (minify) text = text.replace(/\s+/g, "")
      }
      copyText(text).then(() => {
        toast("复制成功", { type: "success" })
      })
    } catch {
      toast("复制失败，JSON格式有误", { type: "error" })
    }
  }
  /**
   * @function handleExport
   * @description 导出 JSON 文件（始终标准 JSON）
   */
  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(JSON.parse(data), null, 2)], {
        type: "application/json"
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "data.json"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast("导出失败，JSON格式有误", { type: "error" })
    }
  }
  const outputActions: OutputAction[] = [
    { label: "复制全部", onClick: () => handleCopyAll(false) },
    { label: "复制压缩", onClick: () => handleCopyAll(true) },
    { label: "一键格式化", onClick: handleFormat },
    { label: "一键压缩", onClick: handleCompress },
    { label: "导出JSON", onClick: handleExport },
    { label: "导入JSON", onClick: () => fileInputRef.current?.click() }
  ]

  return {
    theme,
    iconStyle,
    indentWidth,
    collapsed,
    collapseStringsAfterLength,
    displayDataTypes,
    displayObjectSize,
    enableEdit,
    enableClipboard,
    sortKeys,
    quotesOnKeys,
    configList,
    outputActions,
    objectToJsLiteral
  }
}
