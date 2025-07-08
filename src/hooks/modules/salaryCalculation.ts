import { getLocal, setLocal } from "@/utils/chrome.tools"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

import { LOCAL_KEY, MODEL_TYPE, SEND_FROM } from "~constants"
import { sendMessage } from "~utils"

/**
 * 默认工资配置
 */
export const defaultSalaryConfig: TYPE.SalaryConfig = {
  workStart: "09:00",
  workEnd: "18:00",
  monthSalary: 8000,
  restType: "double", // double:双休, single:单休, alt:单双休轮
  overtime: false,
  overtimeHours: 0
}

/**
 * 工资配置读取/保存 hook
 * @param open 是否自动读取配置
 * @returns { config, setConfig, saveConfig, loading }
 */
export function useSalaryConfig(open?: boolean) {
  const [config, setConfig] = useState<TYPE.SalaryConfig>(defaultSalaryConfig)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open === undefined || open) {
      setLoading(true)
      getLocal({ key: LOCAL_KEY.salaryConfig, chrome })
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setConfig(data)
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [open])

  /**
   * 保存工资配置
   * @param newConfig 新配置
   */
  const saveConfig = async (newConfig: TYPE.SalaryConfig) => {
    setConfig(newConfig)
    await setLocal({
      key: LOCAL_KEY.salaryConfig,
      value: JSON.stringify(newConfig),
      chrome
    })
  }

  return { config, setConfig, saveConfig, loading }
}

/**
 * 工资计算核心hook，统一输出所有工资相关数据
 * @returns 工资相关数据和操作
 */
export function useSalaryCalculation() {
  const {
    config: salaryConfig,
    setConfig,
    saveConfig,
    loading
  } = useSalaryConfig()
  const [todayProgress, setTodayProgress] = useState(0)
  const [monthProgress, setMonthProgress] = useState(0)
  const [todaySalary, setTodaySalary] = useState(0)
  const [monthAccum, setMonthAccum] = useState(0)
  const [workDaysArr, setWorkDaysArr] = useState<string[]>([])
  const [daySalary, setDaySalary] = useState(0)
  const [todayWorkedSeconds, setTodayWorkedSeconds] = useState(0)
  const [totalWorkSeconds, setTotalWorkSeconds] = useState(0)
  const [daysBeforeToday, setDaysBeforeToday] = useState(0)
  const [totalWorkDays, setTotalWorkDays] = useState(0)
  // 一言/网易云热评
  const [quote, setQuote] = useState({ hitokoto: "加载中...", from: "" })

  /**
   * 获取一言/网易云热评
   */
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
        const res = await fetch("https://free.wqwlkj.cn/wqwlapi/wyy_rp.php")
        const neteaseCommentData = await res.json()
        if (
          neteaseCommentData &&
          neteaseCommentData.code === 1 &&
          neteaseCommentData.comment
        ) {
          setQuote({
            hitokoto: neteaseCommentData.comment,
            from: neteaseCommentData.sing
          })
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

  /**
   * 设置按钮处理
   */
  const onSalaryCalculationSetting = () => {
    sendMessage({
      type: MODEL_TYPE.salaryCalculation,
      origin: SEND_FROM.sidebar,
      chrome
    })
  }

  useEffect(() => {
    if (!salaryConfig) return
    const arr = getWorkDaysOfMonth(salaryConfig.restType)
    setWorkDaysArr(arr)
    setTotalWorkDays(arr.length)
    const daySalaryNum =
      arr.length > 0 ? salaryConfig.monthSalary / arr.length : 0
    setDaySalary(daySalaryNum)
    const worked = getTodayWorkedSeconds(
      salaryConfig.workStart,
      salaryConfig.workEnd,
      salaryConfig.overtime,
      salaryConfig.overtimeHours
    )
    setTodayWorkedSeconds(worked)
    const total = getTotalWorkSeconds(
      salaryConfig.workStart,
      salaryConfig.workEnd,
      salaryConfig.overtime,
      salaryConfig.overtimeHours
    )
    setTotalWorkSeconds(total)
    const todayProgressVal = total > 0 ? Math.min(worked / total, 1) : 0
    setTodayProgress(todayProgressVal)
    const todayStr = dayjs().format("YYYY-MM-DD")
    const daysBefore = arr.filter((d) =>
      dayjs(d).isBefore(dayjs(todayStr))
    ).length
    setDaysBeforeToday(daysBefore)
    const monthProgressVal =
      arr.length > 0 ? (daysBefore + todayProgressVal) / arr.length : 0
    setMonthProgress(monthProgressVal)
    setTodaySalary(daySalaryNum * todayProgressVal)
    setMonthAccum(daySalaryNum * (daysBefore + todayProgressVal))
  }, [salaryConfig])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!salaryConfig) return
      const arr = getWorkDaysOfMonth(salaryConfig.restType)
      setWorkDaysArr(arr)
      setTotalWorkDays(arr.length)
      const daySalaryNum =
        arr.length > 0 ? salaryConfig.monthSalary / arr.length : 0
      setDaySalary(daySalaryNum)
      const worked = getTodayWorkedSeconds(
        salaryConfig.workStart,
        salaryConfig.workEnd,
        salaryConfig.overtime,
        salaryConfig.overtimeHours
      )
      setTodayWorkedSeconds(worked)
      const total = getTotalWorkSeconds(
        salaryConfig.workStart,
        salaryConfig.workEnd,
        salaryConfig.overtime,
        salaryConfig.overtimeHours
      )
      setTotalWorkSeconds(total)
      const todayProgressVal = total > 0 ? Math.min(worked / total, 1) : 0
      setTodayProgress(todayProgressVal)
      const todayStr = dayjs().format("YYYY-MM-DD")
      const daysBefore = arr.filter((d) =>
        dayjs(d).isBefore(dayjs(todayStr))
      ).length
      setDaysBeforeToday(daysBefore)
      const monthProgressVal =
        arr.length > 0 ? (daysBefore + todayProgressVal) / arr.length : 0
      setMonthProgress(monthProgressVal)
      setTodaySalary(daySalaryNum * todayProgressVal)
      setMonthAccum(daySalaryNum * (daysBefore + todayProgressVal))
    }, 1000)
    return () => clearInterval(timer)
  }, [salaryConfig])

  return {
    todayProgress,
    monthProgress,
    todaySalary,
    monthAccum,
    salaryConfig,
    setConfig,
    saveConfig,
    loading,
    workDaysArr,
    daySalary,
    quote,
    onSalaryCalculationSetting,
    todayWorkedSeconds,
    totalWorkSeconds,
    daysBeforeToday,
    totalWorkDays
  }
}

/**
 * 计算本月所有工作日（返回日期字符串数组）
 * @param restType 休息类型
 * @returns 工作日日期字符串数组
 */
function getWorkDaysOfMonth(restType: TYPE.SalaryConfig["restType"]): string[] {
  const now = dayjs()
  const year = now.year()
  const month = now.month() // 0-based
  const days = now.daysInMonth()
  const workDays: string[] = []
  for (let d = 1; d <= days; d++) {
    const date = dayjs(`${year}-${month + 1}-${d}`)
    const day = date.day()
    if (restType === "double") {
      if (day !== 0 && day !== 6) workDays.push(date.format("YYYY-MM-DD"))
    } else if (restType === "single") {
      if (day !== 0) workDays.push(date.format("YYYY-MM-DD"))
    } else if (restType === "alt") {
      // 简单单双休轮流，偶数周日休息
      const week = Math.floor(
        (d + dayjs(`${year}-${month + 1}-1`).day() - 1) / 7
      )
      if (
        (week % 2 === 0 && day !== 0 && day !== 6) ||
        (week % 2 === 1 && day !== 0)
      )
        workDays.push(date.format("YYYY-MM-DD"))
    }
  }
  return workDays
}

/**
 * 计算今日已上班秒数
 * @param workStart 上班时间
 * @param workEnd 下班时间
 * @param overtime 是否加班
 * @param overtimeHours 加班时长
 * @returns 已上班秒数
 */
function getTodayWorkedSeconds(
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) {
  const now = dayjs()
  const today = now.format("YYYY-MM-DD")
  const start = dayjs(`${today} ${workStart}`)
  let end = dayjs(`${today} ${workEnd}`)
  if (overtime) end = end.add(overtimeHours, "hour")
  if (now.isBefore(start)) return 0
  if (now.isAfter(end)) return end.diff(start, "second")
  return now.diff(start, "second")
}

/**
 * 计算总上班秒数
 * @param workStart 上班时间
 * @param workEnd 下班时间
 * @param overtime 是否加班
 * @param overtimeHours 加班时长
 * @returns 总上班秒数
 */
function getTotalWorkSeconds(
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) {
  const baseDay = "2000-01-01"
  const start = dayjs(`${baseDay} ${workStart}`)
  let end = dayjs(`${baseDay} ${workEnd}`)
  if (overtime) end = end.add(overtimeHours, "hour")
  return end.diff(start, "second")
}
