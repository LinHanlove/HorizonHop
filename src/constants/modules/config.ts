/**
 * @constant 插件的配置常量
 */
export const CONFIG = {
  name:'Horizon-Hop'
}

/**
 * @constant 默认搜索配置
 */
/**
 */
export const defaultSetting:TYPE.DefaultSearch[] = [
  {
    alias: "baidu",
    icon: "icon-search",
    prefix: "https://www.baidu.com/s?ie=utf-8&tn=25017023_17_dg&wd=",
    suffix: "",
    category: "search" 
  },
   {
    alias: "google",
    icon: "icon-aperture",
    prefix: "https://www.google.com/search?q=",
    suffix:
      "&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPDIGCAQQRRg8MgYIBRBFGEEyBggGEEUYPDIGCAcQRRhB0gEINTUyNWowajmoAgCwAgE&sourceid=chrome&ie=UTF-8",
    category: "search"
  },
  { 
    alias: "npm",
    icon:"icon-package",
    prefix: "https://www.npmjs.com/search?q=", 
    suffix: "" ,
    category: "dev"
  },
  {
    alias: "github",
    icon: 'icon-github',
    prefix: "https://github.com/search?q=",
    suffix: "&type=repositories",
    category: "dev"
  },
  {
    alias: "csdn",
    icon: "icon-text-select",
    prefix: "https://so.csdn.net/so/search?spm=1000.2115.3001.4498&q=",
    suffix: "&t=&u=",
    category: "dev"
  },
  {
    alias: "juejin",
    icon: "icon-text-select",
    prefix: "https://juejin.cn/search?query=",
    suffix: "&fromSeo=0&fromHistory=0&fromSuggest=0",
    category: "dev"
  },
  {
    alias: "vant",
    icon: "icon-caravan",
    prefix: "https://vant.pro/vant-weapp/#/",
    suffix: "",
    category: "dev"
  },
  {
    alias: "element2",
    icon: "icon-biohazard",
    prefix: "https://element.eleme.cn/#/zh-CN/component/",
    suffix: "",
    category: "dev"
  },
  {
    alias: "element3",
    icon: "icon-biohazard",
    prefix: "https://element-plus.org/zh-CN/component/",
    suffix: ".html",
    category: "dev"
  },
  {
    alias: "antdV",
    icon:"icon-component",
    prefix: "https://www.antdv.com/components/",
    suffix: "-cn",
    category: "dev"
  },
  {
    alias: "antdR",
    icon:"icon-component",
    prefix: "https://ant.design/components/",
    suffix: "-cn",
    category: "dev"
  },
  {
    alias: "iconify",
    icon:"icon-signature",
    prefix: "https://icon-sets.iconify.design/?query=",
    suffix: "",
    category: "design"
  },
]