import { Search, Settings } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~components/ui/button'
import { Input } from '~components/ui/input'
import { CONFIG, POPUP_TYPE } from '~constants'
import { sendMessage } from '~utils'

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
    <div className="relative bg-white/95 backdrop-blur-sm border-b border-slate-200/60">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/3 via-gray-600/3 to-slate-600/3"></div>
      <div className="relative z-10 px-2 py-4">
        {/* S 名称 */}
        <div className="flex items-center justify-between">
          <h1 className="flex-1 text-2xl text-center font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800">
            {CONFIG.name}
          </h1>
          {/* S 设置 */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/80"
            onClick={openSetting}
          >
            <Settings className="w-4 h-4" />
          </Button>
          {/* E 设置 */}

        </div>
        {/* E 名称 */}


        {/* S 搜索框 */}
        <div className="mt-2">
          <div className='flex items-center'>
            <Input
              id="search-input"
              placeholder="输入内容，按下回车搜索..."
              className="w-full h-8 pr-4 text-sm rounded-lg border-0 bg-white/80 backdrop-blur-sm shadow-sm shadow-slate-500/5 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus-visible:ring-1 focus:border-2 focus:ring-slate-400/30 focus:bg-white/95 transition-all"
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
