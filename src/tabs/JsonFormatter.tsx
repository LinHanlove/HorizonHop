import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import ReactJson from "react-json-view"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Switch } from "~components/ui/switch"
import { Textarea } from "~components/ui/textarea"

import "~/assets/style/tailwind.css"
import "~/assets/style/jsonFormatter.css"

import { SonnerProvider, toast } from "~components/base/Sonner"
import { CONFIG } from "~constants"
import { copyText } from "~utils"

import { JsonFormatter as formatter } from "../utils/ability/jsonFormatter"

/**
 * JsonFormatter 页面组件
 * 实现功能：JSON 格式化、压缩、复制、导入导出、自动校验、主题切换、折叠等
 * 右侧配置栏和 Output 区操作栏均为配置驱动循环渲染，便于维护和扩展
 */
export default function JsonFormatter() {
  // 输入区内容（字符串形式的 JSON）
  const [data, setData] = useState<string>()

  // 原生格式化区容器（暂未用到）
  const [jsonContainer, setJsonContainer] = useState<HTMLElement>()

  // 备用操作栏配置（暂未用到）
  const [action, setAction] = useState([
    { name: "quoteKeys", value: false },
    { name: "lineNumbers", value: true },
    { name: "linkUrls", value: true },
    { name: "linksNewTab", value: true },
    { name: "trailingCommas", value: false }
  ])
  // 输入区缩进宽度
  const [indent, setIndent] = useState(2)

  // 右侧配置栏可选项
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
  // 右侧配置栏各项状态
  const [theme, setTheme] = useState("rjv-default" as any) // 主题
  const [iconStyle, setIconStyle] = useState<"triangle" | "circle" | "square">(
    "triangle"
  ) // icon风格
  const [indentWidth, setIndentWidth] = useState(2) // 缩进宽度
  // 折叠层级，false为全部展开，数字为折叠层数
  const [collapsed, setCollapsed] = useState<false | number>(false)
  const [collapseStringsAfterLength, setCollapseStringsAfterLength] =
    useState(0) // 折叠字符串长度
  const [displayDataTypes, setDisplayDataTypes] = useState(true) // 显示类型
  const [displayObjectSize, setDisplayObjectSize] = useState(false) // 显示对象长度
  const [enableEdit, setEnableEdit] = useState(false) // 可编辑
  const [enableClipboard, setEnableClipboard] = useState(true) // 可复制
  const [sortKeys, setSortKeys] = useState(false) // 排序key
  const [quotesOnKeys, setQuotesOnKeys] = useState(false) // key加引号

  // 文件导入input引用
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 输入区错误提示
  const [inputError, setInputError] = useState<string>("")

  // 处理复选框变化的函数（暂未用到）
  const handleChange = (item) => {
    const updatedAction = action.map((i) => {
      if (i.name === item.name) {
        return { ...i, value: !i.value }
      }
      return i
    })
    setAction(updatedAction)
  }

  /**
   * 获取备用操作栏配置项的值（暂未用到）
   */
  const getOption = () => {
    let option = {}
    action.forEach((item) => {
      option[item.name] = item.value
    })
    return option
  }

  /**
   * 原生格式化区双击复制（暂未用到）
   */
  const handleCopy = () => {
    const lis = document.querySelectorAll(".json-li")
    lis.forEach((li) => {
      li.addEventListener("dblclick", (e) => {
        const text = (e.target as HTMLElement).innerText
        copyText(text).then(() => {
          toast("复制成功", { type: "success" })
        })
      })
    })
  }

  /**
   * 原生格式化区渲染与复制（暂未用到）
   */
  useEffect(() => {
    try {
      setJsonContainer(document.querySelector(".json-container") as HTMLElement)
      if (!jsonContainer) return
      jsonContainer.innerHTML = formatter(JSON.parse(data || "{}"), {
        ...getOption(),
        indent: indent
      })
      handleCopy()
    } catch (error) {}
  }, [data, action, indent, jsonContainer])

  /**
   * 输入区自动聚焦
   */
  useEffect(() => {
    const Input = document.getElementById("json-input-area")
    if (Input) Input.focus()
  }, [])

  /**
   * 输入区内容自动校验JSON格式，错误时显示提示
   */
  useEffect(() => {
    try {
      JSON.parse(data || "{}")
      setInputError("")
    } catch (e: any) {
      setInputError(e.message)
    }
  }, [data])

  /**
   * 一键格式化输入区内容
   */
  const handleFormat = () => {
    try {
      setData(JSON.stringify(JSON.parse(data), null, 2))
    } catch {}
  }
  /**
   * 一键压缩输入区内容
   */
  const handleCompress = () => {
    try {
      setData(JSON.stringify(JSON.parse(data)))
    } catch {}
  }
  /**
   * 复制全部（格式化/压缩）
   * @param minify 是否压缩
   */
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
  /**
   * 导出当前内容为.json文件
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
  /**
   * 导入.json文件自动填充输入区
   */
  const handleImport = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string
        JSON.parse(text)
        setData(text)
        toast("导入成功", { type: "success" })
      } catch {
        toast("导入失败，文件内容不是有效JSON", { type: "error" })
      }
    }
    reader.readAsText(file)
  }

  /**
   * 右侧配置栏表单项配置数组
   * 每项包含类型、label、value、onChange、可选项、分组等
   * 通过map循环渲染，维护方便
   */
  type ConfigItem =
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
   * Output区上方操作栏按钮配置数组
   * 每个对象代表一个操作按钮，包含label和onClick
   * 通过map循环渲染，维护和扩展极其方便
   */
  type OutputAction = { label: string; onClick: () => void }
  const outputActions: OutputAction[] = [
    { label: "复制全部", onClick: () => handleCopyAll(false) },
    { label: "复制压缩", onClick: () => handleCopyAll(true) },
    { label: "一键格式化", onClick: handleFormat },
    { label: "一键压缩", onClick: handleCompress },
    { label: "导出JSON", onClick: handleExport },
    { label: "导入JSON", onClick: () => fileInputRef.current?.click() }
  ]

  return (
    <SonnerProvider>
      <div className="lh-h-screen lh-bg-[#fafafa] lh-p-4">
        <div className="lh-h-full lh-max-w-[1600px] lh-mx-auto lh-flex lh-flex-col">
          {/* 顶部说明区 */}
          <div className="lh-flex lh-flex-col lh-mb-6">
            <div className="lh-flex lh-items-center lh-justify-between">
              <div className="lh-flex lh-items-center lh-space-x-3">
                <div className="lh-w-10 lh-h-10 lh-rounded-xl lh-bg-gradient-to-br lh-from-teal-500 lh-to-teal-600 lh-flex lh-items-center lh-justify-center lh-shadow-lg lh-shadow-teal-500/20">
                  <Icon
                    icon="solar:code-bold"
                    className="lh-w-6 lh-h-6 lh-text-white"
                  />
                </div>
                <div>
                  <h2 className="lh-text-2xl lh-font-bold lh-text-gray-900 lh-flex lh-items-center">
                    JsonFormatter
                  </h2>
                  <p className="lh-text-sm lh-text-gray-500 lh-mt-0.5">
                    优雅的 JSON 格式化工具
                  </p>
                </div>
              </div>
              <div className="lh-flex lh-items-center lh-space-x-4">
                <a
                  title="使用文档"
                  href={CONFIG.usingTutorialsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lh-flex lh-items-center lh-px-4 lh-py-2 lh-text-sm lh-text-gray-600 lh-bg-white lh-rounded-lg lh-border lh-border-gray-200 lh-shadow-sm lh-hover:border-teal-500 lh-hover:text-teal-600 lh-transition-all lh-duration-200">
                  <Icon
                    icon="solar:document-bold"
                    className="lh-w-4 lh-h-4 lh-mr-2"
                  />
                  使用文档
                </a>
              </div>
            </div>
          </div>
          {/* 主体内容区+配置栏 */}
          <div className="lh-h-full lh-flex lh-flex-row lh-gap-6">
            {/* 主内容区 */}
            <div className="lh-flex-1 lh-flex lh-gap-6">
              {/* 输入区（40%） */}
              <div className="lh-w-[40%] lh-min-w-0 lh-flex lh-flex-col lh-h-full">
                <div className="lh-h-8 lh-flex lh-items-center lh-justify-between lh-mb-2">
                  <h3 className="lh-text-base lh-font-semibold lh-text-gray-900 lh-flex lh-items-center">
                    <Icon
                      icon="solar:arrow-left-bold"
                      className="lh-w-4 lh-h-4 lh-mr-2 lh-text-gray-400"
                    />
                    Input
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setData("{}")}
                    className="lh-h-8">
                    <Icon
                      icon="solar:trash-bin-trash-bold"
                      className="lh-w-3.5 lh-h-3.5 lh-mr-1"
                    />
                    清空
                  </Button>
                </div>
                {/* 输入区错误提示（移到输入框上方） */}
                {inputError && (
                  <div className="lh-mb-2 lh-text-xs lh-text-red-500 lh-bg-red-50 lh-px-2 lh-py-1 lh-rounded">
                    JSON格式错误：{inputError}
                  </div>
                )}
                <div className="lh-flex-1 lh-overflow-y-auto">
                  <div className="lh-w-full lh-h-full lh-bg-gray-50 lh-border lh-border-gray-200 lh-rounded-xl lh-shadow-sm lh-p-4 lh-max-h-[calc(100vh-220px)] lh-overflow-y-auto">
                    <Textarea
                      id="json-input-area"
                      title="json-input-area"
                      className="lh-w-full lh-h-full lh-bg-transparent lh-border-0 lh-shadow-none lh-text-gray-700 lh-text-sm lh-font-mono lh-resize-none"
                      inputMode="text"
                      value={data}
                      onChange={(e: any) => {
                        setData(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* 展示区（60%） */}
              <div className="lh-w-[60%] lh-min-w-0 lh-flex lh-flex-col lh-h-full">
                <div className="lh-h-8 lh-flex lh-items-center lh-justify-between lh-mb-2">
                  <h3 className="lh-text-base lh-font-semibold lh-text-gray-900 lh-flex lh-items-center">
                    <Icon
                      icon="solar:arrow-right-bold"
                      className="lh-w-4 lh-h-4 lh-mr-2 lh-text-gray-400"
                    />
                    Output
                  </h3>
                </div>
                <div className="lh-flex-1 lh-overflow-y-auto lh-border lh-border-gray-200 lh-rounded-xl lh-shadow-sm lh-max-h-[calc(100vh-220px)]">
                  <div className="lh-w-full lh-h-full lh-bg-gray-50 lh-p-4 lh-overflow-y-auto">
                    {/* Output区上方操作栏 */}
                    {/*
                      通过outputActions配置数组循环渲染操作按钮，
                      保证按钮顺序、功能、样式统一，后续维护更方便
                    */}
                    <div className="lh-flex lh-items-center lh-mb-2 lh-gap-2">
                      {outputActions.map((action, idx) => (
                        <Button
                          key={action.label}
                          size="sm"
                          variant="outline"
                          onClick={action.onClick}>
                          {action.label}
                        </Button>
                      ))}
                      {/* 隐藏的文件上传input，用于导入JSON */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        style={{ display: "none" }}
                        onChange={handleImport}
                      />
                    </div>
                    <ReactJson
                      src={(() => {
                        try {
                          return JSON.parse(data || "{}")
                        } catch {
                          return {}
                        }
                      })()}
                      theme={theme as any}
                      iconStyle={iconStyle}
                      indentWidth={indentWidth}
                      collapsed={collapsed}
                      collapseStringsAfterLength={
                        collapseStringsAfterLength > 0
                          ? collapseStringsAfterLength
                          : false
                      }
                      displayDataTypes={displayDataTypes}
                      displayObjectSize={displayObjectSize}
                      enableClipboard={enableClipboard}
                      onEdit={enableEdit ? () => {} : false}
                      onAdd={enableEdit ? () => {} : false}
                      onDelete={enableEdit ? () => {} : false}
                      sortKeys={sortKeys}
                      quotesOnKeys={quotesOnKeys}
                      style={{
                        background: "transparent",
                        fontFamily: "menlo, consolas, monospace",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        lineHeight: "1.4",
                        color: "#222",
                        minHeight: "100%",
                        overflow: "auto"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* 右侧配置栏，顶部与Output区顶部对齐 */}
            <div
              className="lh-w-48 lh-bg-white lh-border lh-border-gray-200 lh-p-4 lh-flex lh-flex-col lh-space-y-4 lh-max-h-[calc(100vh-220px)]  lh-rounded-xl lh-shadow-xl lh-z-10 lh-bg-gradient-to-b lh-from-gray-50 lh-to-white"
              style={{ marginTop: "40px" }}>
              {configList.map((item, idx) =>
                item.group === "block" ? (
                  <div
                    key={idx}
                    className="lh-border-b lh-border-gray-100 lh-pb-2 lh-mb-2">
                    <label className="lh-block lh-mb-1 lh-text-xs lh-text-gray-600">
                      {item.label}
                    </label>
                    {item.type === "input" && (
                      <Input
                        {...item.inputProps}
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}
                        className="lh-w-full lh-h-8 lh-text-xs lh-transition-all lh-duration-200 focus:lh-border-teal-500"
                      />
                    )}
                    {item.type === "select" && (
                      <select
                        className="lh-w-full lh-h-8 lh-text-xs lh-border lh-border-gray-200 lh-rounded lh-transition-all lh-duration-200 focus:lh-border-teal-500"
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}>
                        {item.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="lh-flex lh-items-center lh-justify-between lh-py-1 lh-px-1 lh-rounded hover:lh-bg-gray-100 transition-all duration-200">
                    <label className="lh-text-xs lh-text-gray-600">
                      {item.label}
                    </label>
                    <Switch
                      checked={item.value}
                      onCheckedChange={(checked) => item.onChange(!!checked)}
                      className="lh-ml-2"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </SonnerProvider>
  )
}
