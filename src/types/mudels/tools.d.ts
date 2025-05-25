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

}