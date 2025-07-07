/**
 * @enum model 弹窗类型
 */
export const MODEL_TYPE = {
  addNewShortcut: "addNewShortcut", // 新增快捷方式
  setting: "setting", // 设置
  deleteShortcut: "deleteShortcut", // 删除快捷方式
  functionArea: "functionArea", // 功能区
  bookmarkSearch: "bookmarkSearch", // 书签搜索弹窗
  sidePanel: "sidePanel", // 侧边栏
  salaryCalculation: "salaryCalculation" // 工资计算设置
}

/**
 * @enum 发送信息来源
 */
export const SEND_FROM = {
  content: "content", // 内容区
  popup: "popup", // 弹窗区
  background: "background", // 后台
  sidebar: "sidebar" // 侧边栏
}

/**
 * @enum 一些消息类型
 */
export const MESSAGE_TYPE = {
  getBookmarks: "getBookmarks" // 获取书签
}

/**
 * @enum 快捷键类型
 */
export const SHORTCUT_TYPE = {
  openPopup: "openPopup", // 打开弹窗
  openFunctionArea: "openFunctionArea", // 打开功能区
  openBookmarkSearch: "openBookmarkSearch", // 打开书签搜索
  openSidePanel: "openSidePanel" // 打开侧边栏
}

/**
 * @enum 本地保存的key
 */
export const LOCAL_KEY = {
  salaryConfig: "salaryConfig", // 工资计算配置
  shortcutsSearch: "shortcutsSearch", // 快捷方式搜索
  searchTarget: "searchTarget", // 搜索目标
  activeCategory: "activeCategory", // 激活分类
  categoryChange: "categoryChange" // 分类改变
}
