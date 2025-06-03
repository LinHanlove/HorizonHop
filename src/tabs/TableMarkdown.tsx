import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"

import "@wangeditor/editor/dist/css/style.css" // 引入 css

import type { IDomEditor, IEditorConfig } from "@wangeditor/editor"
import { Editor } from "@wangeditor/editor-for-react"

import "~/assets/style/tailwind.css"
import "~/assets/style/jsonFormatter.css"

import { SonnerProvider, toast } from "~components/base/Sonner"
import { Button } from "~components/ui/button"
import { CONFIG } from "~constants"
import { copyText, notify } from "~utils"

import { JsonFormatter as formatter } from "../utils/ability/jsonFormatter"

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

  // 获取json-container
  const [jsonContainer, setJsonContainer] = useState<HTMLElement>()

  // 操作栏
  const [action, setAction] = useState([
    {
      name: "quoteKeys",
      value: true
    },
    {
      name: "lineNumbers",
      value: false
    },
    {
      name: "linkUrls",
      value: true
    },
    {
      name: "linksNewTab",
      value: true
    },
    {
      name: "trailingCommas",
      value: false
    }
  ])
  // 缩进
  const [indent, setIndent] = useState(2)

  // 处理复选框变化的函数
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
   * @function getOption
   * @description 获取操作项的值
   * @returns 返回一个对象，对象的属性名是操作项的name，属性值是操作项的value
   */
  const getOption = () => {
    let option = {}
    action.forEach((item) => {
      option[item.name] = item.value
    })
    return option
  }

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

  /**
   * @function 双击复制
   */
  const handleCopy = () => {
    const lis = document.querySelectorAll(".json-li")
    lis.forEach((li) => {
      li.addEventListener("dblclick", (e) => {
        const text = (e.target as HTMLElement).innerText
        copyText(text).then(() => {
          notify({
            message: "复制成功",
            chrome
          })
        })
      })
    })
  }

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

  useEffect(() => {
    // 直接使用document对象来获取DOM元素
    const Input = document.getElementById("json-input-area")
    if (Input) Input.focus()
  }, [])

  return (
    <SonnerProvider>
      <div className="lh-h-screen lh-bg-[#fafafa] lh-p-4 lh-overflow-hidden">
        <div className="lh-h-full lh-max-w-[1400px] lh-mx-auto lh-flex lh-flex-col">
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

          <div className="lh-bg-white lh-rounded-2xl lh-shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] lh-border lh-border-gray-100 lh-overflow-hidden lh-flex-1 lh-flex lh-flex-col">
            <div className="lh-p-4 lh-border-b lh-border-gray-100 lh-bg-gradient-to-r lh-from-gray-50 lh-to-white">
              <div className="lh-flex lh-items-center lh-text-sm lh-text-gray-500">
                <Icon
                  icon="solar:info-circle-bold"
                  className="lh-w-4 lh-h-4 lh-mr-2 lh-text-orange-500"
                />
                <span className="lh-font-medium">
                  复制markdown格式下的表格到Input，解析为对应的对象数组格式。
                </span>
                <span className="lh-mx-2 lh-text-gray-300">|</span>
                <span>格式化后的行双击可复制到剪切板。</span>
                <span className="lh-mx-2 lh-text-gray-300">|</span>
                <span>缩进和操作项可调整。</span>
              </div>
            </div>

            <div className="container lh-p-4 lh-flex-1 lh-overflow-hidden">
              <div className="content lh-grid lh-grid-cols-2 lh-gap-4 lh-h-full">
                <div className="lh-col-span-1 lh-flex lh-flex-col lh-h-full">
                  <div className="lh-h-8 lh-flex lh-items-center lh-justify-between lh-mb-2">
                    <h3 className="lh-text-base lh-font-semibold lh-text-gray-900 lh-flex lh-items-center">
                      <Icon
                        icon="solar:arrow-left-bold"
                        className="lh-w-4 lh-h-4 lh-mr-2 lh-text-gray-400"
                      />
                      Input
                    </h3>
                  </div>
                  <div className="input-area lh-flex-1 lh-overflow-y-auto lh-max-h-[calc(100vh-280px)]">
                    <Editor
                      className="lh-w-full lh-h-full lh-p-4 lh-bg-gray-50 lh-border-gray-200 lh-rounded-xl lh-resize-none lh-shadow-sm lh-focus:ring-2 lh-focus:ring-purple-500/20 lh-focus:border-purple-500 lh-transition-all lh-duration-200 lh-text-gray-700 lh-text-sm lh-font-mono"
                      defaultConfig={editorConfig}
                      value={html}
                      onCreated={setEditor}
                      onChange={(editor) => handleEditorChange(editor)}
                      mode="default"
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
                <div className="lh-col-span-1 lh-flex lh-flex-col lh-h-full">
                  <div className="lh-h-8 lh-flex lh-items-center lh-justify-between lh-mb-2">
                    <h3 className="lh-text-base lh-font-semibold lh-text-gray-900 lh-flex lh-items-center">
                      <Icon
                        icon="solar:arrow-right-bold"
                        className="lh-w-4 lh-h-4 lh-mr-2 lh-text-gray-400"
                      />
                      Output
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (!jsonContainer.innerText) return
                        copyText(jsonContainer.innerText).then(() => {
                          toast("复制成功", { type: "success" })
                        })
                      }}
                      className="lh-h-8 lh-w-8">
                      <Icon
                        icon="solar:copy-bold"
                        className="lh-w-4 lh-h-4 lh-text-gray-400"
                      />
                    </Button>
                  </div>
                  <div className="output-area lh-flex-1 lh-overflow-y-auto lh-max-h-[calc(100vh-280px)]">
                    <div className="lh-w-full lh-h-full lh-p-4 lh-bg-gray-50 lh-border lh-border-gray-200 lh-rounded-xl lh-shadow-sm lh-overflow-auto">
                      <pre className="json-container lh-rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="action lh-flex lh-items-center lh-justify-between lh-p-4 lh-bg-gray-50 lh-border-t lh-border-gray-100">
              <div className="lh-flex lh-items-center lh-space-x-6">
                {action.map((item, index) => {
                  return (
                    <div className="lh-flex lh-items-center" key={index}>
                      {/* Using native input for now, can replace with UI component if available */}
                      <input
                        title={item.name}
                        checked={item.value}
                        onChange={() => handleChange(item)}
                        type="checkbox"
                        id={item.name}
                        className="lh-form-checkbox lh-h-4 lh-w-4 lh-text-purple-600 lh-transition duration-150 ease-in-out lh-rounded lh-border-gray-300 focus:lh-ring-purple-500"
                      />
                      <label
                        className="lh-ml-2 lh-text-xs lh-text-gray-600"
                        htmlFor={item.name}>
                        {item.name}
                      </label>
                    </div>
                  )
                })}
              </div>
              <div className="lh-flex lh-items-center">
                <label className="lh-text-xs lh-text-gray-600" htmlFor="indent">
                  indent:
                </label>
                {/* Using native input for now, can replace with UI component if available */}
                <input
                  className="lh-ml-2 lh-w-14 lh-h-8 lh-text-xs lh-border-gray-300 lh-rounded-md lh-shadow-sm focus:lh-border-purple-500 focus:lh-ring-purple-500"
                  title="indent"
                  type="number"
                  id="indent"
                  min={2}
                  step={2}
                  max={6}
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SonnerProvider>
  )
}
