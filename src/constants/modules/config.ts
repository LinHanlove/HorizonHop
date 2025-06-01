import { Code, DiamondMinus, FileText, Github, Trash2 } from "lucide-react"

import { createTab, getUUID, openGitHubDev, sendMessage } from "~utils"

import packageJson from "../../../package.json"
import { MODEL_TYPE } from "./enum"

/**
 * @constant 插件的配置常量
 */
export const CONFIG = {
  name: "Horizon-Hop",
  version: packageJson.version,
  author: "LinHanPro"
}

/**
 * @constant 默认搜索配置
 */
export const defaultShortcuts: TYPE.Shortcuts[] = [
  {
    id: getUUID(),
    alias: "baidu",
    icon: "ri:baidu-fill",
    prefix: "https://www.baidu.com/s?ie=utf-8&tn=25017023_17_dg&wd=",
    suffix: "",
    category: "search"
  },
  {
    id: getUUID(),
    alias: "google",
    icon: "devicon:google",
    iconColor: "#4285f4",
    prefix: "https://www.google.com/search?q=",
    suffix:
      "&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPDIGCAQQRRg8MgYIBRBFGEEyBggGEEUYPDIGCAcQRRhB0gEINTUyNWowajmoAgCwAgE&sourceid=chrome&ie=UTF-8",
    category: "search"
  },
  {
    id: getUUID(),
    alias: "npm",
    icon: "devicon:npm",
    iconColor: "#c12127",
    prefix: "https://www.npmjs.com/search?q=",
    suffix: "",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "github",
    icon: "bytesize:github",
    iconColor: "#181717",
    prefix: "https://github.com/search?q=",
    suffix: "&type=repositories",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "csdn",
    icon: "simple-icons:csdn",
    prefix: "https://so.csdn.net/so/search?spm=1000.2115.3001.4498&q=",
    suffix: "&t=&u=",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "juejin",
    icon: "simple-icons:juejin",
    prefix: "https://juejin.cn/search?query=",
    suffix: "&fromSeo=0&fromHistory=0&fromSuggest=0",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "vant",
    icon: "arcticons:avant",
    iconColor: "#00b4ff",
    prefix: "https://vant.pro/vant-weapp/#/",
    suffix: "",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "element2",
    icon: "logos:element",
    iconColor: "#409eff",
    prefix: "https://element.eleme.cn/#/zh-CN/component/",
    suffix: "",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "element3",
    icon: "logos:element",
    iconColor: "#409eff",
    prefix: "https://element-plus.org/zh-CN/component/",
    suffix: ".html",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "antdV",
    icon: "devicon:antdesign",
    iconColor: "#1677ff",
    prefix: "https://www.antdv.com/components/",
    suffix: "-cn",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "antdR",
    icon: "devicon:antdesign",
    iconColor: "#1677ff",
    prefix: "https://ant.design/components/",
    suffix: "-cn",
    category: "dev"
  },
  {
    id: getUUID(),
    alias: "iconify",
    icon: "simple-icons:iconify",
    iconColor: "#8e44ad", // Iconify紫
    prefix: "https://icon-sets.iconify.design/?query=",
    suffix: "",
    category: "design"
  }
]

/**
 * @constant 预设的一些图标
 */
