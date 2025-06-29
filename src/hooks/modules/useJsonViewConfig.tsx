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
}

export function useJsonViewConfig({
  data,
  setData,
  fileInputRef
}: {
  data: string
  setData: (v: string) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}): UseJsonViewConfigReturn {
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

  // Output区操作栏
  const handleFormat = () => {
    try {
      setData(JSON.stringify(JSON.parse(data), null, 2))
    } catch {}
  }
  const handleCompress = () => {
    try {
      setData(JSON.stringify(JSON.parse(data)))
    } catch {}
  }
  const handleCopyAll = (minify = false) => {
    try {
      const text = minify
        ? JSON.stringify(JSON.parse(data))
        : JSON.stringify(JSON.parse(data), null, 2)
      copyText(text).then(() => {
        toast("复制成功", { type: "success" })
      })
    } catch {
      toast("复制失败，JSON格式有误", { type: "error" })
    }
  }
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
    outputActions
  }
}
