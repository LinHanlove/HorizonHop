import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import ReactJson from "react-json-view"

import "@wangeditor/editor/dist/css/style.css" // 引入 css

import type { IDomEditor, IEditorConfig } from "@wangeditor/editor"
import { Editor } from "@wangeditor/editor-for-react"

import "~/assets/style/tailwind.css"

import { SonnerProvider, toast } from "~components/base/Sonner"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Switch } from "~components/ui/switch"
import { CONFIG } from "~constants"
import { useJsonViewConfig } from "~hooks"

// 右侧配置栏表单项配置数组类型
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

export default function TableMarkdown() {
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  const [html, setHtml] = useState("")

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容..."
  }

  // 销毁编辑器
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  // 格式化前的数据
  const [data, setData] = useState<string>("{}")

  // Output区上方操作栏按钮配置数组
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 使用 useJsonViewConfig 统一管理 json-view 配置
  const {
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
  } = useJsonViewConfig({
    data,
    setData,
    fileInputRef
  })

  /**
   * @function 处理编辑器内容变化
   */
  const handleEditorChange = (editor) => {
    console.log("原数据", editor.getHtml())

    setHtml(editor.getHtml())
    const parser = new DOMParser()
    const doc = parser.parseFromString(editor.getHtml(), "text/html")

    // 获取表格行
    const rows = doc.querySelectorAll("table tbody tr")

    // 提取表格数据并转换为对象数组
    const data = Array.from(rows).map((row) => {
      const cells = row.querySelectorAll("td")

      return {
        key: cells[0]?.innerText?.trim(),
        type: cells[1]?.innerText?.trim(),
        required: cells[2]?.innerText?.trim(),
        description: cells[3]?.innerText?.trim()
      }
    })

    console.log("原数据", data)

    setData(JSON.stringify({ TableMarkdown: formatData(data) }))
  }

  /**
   * @function 格式化数组
   * 遇到type为List格式的，则当前key为数组，继续向下遍历，遇到key为└开头的，则当前key为数组中的元素
   * 直到遇到下一个List或不是└开头的结束
   */
  const formatData = (data) => {
    const result = []
    const processedIndices = new Set() // 用于记录已处理的索引

    // 英文的正则
    const notEnglish = /[\u4e00-\u9fa5]/g

    // 移除第一个元素如果它是一个非英文描述
    if (data[0] && data[0].type.match(notEnglish)) {
      data.shift() // 使用shift而不是splice，因为它不会修改原数组
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      if (["List", "list", "Array", "array", "[]"].includes(item.type)) {
        const list = []
        let j = i + 1

        // 如果下一个元素不是以└开头，直接添加当前项
        if (!data[j] || !data[j].key.startsWith("└")) {
          result.push(item)
        } else {
          // 处理以└开头的元素
          while (j < data.length && data[j].key.startsWith("└")) {
            processedIndices.add(j) // 标记为已处理
            const cloneData = {
              ...data[j],
              key: data[j].key.replace(/^└\s*/, "")
            }
            list.push(cloneData)
            j++
          }

          // 检查是否有嵌套的List结构
          if (list.length > 0) {
            // 递归处理嵌套的List
            const nestedList = formatData(list)
            nestedList.unshift({
              id: "List"
            })
            result.push({
              [item.key]: nestedList
            })
          } else {
            // 将提取的列表项添加到结果中
            result.push({
              [item.key]: list
            })
          }
          // 跳过已处理的项
          i = j - 1 // 注意这里的调整，确保 i 指向下一个未处理的项
        }
      } else if (["Object", "object", "obj"].includes(item.type)) {
        const obj = {}
        let j = i + 1

        // 如果下一个元素不是以└开头，直接添加当前项
        if (!data[j] || !data[j].key.startsWith("└")) {
          result.push(item)
        } else {
          // 处理以└开头的元素
          while (j < data.length && data[j].key.startsWith("└")) {
            processedIndices.add(j) // 标记为已处理
            const cloneData = {
              ...data[j],
              key: data[j].key.replace(/^└\s*/, "")
            }
            obj[cloneData.key] = cloneData
            j++
          }
          console.log("嵌套对象---->", obj)

          const nestedObj = formatData(Object.values(obj))
          nestedObj.unshift({
            id: "Object"
          })
          result.push({
            [item.key]: nestedObj
          })
          // 跳过已处理的项
          i = j - 1 // 注意这里的调整，确保 i 指向下一个未处理的项
        }
      } else {
        // 只添加未处理的项
        if (!processedIndices.has(i)) {
          result.push(item)
        }
      }
    }
    return result
  }

  useEffect(() => {
    // 直接使用document对象来获取DOM元素
    const Input = document.getElementById("json-input-area")
    if (Input) Input.focus()
  }, [])

  // 处理导入 JSON 文件
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

  return (
    <SonnerProvider>
      <div className="lh-h-screen lh-bg-[#fafafa] lh-p-4">
        <div className="lh-h-full lh-max-w-[1600px] lh-mx-auto lh-flex lh-flex-col">
          <div className="lh-flex lh-flex-col lh-mb-6">
            <div className="lh-flex lh-items-center lh-justify-between">
              <div className="lh-flex lh-items-center lh-space-x-3">
                <div className="lh-w-10 lh-h-10 lh-rounded-xl lh-bg-gradient-to-br lh-from-purple-500 lh-to-purple-600 lh-flex lh-items-center lh-justify-center lh-shadow-lg lh-shadow-purple-500/20">
                  <Icon
                    icon="material-symbols:table"
                    className="lh-w-6 lh-h-6 lh-text-white"
                  />
                </div>
                <div>
                  <h2 className="lh-text-2xl lh-font-bold lh-text-gray-900 lh-flex lh-items-center">
                    TableMarkdown
                  </h2>
                  <p className="lh-text-sm lh-text-gray-500 lh-mt-0.5">
                    表格 Markdown 转换工具
                  </p>
                </div>
              </div>
              <div className="lh-flex lh-items-center lh-space-x-4">
                <a
                  title="使用文档"
                  href={CONFIG.usingTutorialsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lh-flex lh-items-center lh-px-4 lh-py-2 lh-text-sm lh-text-gray-600 lh-bg-white lh-rounded-lg lh-border lh-border-gray-200 lh-shadow-sm lh-hover:border-purple-500 lh-hover:text-purple-600 lh-transition-all lh-duration-200">
                  <Icon
                    icon="solar:document-bold"
                    className="lh-w-4 lh-h-4 lh-mr-2"
                  />
                  使用文档
                </a>
              </div>
            </div>
          </div>

          <div className="lh-h-full lh-flex lh-flex-row lh-gap-6">
            <div className="lh-flex-1 lh-flex lh-gap-6">
              <div className="lh-w-[40%] lh-min-w-0 lh-flex lh-flex-col lh-h-full">
                <div className="lh-h-8 lh-flex lh-items-center lh-justify-between lh-mb-2">
                  <h3 className="lh-text-base lh-font-semibold lh-text-gray-900 lh-flex lh-items-center">
                    <Icon
                      icon="solar:arrow-left-bold"
                      className="lh-w-4 lh-h-4 lh-mr-2 lh-text-gray-400"
                    />
                    Input
                  </h3>
                </div>
                <div className="lh-flex-1 lh-overflow-y-auto">
                  <div className="lh-w-full lh-h-full lh-bg-gray-50 lh-border lh-border-gray-200 lh-rounded-xl lh-shadow-sm lh-p-4 lh-max-h-[calc(100vh-220px)] lh-overflow-y-auto">
                    <Editor
                      className="lh-w-full lh-h-full lh-bg-transparent lh-border-0 lh-shadow-none lh-text-gray-700 lh-text-sm lh-font-mono lh-resize-none"
                      defaultConfig={editorConfig}
                      value={html}
                      onCreated={setEditor}
                      onChange={(editor) => handleEditorChange(editor)}
                      mode="default"
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
              </div>
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
                        className="lh-w-full lh-h-8 lh-text-xs lh-transition-all lh-duration-200 focus:lh-border-purple-500"
                      />
                    )}
                    {item.type === "select" && (
                      <select
                        className="lh-w-full lh-h-8 lh-text-xs lh-border lh-border-gray-200 lh-rounded lh-transition-all lh-duration-200 focus:lh-border-purple-500"
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