export const presetIcons: string[] = [
  // 可爱/有趣
  "mdi:robot-outline",
  "ph:ghost",
  "mdi:space-station",
  "ph:skull",
  "mdi:gamepad-variant-outline",
  "ph:cactus",
  "mdi:cookie",
  "ph:coffee",
  "mdi:star-four-points",
  "ph:sunglasses",
  "mdi:dog",
  "ph:pizza",
  "ph:cat",
  "ph:dog",
  "ph:bird",
  "ph:fish",
  "ph:butterfly",
  "ph:rainbow",
  "ph:cloud",
  "ph:cloud-rain",
  "ph:cloud-lightning",
  "ph:cloud-snow",
  "ph:cloud-fog",
  "ph:sun",
  "ph:moon",
  "ph:star",
  "ph:star-half",
  "ph:star-four",
  "ph:heart",
  "ph:heart-break",
  "ph:heart-straight",
  "ph:heart-straight-break",
  "ph:heartbeat",
  "ph:sparkle",
  "ph:fire",
  "ph:fire-simple",
  "ph:flame",
  "ph:lightning",
  "ph:lightning-slash",

  // 社交媒体
  "ri:baidu-fill",
  "devicon:google",
  "logos:facebook",
  "logos:twitter",
  "logos:youtube-icon",
  "logos:gitlab",
  "logos:slack-icon",
  "logos:discord-icon",
  "logos:twitch",
  "logos:reddit-icon",
  "logos:spotify-icon",
  "logos:apple-app-store",
  "logos:figma",
  "logos:dribbble-icon",
  "logos:behance",
  "logos:linkedin-icon",
  "logos:medium-icon",
  "logos:hashnode-icon",
  "logos:codepen-icon",
  "logos:codesandbox-icon",
  "logos:stackblitz-icon",

  // 开发工具
  "logos:docker-icon",
  "logos:kubernetes",
  "logos:nodejs-icon",
  "logos:python",
  "logos:java",
  "logos:javascript",
  "logos:typescript-icon",
  "logos:react",
  "logos:angular-icon",
  "logos:vue",
  "logos:html-5",
  "logos:css-3",
  "logos:sass",
  "logos:less",
  "logos:webpack",
  "logos:babel",
  "logos:eslint",
  "logos:prettier",
  "logos:npm-icon",
  "logos:yarn",
  "logos:pnpm",
  "logos:vitejs",
  "logos:nestjs",
  "logos:strapi-icon",
  "logos:graphql",
  "logos:redux",
  "logos:tailwindcss-icon",
  "logos:bootstrap",
  "logos:material-ui",
  "logos:ant-design",

  // 协作工具
  "logos:jira",
  "logos:confluence",
  "logos:trello",
  "logos:notion-icon",
  "logos:slack",
  "logos:microsoft-teams",
  "logos:zoom",
  "logos:google-meet",
  "logos:google-drive",
  "logos:dropbox",

  // 设计工具
  "logos:adobe-photoshop",
  "logos:adobe-illustrator",
  "logos:adobe-xd",
  "logos:sketch",
  "logos:invision-icon",
  "logos:zeplin",
  "logos:framer",
  "logos:miro",
  "logos:asana",
  "logos:linear",

  // 监控工具
  "logos:sentry-icon",
  "logos:datadog",
  "logos:new-relic",
  "logos:grafana",
  "logos:prometheus",
  "logos:splunk",

  // 云服务
  "logos:aws",
  "logos:azure",
  "logos:google-cloud",
  "logos:digital-ocean-icon",
  "logos:linode",
  "logos:vultr",
  "logos:heroku-icon",
  "logos:netlify",
  "logos:vercel",
  "logos:cloudflare-icon",

  // 支付/区块链
  "logos:paypal",
  "logos:ethereum",
  "logos:web3js",
  "logos:ethers",
  "logos:solidity",
  "logos:rust",
  "logos:go",
  "logos:kotlin",
  "logos:swift",
  "logos:dart",
  "logos:flutter",
  "logos:electron",
  "logos:qt",

  // 游戏/3D
  "logos:unity",
  "logos:godot",
  "logos:blender",
  "logos:adobe-after-effects",
  "logos:adobe-premiere",
  "logos:obsidian",
  "logos:github-copilot",
  "logos:jupyter",
  "logos:tensorflow",
  "logos:pytorch",
  "logos:pandas",
  "logos:numpy",
  "logos:matplotlib-icon",
  "logos:seaborn",
  "logos:chartjs",
  "logos:threejs",
  "logos:p5js",
  "logos:processing",
  "logos:arduino",
  "logos:raspberry-pi",
  "logos:ros"
]

/**
 * @constant 功能菜单配置
 */
export const menuList: TYPE.FunctionMenu[] = [
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
    title: "DeleteShortcut",
    icon: Trash2,
    description: "删除预设",
    event: () => {
      sendMessage({
        type: MODEL_TYPE.deleteShortcut,
        origin: "popup",
        chrome
      })
    }
  }
]
