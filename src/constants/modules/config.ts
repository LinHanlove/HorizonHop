import { Biohazard, Code, Component, DiamondMinus, Earth, FileText, Github, LibraryBig, Package, Search, Settings, Smartphone, Trash2, WandSparkles } from "lucide-react"
import { createTab, openGitHubDev } from "~utils";

/**
 * @constant 插件的配置常量
 */
export const CONFIG = {
  name:'Horizon-Hop'
}

/**
 * @constant 默认搜索配置
 */
export const defaultShortcuts: TYPE.DefaultShortcuts[] = [
  {
    alias: "baidu",
    icon: Search,
    iconColor: "#ff0000", 
    prefix: "https://www.baidu.com/s?ie=utf-8&tn=25017023_17_dg&wd=",
    suffix: "",
    category: "search" 
  },
  {
    alias: "google",
    icon: Earth,
    iconColor: "#4285f4", 
    prefix: "https://www.google.com/search?q=",
    suffix: "&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPDIGCAQQRRg8MgYIBRBFGEEyBggGEEUYPDIGCAcQRRhB0gEINTUyNWowajmoAgCwAgE&sourceid=chrome&ie=UTF-8",
    category: "search"
  },
  { 
    alias: "npm",
    icon: Package,
    iconColor: "#c12127", 
    prefix: "https://www.npmjs.com/search?q=",
    suffix: "",
    category: "dev"
  },
  {
    alias: "github",
    icon: Github,
    iconColor: "#181717", 
    prefix: "https://github.com/search?q=",
    suffix: "&type=repositories",
    category: "dev"
  },
  {
    alias: "csdn",
    icon: LibraryBig,
    iconColor: "#ff6600", 
    prefix: "https://so.csdn.net/so/search?spm=1000.2115.3001.4498&q=",
    suffix: "&t=&u=",
    category: "dev"
  },
  {
    alias: "juejin",
    icon: LibraryBig,
    iconColor: "#f0ad4e", 
    prefix: "https://juejin.cn/search?query=",
    suffix: "&fromSeo=0&fromHistory=0&fromSuggest=0",
    category: "dev"
  },
  {
    alias: "vant",
    icon: Smartphone,
    iconColor: "#00b4ff", 
    prefix: "https://vant.pro/vant-weapp/#/",
    suffix: "",
    category: "dev"
  },
  {
    alias: "element2",
    icon: Biohazard,
    iconColor: "#409eff", 
    prefix: "https://element.eleme.cn/#/zh-CN/component/",
    suffix: "",
    category: "dev"
  },
  {
    alias: "element3",
    icon: Biohazard,
    iconColor: "#409eff", 
    prefix: "https://element-plus.org/zh-CN/component/",
    suffix: ".html",
    category: "dev"
  },
  {
    alias: "antdV",
    icon: Component,
    iconColor: "#1677ff", 
    prefix: "https://www.antdv.com/components/",
    suffix: "-cn",
    category: "dev"
  },
  {
    alias: "antdR",
    icon: Component,
    iconColor: "#1677ff", 
    prefix: "https://ant.design/components/",
    suffix: "-cn",
    category: "dev"
  },
  {
    alias: "iconify",
    icon: WandSparkles,
    iconColor: "#8e44ad", // Iconify紫
    prefix: "https://icon-sets.iconify.design/?query=",
    suffix: "",
    category: "design"
  },
];

/**
 * @constant 功能菜单配置
 */
export const menuList:TYPE.FunctionMenu[] = [
  {
    title: "JsonFormatter",
    icon: Code,
    description: "JSON格式化",
    event: () => {
      createTab({
        chrome,
        url: "JsonFormatter"
      })
    }
  },
  {
    title: "CompressHero",
    icon: FileText,
    description: "图片压缩",
    event: () => {
      createTab({
        chrome,
        url: "CompressHero"
      })
    }
  },
  {
    title: "GithubDev",
    icon: Github,
    description: "github源码查看",
    event: () => openGitHubDev()
  },
  {
    title: "TableMarkdown",
    icon: DiamondMinus,
    description: "语雀表格Json",
    event: () => {
      createTab({
        chrome,
        url: "TableMarkdown"
      })
    }
  },
  {
    title: "删除预设",
    icon: Trash2,
    description: "删除预设",
    event: () => {}
  }
]
