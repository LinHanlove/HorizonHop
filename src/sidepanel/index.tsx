import { useSalaryCalculation } from "@/hooks/modules/salaryCalculation"
import { Settings } from "lucide-react"
import React from "react"

import { Button } from "~components/ui/button"
import { Progress } from "~components/ui/progress"
import { CONFIG } from "~constants"

import "~assets/style/tailwind.css"

const SidePanel = () => {
  const {
    todayProgress,
    monthProgress,
    todaySalary,
    monthAccum,
    salaryConfig,
    daySalary,
    quote,
    onSalaryCalculationSetting,
    todayWorkedSeconds,
    totalWorkSeconds,
    daysBeforeToday,
    totalWorkDays
  } = useSalaryCalculation()

  // 格式化秒为小时（保留1位小数）
  const formatHour = (seconds: number) => (seconds / 3600).toFixed(1)

  return (
    <div className="lh-h-full lh-min-h-screen lh-flex lh-flex-col lh-bg-slate-50 lh-px-4 lh-py-2">
      {/* 顶部：标题+设置按钮 */}
      <div className="lh-w-full lh-max-w-[420px] lh-mx-auto lh-mb-2">
        <div className="lh-flex lh-items-center lh-justify-between">
          <h1 className="lh-text-lg lh-font-extrabold lh-text-slate-800 lh-tracking-tight">
            {CONFIG.name}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lh-w-8 lh-h-8 lh-rounded-full lh-shadow-md hover:lh-scale-110 hover:lh-shadow-lg lh-transition-all lh-text-slate-400 hover:lh-text-slate-700"
            onClick={onSalaryCalculationSetting}
            style={{ boxShadow: "none" }}>
            <Settings className="lh-w-4 lh-h-4" />
          </Button>
        </div>
        {/* 设置提示 */}
        <div className="lh-mt-1 lh-text-xs lh-text-slate-500 lh-pl-1">
          可点击右上角设置你的工资参数
        </div>
      </div>

      {/* 中间内容区：每日一句+图片 居中自适应 */}
      <div className="lh-flex-1 lh-flex lh-flex-col lh-items-center lh-justify-center lh-w-full lh-max-w-[420px] lh-mx-auto">
        {/* 每日一句 居中显示，无刷新按钮 */}
        <div className="lh-w-full lh-mb-4 lh-text-center lh-max-h-24 lh-overflow-auto lh-break-words">
          <span className="lh-text-base lh-text-slate-500 lh-italic lh-leading-relaxed lh-select-text">
            “{quote.hitokoto}”
          </span>
          {quote.from && (
            <span className="lh-text-xs lh-text-slate-400 lh-ml-2">
              —— {quote.from}
            </span>
          )}
        </div>
        {/* S 图片区域 */}
        <div className="lh-w-full lh-mb-6 lh-flex lh-justify-center">
          <img
            src={require("@/assets/image/sidebar_img.jpeg")}
            alt="sidebar_img"
            className="lh-w-full lh-max-w-[320px] lh-rounded-2xl lh-shadow-lg lh-object-cover lh-bg-slate-200"
            style={{ aspectRatio: "4/3" }}
          />
        </div>
        {/* E 图片区域 */}
      </div>

      {/* 底部：工资区块 + 计算说明，始终贴底 */}
      <div className="lh-w-full lh-max-w-[420px] lh-mx-auto lh-mt-auto lh-flex lh-flex-col lh-gap-4 lh-mb-0">
        {/* 工资展示区 */}
        <div className="lh-flex lh-flex-row lh-justify-between lh-gap-2 lh-mb-2">
          {/* 月工资 */}
          <div className="lh-flex-1 lh-flex lh-flex-col lh-items-center">
            <div className="lh-text-xs lh-text-slate-500">月工资</div>
            <div className="lh-flex lh-flex-col lh-items-center lh-mt-1">
              <span className="lh-text-base lh-font-extrabold lh-text-slate-900">
                {salaryConfig.monthSalary}
              </span>
              <span className="lh-text-xs lh-font-medium lh-text-slate-400">
                元
              </span>
            </div>
          </div>
          {/* 日工资 */}
          <div className="lh-flex-1 lh-flex lh-flex-col lh-items-center">
            <div className="lh-text-xs lh-text-slate-500">日工资</div>
            <div className="lh-flex lh-flex-col lh-items-center lh-mt-1">
              <span className="lh-text-base lh-font-extrabold lh-text-slate-900">
                {daySalary.toFixed(2)}
              </span>
              <span className="lh-text-xs lh-font-medium lh-text-slate-400">
                元
              </span>
            </div>
          </div>
          {/* 月累计工资 */}
          <div className="lh-flex-1 lh-flex lh-flex-col lh-items-center">
            <div className="lh-text-xs lh-text-slate-500">月累计</div>
            <div className="lh-flex lh-flex-col lh-items-center lh-mt-1">
              <span className="lh-text-base lh-font-extrabold lh-text-slate-900">
                {monthAccum.toFixed(2)}
              </span>
              <span className="lh-text-xs lh-font-medium lh-text-slate-400">
                元
              </span>
            </div>
          </div>
        </div>
        <div className="lh-flex lh-flex-col lh-items-center lh-mb-2">
          <div className="lh-text-xs lh-text-teal-600">实时</div>
          <div className="lh-flex lh-flex-col lh-items-center lh-mt-1">
            <span
              className={`lh-text-2xl lh-font-extrabold lh-text-teal-600 ${
                todaySalary === 0 ? "lh-opacity-50" : "animate-pulse"
              }`}>
              {todaySalary.toFixed(2)}
              <span className="lh-text-xs lh-font-medium lh-text-teal-400">
                元
              </span>
            </span>
          </div>
        </div>
        {/* 工资计算逻辑说明 */}
        <div className="lh-bg-slate-100 lh-rounded-xl lh-px-3 lh-py-1 lh-text-xs lh-text-slate-500 lh-leading-relaxed lh-select-text">
          工资计算规则：日工资 = 月薪 ÷
          工作日天数（支持单双休、单双休轮），月累计 =
          本月1号至今日的工作日累计，实时薪资 = 今日工资 ×（已上班时长 ÷
          总时长），自动按设定时间和加班计算。
        </div>
        {/* 今日工资进度条 */}
        <div className="lh-mt-2">
          <div className="lh-flex lh-justify-between lh-text-xs lh-mb-1">
            <span>今日工资进度</span>
            <span>{(todayProgress * 100).toFixed(1)}%</span>
          </div>
          <Progress value={todayProgress * 100} />
          <div className="lh-text-xs lh-text-slate-400 lh-mt-1 lh-text-right">
            {formatHour(todayWorkedSeconds)}/{formatHour(totalWorkSeconds)}小时
          </div>
        </div>
        {/* 本月工资进度条 */}
        <div className="lh-mt-2">
          <div className="lh-flex lh-justify-between lh-text-xs lh-mb-1">
            <span>本月工资进度</span>
            <span>{(monthProgress * 100).toFixed(1)}%</span>
          </div>
          <Progress value={monthProgress * 100} />
          <div className="lh-text-xs lh-text-slate-400 lh-mt-1 lh-text-right">
            {daysBeforeToday}/{totalWorkDays}天
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidePanel
