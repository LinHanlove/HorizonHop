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
  overtimeHours: 0,
  payday: 15
}

/**
 * 工资配置读取/保存 hook
 * @param {boolean} [open] 是否自动读取配置
 * @returns {{ config: TYPE.SalaryConfig, setConfig: Function, saveConfig: Function, loading: boolean }}
 */
export const useSalaryConfig = (open?: boolean) => {
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
 * @returns {object} 工资相关数据和操作
 */
export const useSalaryCalculation = () => {
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
    // 计算工资月区间
    const { start, end } = getSalaryMonthRange(salaryConfig.payday)
    // 获取工资月内所有工作日
    const arr = getWorkDaysOfMonthInRange(salaryConfig.restType, start, end)
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
    // 工资月内已过去的工作日数（不含今天）
    const daysBefore = arr.filter((d) =>
      dayjs(d).isBefore(dayjs(todayStr))
    ).length
    setDaysBeforeToday(daysBefore)
    // 今天是否为工资月内的工作日
    const isTodayWorkDay = arr.includes(todayStr)
    // 进度：已过工作日+今天进度/总工作日
    const monthProgressVal =
      arr.length > 0
        ? (daysBefore + (isTodayWorkDay ? todayProgressVal : 0)) / arr.length
        : 0
    setMonthProgress(monthProgressVal)
    // 累计工资：已过工作日+今天进度
    setTodaySalary(isTodayWorkDay ? daySalaryNum * todayProgressVal : 0)
    setMonthAccum(
      daySalaryNum * (daysBefore + (isTodayWorkDay ? todayProgressVal : 0))
    )
  }, [salaryConfig])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!salaryConfig) return
      // 计算工资月区间
      const { start, end } = getSalaryMonthRange(salaryConfig.payday)
      // 获取工资月内所有工作日
      const arr = getWorkDaysOfMonthInRange(salaryConfig.restType, start, end)
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
      // 工资月内已过去的工作日数（不含今天）
      const daysBefore = arr.filter((d) =>
        dayjs(d).isBefore(dayjs(todayStr))
      ).length
      setDaysBeforeToday(daysBefore)
      // 今天是否为工资月内的工作日
      const isTodayWorkDay = arr.includes(todayStr)
      // 进度：已过工作日+今天进度/总工作日
      const monthProgressVal =
        arr.length > 0
          ? (daysBefore + (isTodayWorkDay ? todayProgressVal : 0)) / arr.length
          : 0
      setMonthProgress(monthProgressVal)
      // 累计工资：已过工作日+今天进度
      setTodaySalary(isTodayWorkDay ? daySalaryNum * todayProgressVal : 0)
      setMonthAccum(
        daySalaryNum * (daysBefore + (isTodayWorkDay ? todayProgressVal : 0))
      )
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
 * @param {TYPE.SalaryConfig["restType"]} restType 休息类型
 * @returns {string[]} 工作日日期字符串数组
 */
const getWorkDaysOfMonth = (
  restType: TYPE.SalaryConfig["restType"]
): string[] => {
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
 * 计算本月所有工作日（返回日期字符串数组）
 * @param {TYPE.SalaryConfig["restType"]} restType 休息类型
 * @param {dayjs.Dayjs} start 工资月开始日期
 * @param {dayjs.Dayjs} end 工资月结束日期
 * @returns {string[]} 工作日日期字符串数组
 */
const getWorkDaysOfMonthInRange = (
  restType: TYPE.SalaryConfig["restType"],
  start: dayjs.Dayjs,
  end: dayjs.Dayjs
): string[] => {
  const workDays: string[] = []
  let currentDate = start
  while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
    const day = currentDate.day()
    // 以工资月第一天为week0
    const weekIndex = Math.floor(currentDate.diff(start, "day") / 7)
    if (restType === "double") {
      if (day !== 0 && day !== 6)
        workDays.push(currentDate.format("YYYY-MM-DD"))
    } else if (restType === "single") {
      if (day !== 0) workDays.push(currentDate.format("YYYY-MM-DD"))
    } else if (restType === "alt") {
      // 工资月内 weekIndex 计算单双休
      if (
        (weekIndex % 2 === 0 && day !== 0 && day !== 6) ||
        (weekIndex % 2 === 1 && day !== 0)
      )
        workDays.push(currentDate.format("YYYY-MM-DD"))
    }
    currentDate = currentDate.add(1, "day")
  }
  return workDays
}

/**
 * 计算今日已上班秒数
 * @param {string} workStart 上班时间
 * @param {string} workEnd 下班时间
 * @param {boolean} overtime 是否加班
 * @param {number} overtimeHours 加班时长
 * @returns {number} 已上班秒数
 */
const getTodayWorkedSeconds = (
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) => {
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
 * @param {string} workStart 上班时间
 * @param {string} workEnd 下班时间
 * @param {boolean} overtime 是否加班
 * @param {number} overtimeHours 加班时长
 * @returns {number} 总上班秒数
 */
const getTotalWorkSeconds = (
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) => {
  const baseDay = "2000-01-01"
  const start = dayjs(`${baseDay} ${workStart}`)
  let end = dayjs(`${baseDay} ${workEnd}`)
  if (overtime) end = end.add(overtimeHours, "hour")
  return end.diff(start, "second")
}

/**
 * 计算当前工资月的起止日期
 * @param {number} payday 发薪日（1-31）
 * @returns {{ start: dayjs.Dayjs, end: dayjs.Dayjs }}
 */
const getSalaryMonthRange = (payday: number) => {
  const now = dayjs()
  const daysInThisMonth = now.daysInMonth()
  // 本月实际发薪日
  const thisMonthPayday = payday >= daysInThisMonth ? daysInThisMonth : payday
  const paydayThisMonth = now.date(thisMonthPayday)
  // 判断今天是否在本月发薪日之后
  if (now.date() > thisMonthPayday) {
    // 工资月为本月发薪日+1到下月发薪日
    const start = paydayThisMonth.add(1, "day")
    const nextMonth = now.add(1, "month")
    const daysInNextMonth = nextMonth.daysInMonth()
    const nextMonthPayday = payday >= daysInNextMonth ? daysInNextMonth : payday
    const end = nextMonth.date(nextMonthPayday)
    return { start, end }
  } else {
    // 工资月为上月发薪日+1到本月发薪日
    const lastMonth = now.subtract(1, "month")
    const daysInLastMonth = lastMonth.daysInMonth()
    const lastMonthPayday = payday >= daysInLastMonth ? daysInLastMonth : payday
    const start = lastMonth.date(lastMonthPayday).add(1, "day")
    const end = paydayThisMonth
    return { start, end }
  }
}
