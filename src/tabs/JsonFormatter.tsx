import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import ReactJson from "react-json-view"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Switch } from "~components/ui/switch"
import { Textarea } from "~components/ui/textarea"

import "~/assets/style/tailwind.css"

import { SonnerProvider, toast } from "~components/base/Sonner"
import { CONFIG } from "~constants"
import { useJsonViewConfig } from "~hooks"

/**
 * JsonFormatter 页面组件
 * 实现功能：JSON 格式化、压缩、复制、导入导出、自动校验、主题切换、折叠等
 * 右侧配置栏和 Output 区操作栏均为配置驱动循环渲染，便于维护和扩展
 */
export default function JsonFormatter() {
  // 输入区内容（字符串形式的 JSON）
  const [data, setData] = useState<string>()

  // 文件导入input引用
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 输入区错误提示
  const [inputError, setInputError] = useState<string>("")

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

  const {
    theme: useJsonViewTheme,
    iconStyle: useJsonViewIconStyle,
    indentWidth: useJsonViewIndentWidth,
    collapsed: useJsonViewCollapsed,
    collapseStringsAfterLength: useJsonViewCollapseStringsAfterLength,
    displayDataTypes: useJsonViewDisplayDataTypes,
    displayObjectSize: useJsonViewDisplayObjectSize,
    enableEdit: useJsonViewEnableEdit,
    enableClipboard: useJsonViewEnableClipboard,
    sortKeys: useJsonViewSortKeys,
    quotesOnKeys: useJsonViewQuotesOnKeys,
    configList: useJsonViewConfigList,
    outputActions: useJsonViewOutputActions,
    objectToJsLiteral: useJsonViewObjectToJsLiteral
  } = useJsonViewConfig({
    data: data || "{}",
    setData,
    fileInputRef
  })

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
                      {useJsonViewOutputActions.map((action, idx) => (
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
                      theme={useJsonViewTheme as any}
                      iconStyle={useJsonViewIconStyle}
                      indentWidth={useJsonViewIndentWidth}
                      collapsed={useJsonViewCollapsed}
                      collapseStringsAfterLength={
                        useJsonViewCollapseStringsAfterLength > 0
                          ? useJsonViewCollapseStringsAfterLength
                          : false
                      }
                      displayDataTypes={useJsonViewDisplayDataTypes}
                      displayObjectSize={useJsonViewDisplayObjectSize}
                      enableClipboard={false}
                      onEdit={useJsonViewEnableEdit ? () => {} : false}
                      onAdd={useJsonViewEnableEdit ? () => {} : false}
                      onDelete={useJsonViewEnableEdit ? () => {} : false}
                      sortKeys={useJsonViewSortKeys}
                      quotesOnKeys={useJsonViewQuotesOnKeys}
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
              className="lh-w-[190px] lh-bg-white lh-border lh-border-gray-200 lh-p-4 lh-flex lh-flex-col lh-space-y-4 lh-max-h-[calc(100vh-220px)] lh-overflow-y-scroll lh-hide-scrollbar lh-rounded-xl lh-shadow-xl lh-z-10 lh-bg-gradient-to-b lh-from-gray-50 lh-to-white"
              style={{ marginTop: "40px" }}>
              {useJsonViewConfigList.map((item, idx) =>
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
