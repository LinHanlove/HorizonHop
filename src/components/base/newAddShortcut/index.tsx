import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '~components/ui/input'
import { cn } from '~utils/shadcn'
import { useNewAddShortcut } from '~hooks'
import { SHORTCUT_TYPE_MAP } from './config'
import '../../../style'


export default function NewAddShortcut({...props}) {
  const {open,setOpen} = props
  const {
    newShortcut,
    setNewShortcut,
    onSubmitNewShortcut
  } = useNewAddShortcut()
  return (
    <>
      <Dialog open={open} onOpenChange={()=>setOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-center">
                <h2 className="text-xl font-bold text-slate-800">添加快捷方式</h2>
              </div>
            </DialogTitle>
            <DialogDescription>
              <p className='text-sm text-slate-500'>可添加url地址栏通过拼接参数来搜索的网址 示例：</p>
              <p className='text-sm text-slate-500 mt-1 p-1 bg-slate-100 rounded-[6px]'>https://github.com/search?q=搜索值&type=repositories</p>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">名称</label>
              <Input
                placeholder="输入名称"
                value={newShortcut.alias}
                onChange={(e) => setNewShortcut({ ...newShortcut, alias: e.target.value })}
                className="h-8 rounded-lg border-slate-200 bg-white/80 focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">前缀</label>
              <Input
                placeholder="https://..."
                value={newShortcut.prefix}
                onChange={(e) => setNewShortcut({ ...newShortcut, prefix: e.target.value })}
                className="h-8 rounded-lg border-slate-200 bg-white/80 focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">后缀</label>
              <Input
                placeholder="...,没有可不填"
                value={newShortcut.suffix}
                onChange={(e) => setNewShortcut({ ...newShortcut, suffix: e.target.value })}
                className="h-8 rounded-lg border-slate-200 bg-white/80 focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">图标</label>
              <div className="grid grid-cols-8 gap-2">
                {[
                  "🔗",
                  "🌐",
                  "📝",
                  "📊",
                  "🔍",
                  "📦",
                  "🐙",
                  "💻",
                  "🎨",
                  "💎",
                  "📱",
                  "🔄",
                  "🖼️",
                  "{ }",
                  "🗜️",
                  "👨‍💻",
                ].map((icon) => (
                  <button
                    key={icon}
                    className={cn(
                      "flex items-center justify-center h-10 rounded-lg transition-all",
                      newShortcut.icon === icon
                        ? "bg-slate-800 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    )}
                    onClick={() => setNewShortcut({ ...newShortcut, icon })}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">分类</label>
              <div className="grid grid-cols-3 gap-2">
                {SHORTCUT_TYPE_MAP.map(({value,label}) => (
                  <button
                    key={value}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                      newShortcut.category === value
                        ? "bg-slate-800 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    )}
                    onClick={() => setNewShortcut({ ...newShortcut, category: value})}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={()=>onSubmitNewShortcut(newShortcut)}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
