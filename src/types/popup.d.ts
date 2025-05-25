declare namespace TYPE {
  /**
   * @type 默认搜索配置
   */
  interface DefaultShortcuts {
    alias:string; // 别名
    icon:ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; // 图标
    iconColor?:string; // 图标颜色
    prefix:string; // 前缀
    suffix:string; // 后缀
    category:string; // 分类
  }

  /**
   * @type 功能菜单配置
   */
  interface FunctionMenu {
    title:string; // 标题
    icon:ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; // 图标
    description:string; // 描述
    event: () => void; // 事件
  }
}