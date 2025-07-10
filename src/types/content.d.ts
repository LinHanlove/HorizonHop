declare namespace TYPE {
  /**
   * @type 监听来自popup的消息
   */
  interface ListenerMessageOption {
    origin: string
    type: string
    data: any
  }
  // 工资配置类型
  interface SalaryConfig {
    workStart: string
    workEnd: string
    monthSalary: number
    restType: "double" | "single" | "alt"
    overtime: boolean
    overtimeHours: number
    /** 发薪日（1-31，>=当月天数则为月底） */
    payday: number
  }
}
