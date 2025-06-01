import Dialog, {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react"
import React, { useState } from "react"

import { CONFIG } from "~constants"
import { useSetting } from "~hooks"

export default function Setting({ ...props }) {
  console.log("设置弹窗", props)

  const { open, setOpen } = props

  const { switchConfigMap, exportData } = useSetting()

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="lh-w-[420px] lh-flex lh-flex-col lh-max-h-[60vh] lh-backdrop-blur-sm lh-hide-scrollbar">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>
        <DialogDescription>自定义设置以适应你的工作流程。</DialogDescription>
        <div className="lh-space-y-6 lh-overflow-y-auto lh-py-4 lh-pr-2 lh-flex-1">
          {switchConfigMap.map((item) => {
            return (
              <div key={item.title}>
                <h3 className="lh-text-lg lh-font-medium lh-text-slate-800 lh-mb-4">
                  {item.title}
                </h3>
                <div className="lh-space-y-4">
                  {item.items.map((item) => {
                    return (
                      <div
                        key={item.title}
                        className="lh-flex lh-items-center lh-justify-between">
                        <div>
                          <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                            {item.title}
                          </span>
                          <p className="lh-text-xs lh-text-slate-500 lh-mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          checked={item.checked}
                          onCheckedChange={item.onChange}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div>
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-800 lh-mb-4">
              数据
            </h3>
            <div className="lh-space-y-3">
              <button
                onClick={exportData}
                className="lh-flex lh-items-center lh-justify-between lh-w-full lh-px-4 lh-py-3 lh-rounded-lg lh-bg-slate-50 hover:lh-bg-slate-100 lh-text-left lh-transition-colors">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  导出数据
                </span>
                <ChevronRight className="lh-h-4 lh-w-4 lh-text-slate-400" />
              </button>
              {/* <button className="lh-flex lh-items-center lh-justify-between lh-w-full lh-px-4 lh-py-3 lh-rounded-lg lh-bg-slate-50 hover:lh-bg-slate-100 lh-text-left lh-transition-colors">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  导入数据
                </span>
                <ChevronRight className="lh-h-4 lh-w-4 lh-text-slate-400" />
              </button> */}
            </div>
          </div>

          <div>
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-800 lh-mb-4">
              关于
            </h3>
            <div className="lh-w-[86%] lh-m-auto lh-bg-gradient-to-br lh-from-slate-50 lh-to-slate-100 lh-rounded-xl lh-p-4 lh-border lh-border-slate-200">
              <div className="lh-flex lh-items-center lh-justify-center lh-mb-4">
                <div className="lh-w-16 lh-h-16 lh-rounded-xl lh-bg-slate-800 lh-flex lh-items-center lh-justify-center lh-text-white lh-text-3xl lh-shadow-lg">
                  🍯
                </div>
              </div>
              <div className="lh-text-center lh-space-y-2">
                <p className="lh-font-medium lh-text-lg lh-text-slate-800">
                  {CONFIG.name}
                </p>
                <p className="lh-text-slate-600">版本 {CONFIG.version}</p>
                <div className="lh-w-16 lh-h-0.5 lh-bg-slate-800 lh-mx-auto lh-my-4"></div>
                <p className="lh-text-slate-500 lh-text-sm lh-flex lh-items-center lh-justify-center">
                  © 2025 {CONFIG.author}
                  <a
                    className="lh-text-slate-600 lh-font-medium lh-underline lh-pl-2"
                    href="https://github.com/LinHanPro/lin-han-pro"
                    target="_blank">
                    使用教程
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lh-pt-4 lh-border-t lh-border-slate-200">
          <Button
            className="lh-w-full lh-h-12 lh-rounded-xl lh-bg-slate-800 hover:lh-bg-slate-900 lh-text-white lh-shadow-lg lh-transition-all"
            onClick={() => setOpen(false)}>
            完成
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
