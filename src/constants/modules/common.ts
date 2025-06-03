/**
 * @constant 类目类型
 */
export const SHORTCUT_TYPE = {
  dev: "dev",
  search: "search",
  tool: "tool",
  design: "design",
  other: "other"
}

/**
 * @constant 类目类型name
 */
export const SHORTCUT_TYPE_NAME = {
  [SHORTCUT_TYPE.dev]: "开发",
  [SHORTCUT_TYPE.search]: "搜索",
  [SHORTCUT_TYPE.tool]: "工具",
  [SHORTCUT_TYPE.design]: "设计",
  [SHORTCUT_TYPE.other]: "其他"
}

/**
 * @constants 类目
 */
export const SHORTCUT_TYPE_MAP = [
  {
    value: SHORTCUT_TYPE.dev,
    label: SHORTCUT_TYPE_NAME[SHORTCUT_TYPE.dev]
  },
  {
    value: SHORTCUT_TYPE.search,
    label: SHORTCUT_TYPE_NAME[SHORTCUT_TYPE.search]
  },
  {
    value: SHORTCUT_TYPE.tool,
    label: SHORTCUT_TYPE_NAME[SHORTCUT_TYPE.tool]
  },
  {
    value: SHORTCUT_TYPE.design,
    label: SHORTCUT_TYPE_NAME[SHORTCUT_TYPE.design]
  },
  {
    value: SHORTCUT_TYPE.other,
    label: SHORTCUT_TYPE_NAME[SHORTCUT_TYPE.other]
  }
]

/**
 * 安全页面重定向列表
 */
export const safePages = [
  {
    name: "CSDN",
    url: "link.csdn.net",
    handlers: [
      {
        type: "forward",
        start: "target="
      }
    ]
  },
  {
    name: "掘金",
    url: "link.juejin.cn",
    handlers: [
      {
        type: "forward",
        start: "target="
      }
    ]
  },
  {
    name: "简书",
    url: "jianshu.com/go-wild?ac=2",
    handlers: [
      {
        type: "forward",
        start: "url="
      }
    ]
  },
  {
    name: "知乎",
    url: "link.zhihu.com",
    handlers: [
      {
        type: "forward",
        start: "target="
      }
    ]
  },
  {
    name: "开源中国",
    url: "oschina.net/action/GoToLink",
    handlers: [
      {
        type: "forward",
        start: "url="
      }
    ]
  },
  {
    name: "码云",
    url: "gitee.com/link",
    handlers: [
      {
        type: "forward",
        start: "target="
      }
    ]
  }
]
