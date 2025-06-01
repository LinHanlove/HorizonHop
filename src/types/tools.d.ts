declare namespace TYPE {
  /**
   * @Type 发送消息
   */
  interface SendMessage {
    type: string // 消息类型
    origin: string // 消息来源
    data?: any // 消息内容
    chrome?: any // chrome
  }

  /**
   * @Type 系统通知弹窗
   */
  interface ChromeMessage {
    // 消息类型 [https://developer.chrome.com/docs/extensions/reference/api/notifications?hl=zh-cn#type-TemplateType]
    type?: "basic" | "image" | "list" | "progress"
    title?: string // 标题
    message: string // 内容
    iconUrl?: string // 图标
    chrome?: any
    timeout?: number // 显示时间
  }

  // json formatter
  interface IFormatOption {
    indent: number // 缩进空格数
    lineNumbers: boolean // 是否用 <ol> 标签包裹 HTML 以支持行号
    linkUrls: boolean // 是否为URL创建锚点标签
    linksNewTab: boolean // 是否给锚点标签添加 target=_blank 属性
    quoteKeys: boolean // 是否总是为键名使用双引号
    trailingCommas: boolean // 是否在数组和对象的最后一个项目后追加逗号
  }
  type FormatOptions = Partial<TYPE.IFormatOption>
  type JsonType = "key" | "string" | "number" | "boolean" | "null" | "mark"
}

declare module "*.json" {
  const value: any
  export default value
}
