import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Switch } from "~components/ui/switch"
import { Textarea } from "~components/ui/textarea"

import "~/assets/style/tailwind.css"
import "~/assets/style/jsonFormatter.css"

import { copyText, notify } from "~utils"

import { JsonFormatter as formatter } from "../utils/ability/jsonFormatter"

export default function JsonFormatter() {
  // 格式化前的数据
  const [data, setData] = useState<string>("{}")

  // 获取json-container
  const [jsonContainer, setJsonContainer] = useState<HTMLElement>()

  // 操作栏
  const [action, setAction] = useState([
    {
      name: "quoteKeys",
      value: false
    },
    {
      name: "lineNumbers",
      value: true
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
    <div className="lh-min-h-screen lh-bg-[#fafafa] lh-p-8">
      <div className="lh-max-w-[1400px] lh-mx-auto">
        <div className="lh-flex lh-items-center lh-justify-between lh-mb-8">
          <h2 className="title lh-text-2xl lh-font-bold lh-text-gray-900 lh-flex lh-items-center">
            <Icon
              icon="solar:code-bold"
              className="lh-w-6 lh-h-6 lh-mr-2 lh-text-teal-600"
            />
            JsonFormatter
          </h2>
          <div className="lh-flex lh-items-center lh-space-x-4">
            <a
              title="使用文档"
              href="https://linhan.atomnotion.com/posts/about-atomHoneycomb"
              target="_blank"
              rel="noopener noreferrer"
              className="lh-flex lh-items-center lh-text-sm lh-text-gray-600 lh-hover:text-teal-600 lh-transition-colors">
              <Icon
                icon="solar:document-bold"
                className="lh-w-4 lh-h-4 lh-mr-1"
              />
              使用文档
            </a>
          </div>
        </div>

        <div className="lh-bg-white lh-rounded-2xl lh-shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] lh-border lh-border-gray-100 lh-overflow-hidden">
          <div className="lh-p-6 lh-border-b lh-border-gray-100">
            <div className="lh-flex lh-items-center lh-text-sm lh-text-gray-500">
              <Icon
                icon="solar:info-circle-bold"
                className="lh-w-4 lh-h-4 lh-mr-2 lh-text-orange-500"
              />
              <span>在【lineNumbers】模式下双击格式化后的行可复制到剪切板</span>
              <span className="lh-mx-2 lh-text-gray-300">|</span>
              <span>缩进可调整</span>
              <span className="lh-mx-2 lh-text-gray-300">|</span>
              <span>操作项可多选</span>
            </div>
          </div>

          <div className="container lh-p-6">
            <div className="content lh-grid lh-grid-cols-2 lh-gap-8">
              <div className="lh-col-span-1 lh-flex lh-flex-col">
                <div className="lh-h-10 lh-flex lh-items-center lh-justify-between lh-mb-4">
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
                <div className="input-area lh-flex-1">
                  <Textarea
                    id="json-input-area"
                    title="json-input-area"
                    className="lh-w-full lh-h-full lh-min-h-[500px] lh-p-4 lh-bg-gray-50 lh-border-gray-200 lh-rounded-xl lh-resize-none lh-shadow-sm lh-focus:ring-2 lh-focus:ring-teal-500/20 lh-focus:border-teal-500 lh-transition-all lh-duration-200 lh-text-gray-700 lh-text-sm lh-font-mono"
                    inputMode="text"
                    onChange={(e: any) => setData(e.target.value)}
                  />
                </div>
              </div>
              <div className="lh-col-span-1 lh-flex lh-flex-col">
                <div className="lh-h-10 lh-flex lh-items-center lh-justify-between lh-mb-4">
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
                        notify({
                          message: "复制成功",
                          chrome
                        })
                      })
                    }}
                    className="lh-h-8 lh-w-8">
                    <Icon
                      icon="solar:copy-bold"
                      className="lh-w-4 lh-h-4 lh-text-gray-400"
                    />
                  </Button>
                </div>
                <div className="output-area lh-flex-1">
                  <div className="lh-w-full lh-h-full lh-min-h-[500px] lh-overflow-y-auto lh-p-4 lh-bg-gray-50 lh-border lh-border-gray-200 lh-rounded-xl lh-shadow-sm">
                    <pre className="json-container lh-rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="action lh-flex lh-items-center lh-justify-between lh-p-6 lh-bg-gray-50 lh-border-t lh-border-gray-100">
            <div className="lh-flex lh-items-center lh-space-x-6">
              {action.map((item, index) => {
                return (
                  <div className="lh-flex lh-items-center" key={index}>
                    <Switch
                      checked={item.value}
                      onCheckedChange={() => handleChange(item)}
                      className="lh-data-[state=checked]:lh-bg-teal-600"
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
              <Input
                type="number"
                id="indent"
                min={2}
                step={2}
                max={6}
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="lh-ml-2 lh-w-14 lh-h-8 lh-text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
