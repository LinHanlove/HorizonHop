import { getLocal } from "@/utils/chrome.tools"
import { Settings } from "lucide-react"
import React, { useEffect, useState } from "react"

import { Button } from "~components/ui/button"
import { CONFIG, LOCAL_KEY, MODEL_TYPE, SEND_FROM } from "~constants"
import { sendMessage } from "~utils"

import "~assets/style/tailwind.css"

const defaultSalaryConfig: TYPE.SalaryConfig = {
  monthSalary: 8000,
  workStart: "09:00",
  workEnd: "18:00",
  restType: "double",
  overtime: false,
  overtimeHours: 0
}

/**
 * @function 计算本月所有工作日（返回日期字符串数组）
 * @param restType 休息类型
 * @returns
 */
const getWorkDaysOfMonth = (
  restType: TYPE.SalaryConfig["restType"]
): string[] => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  const workDays: string[] = []
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d)
    const day = date.getDay()
    if (restType === "double") {
      if (day !== 0 && day !== 6) workDays.push(date.toISOString().slice(0, 10))
    } else if (restType === "single") {
      if (day !== 0) workDays.push(date.toISOString().slice(0, 10))
    } else if (restType === "alt") {
      // 简单单双休轮流，偶数周日休息
      const week = Math.floor((d + new Date(year, month, 1).getDay() - 1) / 7)
      if (
        (week % 2 === 0 && day !== 0 && day !== 6) ||
        (week % 2 === 1 && day !== 0)
      )
        workDays.push(date.toISOString().slice(0, 10))
    }
  }
  return workDays
}

/**
 * @function 计算今日已上班秒数
 * @param workStart 上班时间
 * @param workEnd 下班时间
 * @param overtime 是否加班
 * @param overtimeHours 加班小时数
 * @returns
 */
const getTodayWorkedSeconds = (
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) => {
  const now = new Date()
  const startArr = workStart.split(":").map(Number)
  const endArr = workEnd.split(":").map(Number)
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    startArr[0],
    startArr[1] || 0,
    0
  )
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    endArr[0],
    endArr[1] || 0,
    0
  )
  if (overtime) end.setMinutes(end.getMinutes() + overtimeHours * 60)
  if (now < start) return 0
  if (now > end) return (end.getTime() - start.getTime()) / 1000
  return (now.getTime() - start.getTime()) / 1000
}

/**
 * @function 计算总上班秒数
 * @param workStart 上班时间
 * @param workEnd 下班时间
 * @param overtime
 * @param overtimeHours
 * @returns
 */
const getTotalWorkSeconds = (
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) => {
  const startArr = workStart.split(":").map(Number)
  const endArr = workEnd.split(":").map(Number)
  const start = new Date(2000, 0, 1, startArr[0], startArr[1] || 0, 0)
  const end = new Date(2000, 0, 1, endArr[0], endArr[1] || 0, 0)
  if (overtime) end.setMinutes(end.getMinutes() + overtimeHours * 60)
  return (end.getTime() - start.getTime()) / 1000
}

