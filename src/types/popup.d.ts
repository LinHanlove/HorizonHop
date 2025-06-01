declare namespace TYPE {
  /**
   * @type 默认搜索配置
   */
  interface Shortcuts {
    id: string // id
    alias: string // 别名
    icon:
      | ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
        >
      | string // 图标
    iconColor?: string // 图标颜色
    prefix: string // 前缀
    suffix: string // 后缀
    category: string // 分类
  }

  /**
   * @type 初始化配置
   */
  interface InitConfig {
    chrome: any // chrome对象
  }

  /**
   * @type 功能菜单配置
   */
  interface FunctionMenu {
    id: string // id
    title: string
    icon: LucideIcon
    description: string
    category: string
    event: (chrome?: any) => void
  }
}
