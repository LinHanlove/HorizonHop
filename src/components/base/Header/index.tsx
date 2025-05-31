import { Search, Settings } from "lucide-react"
import React, { useState } from "react"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { CONFIG, POPUP_TYPE } from "~constants"
import { sendMessage } from "~utils"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * @function 添加快捷方式
   */
  const openSetting = () => {
    sendMessage({
      type: POPUP_TYPE.setting,
      origin: "popup",
      chrome
    })
  }

  return (
    <div className="lh-relative lh-bg-white/95 lh-backdrop-blur-sm lh-border-b lh-border-slate-200/60">
      {/* 背景 */}
      <div className="lh-absolute lh-inset-0 lh-bg-gradient-to-r lh-from-slate-600/3 lh-via-gray-600/3 lh-to-slate-600/3"></div>
      <div className="lh-relative lh-z-10 lh-px-2 lh-py-4">
        {/* S 名称 */}
        <div className="lh-flex lh-items-center lh-justify-between">
          <h1 className="lh-flex-1 lh-text-2xl lh-text-center lh-font-bold lh-tracking-tight lh-text-transparent lh-bg-clip-text lh-bg-gradient-to-r lh-from-slate-700 lh-via-gray-700 lh-to-slate-800">
            {CONFIG.name}
          </h1>
          {/* S 设置 */}
          <Button
            variant="ghost"
            size="icon"
            className="lh-w-8 lh-h-8 lh-rounded-lg lh-text-slate-500 hover:lh-text-slate-700 hover:lh-bg-slate-100/80"
            onClick={openSetting}>
            <Settings className="lh-w-4 lh-h-4" />
          </Button>
          {/* E 设置 */}
        </div>
        {/* E 名称 */}

        {/* S 搜索框 */}
        <div className="lh-mt-2">
          <div className="lh-flex lh-items-center">
            <Input
              id="search-input"
              placeholder="输入内容，按下回车搜索..."
              className="lh-w-full lh-h-8 lh-px-4 lh-text-sm lh-rounded-lg lh-border-0 lh-bg-white/80 lh-backdrop-blur-sm lh-shadow-sm lh-shadow-slate-500/5 lh-text-slate-700 placeholder:lh-text-slate-400 focus:lh-ring-2 focus-visible:lh-ring-1 focus:lh-border-2 focus:lh-ring-slate-400/30 focus:lh-bg-white/95 lh-transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* E 搜索框 */}
      </div>
    </div>
  )
}