const SidePanel = () => {
  // 工资参数
  const [salaryConfig, setSalaryConfig] =
    useState<TYPE.SalaryConfig>(defaultSalaryConfig)
  // 本月工作日
  const [workDaysArr, setWorkDaysArr] = useState<string[]>([])
  // 日工资
  const [daySalary, setDaySalary] = useState<string>("-")
  // 月累计工资
  const [monthAccum, setMonthAccum] = useState<string>("-")
  // 实时薪资
  const [realtimeSalary, setRealtimeSalary] = useState<string>("-")
  // 每日一句
  const [quote, setQuote] = useState({ hitokoto: "加载中...", from: "" })

  // 读取工资配置
  useEffect(() => {
    getLocal({ key: LOCAL_KEY.salaryConfig, chrome })
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSalaryConfig(data)
        }
      })
      .catch(() => {})
  }, [])

  // 计算本月工作日、日工资、月累计工资
  useEffect(() => {
    const arr = getWorkDaysOfMonth(salaryConfig.restType)
    setWorkDaysArr(arr)
    const daySalaryNum =
      arr.length > 0 ? salaryConfig.monthSalary / arr.length : 0
    setDaySalary(daySalaryNum > 0 ? daySalaryNum.toFixed(2) : "-")
    // 月累计工资 = 今天之前的工作日数量 * 日工资
    const todayStr = new Date().toISOString().slice(0, 10)
    const daysBeforeToday = arr.filter((d) => d <= todayStr).length
    setMonthAccum(
      daySalaryNum > 0 ? (daySalaryNum * daysBeforeToday).toFixed(2) : "-"
    )
  }, [salaryConfig])

  // 实时薪资定时刷新（每秒）
  useEffect(() => {
    function updateRealtime() {
      const arr = getWorkDaysOfMonth(salaryConfig.restType)
      const todayStr = new Date().toISOString().slice(0, 10)
      if (!arr.includes(todayStr)) {
        setRealtimeSalary("-")
        return
      }
      const daySalaryNum =
        arr.length > 0 ? salaryConfig.monthSalary / arr.length : 0
      const worked = getTodayWorkedSeconds(
        salaryConfig.workStart,
        salaryConfig.workEnd,
        salaryConfig.overtime,
        salaryConfig.overtimeHours
      )
      const total = getTotalWorkSeconds(
        salaryConfig.workStart,
        salaryConfig.workEnd,
        salaryConfig.overtime,
        salaryConfig.overtimeHours
      )
      const percent = total > 0 ? Math.min(worked / total, 1) : 0
      setRealtimeSalary(
        daySalaryNum > 0 ? (daySalaryNum * percent).toFixed(2) : "-"
      )
    }
    updateRealtime()
    const timer = setInterval(updateRealtime, 1000)
    return () => clearInterval(timer)
  }, [salaryConfig])

  // 自动每2分钟刷新一言，失败兜底网易云热评
  const fetchQuote = async () => {
    try {
      const res = await fetch("https://v1.hitokoto.cn/?encode=json")
      const data = await res.json()
      if (data && data.hitokoto) {
        setQuote({ hitokoto: data.hitokoto, from: data.from })
        return
      }
      throw new Error("hitokoto empty")
    } catch {
      // 兜底网易云热评
      try {
        const res2 = await fetch("https://free.wqwlkj.cn/wqwlapi/wyy_rp.php")
        const data2 = await res2.json()
        if (data2 && data2.code === 1 && data2.comment) {
          setQuote({ hitokoto: data2.comment, from: data2.sing })
          return
        }
      } catch {}
      setQuote({ hitokoto: "获取失败，请稍后重试。", from: "" })
    }
  }

  useEffect(() => {
    fetchQuote()
    const timer = setInterval(fetchQuote, 2 * 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  // 发送设置消息（可用于弹出设置弹窗）
  const onSalaryCalculationSetting = () => {
    sendMessage({
      type: MODEL_TYPE.salaryCalculation,
      origin: SEND_FROM.sidebar,
      chrome
    })
  }

  return (
    <div className="lh-min-h-screen lh-bg-slate-50 lh-flex lh-flex-col lh-items-stretch lh-justify-between lh-px-4 lh-py-8">
      {/* 顶部：标题+设置按钮 */}
      <div className="lh-w-full lh-max-w-[420px] lh-mx-auto lh-mb-2">
        <div className="lh-flex lh-items-center lh-justify-between">
          <h1 className="lh-text-lg lh-font-extrabold lh-text-slate-800 lh-tracking-tight">
            {CONFIG.name}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lh-w-8 lh-h-8 lh-rounded-full lh-bg-white lh-shadow-md hover:lh-scale-110 hover:lh-shadow-lg lh-transition-all lh-text-slate-400 hover:lh-text-slate-700"
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

      {/* 每日一句 居中显示，无刷新按钮 */}
      <div className="lh-w-full lh-max-w-[420px] lh-mx-auto lh-mb-6 lh-text-center">
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
      <div className="lh-w-full lh-max-w-[420px] lh-mx-auto lh-mb-6 lh-flex lh-justify-center">
        <img
          src={require("@/assets/image/sidebar_img.jpeg")}
          alt="sidebar_img"
          className="lh-w-full lh-max-w-[320px] lh-rounded-2xl lh-shadow-lg lh-object-cover lh-bg-slate-200"
          style={{ aspectRatio: "4/3" }}
        />
      </div>
      {/* E 图片区域 */}

      {/* 底部：工资区块 + 计算说明 */}
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
                {daySalary}
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
                {monthAccum}
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
            <span className="lh-text-2xl lh-font-extrabold lh-text-teal-600 animate-pulse">
              {realtimeSalary}
              <span className="lh-text-xs lh-font-medium lh-text-teal-400">
                元
              </span>
            </span>
          </div>
        </div>
        {/* 工资计算逻辑说明 */}
        <div className="lh-bg-slate-100 lh-rounded-xl lh-px-3 lh-py-2 lh-text-xs lh-text-slate-500 lh-leading-relaxed lh-select-text">
          工资计算规则：日工资 = 月薪 ÷
          工作日天数（支持单双休、单双休轮），月累计 =
          本月1号至今日的工作日累计，实时薪资 = 今日工资 ×（已上班时长 ÷
          总时长），自动按设定时间和加班计算。
        </div>
      </div>
    </div>
  )
}

export default SidePanel
