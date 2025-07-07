import { getLocal, setLocal } from "@/utils/chrome.tools"
import { useEffect, useRef, useState } from "react"

import { LOCAL_KEY } from "~constants"

// 默认工资配置
export const defaultSalaryConfig: TYPE.SalaryConfig = {
  workStart: "09:00",
  workEnd: "18:00",
  monthSalary: 8000,
  restType: "double", // double:双休, single:单休, alt:单双休轮
  overtime: false,
  overtimeHours: 0
}

// 工资配置读取/保存 hook
export function useSalaryConfig(open?: boolean) {
  const [config, setConfig] = useState<TYPE.SalaryConfig>(defaultSalaryConfig)
  const [loading, setLoading] = useState(false)

  // 读取工资配置（open为true时自动读取，或手动调用）
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

  // 保存工资配置
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

// 计算本月所有工作日（返回日期字符串数组）
export function getWorkDaysOfMonth(
  restType: TYPE.SalaryConfig["restType"]
): string[] {
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

// 计算今日已上班秒数
export function getTodayWorkedSeconds(
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) {
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

// 计算总上班秒数
export function getTotalWorkSeconds(
  workStart: string,
  workEnd: string,
  overtime: boolean,
  overtimeHours: number
) {
  const startArr = workStart.split(":").map(Number)
  const endArr = workEnd.split(":").map(Number)
  const start = new Date(2000, 0, 1, startArr[0], startArr[1] || 0, 0)
  const end = new Date(2000, 0, 1, endArr[0], endArr[1] || 0, 0)
  if (overtime) end.setMinutes(end.getMinutes() + overtimeHours * 60)
  return (end.getTime() - start.getTime()) / 1000
}

// 工资计算核心hook，输入工资配置，输出所有展示数据
export function useSalaryCalculation(config: TYPE.SalaryConfig) {
  const [workDaysArr, setWorkDaysArr] = useState<string[]>([])
  const [daySalary, setDaySalary] = useState<string>("-")
  const [monthAccum, setMonthAccum] = useState<string>("-")
  const [realtimeSalary, setRealtimeSalary] = useState<string>("-")

  // 计算本月工作日、日工资、月累计工资
  useEffect(() => {
    const arr = getWorkDaysOfMonth(config.restType)
    setWorkDaysArr(arr)
    const daySalaryNum = arr.length > 0 ? config.monthSalary / arr.length : 0
    setDaySalary(daySalaryNum > 0 ? daySalaryNum.toFixed(2) : "-")
    // 月累计工资 = 今天之前的工作日数量 * 日工资
    const todayStr = new Date().toISOString().slice(0, 10)
    const daysBeforeToday = arr.filter((d) => d <= todayStr).length
    setMonthAccum(
      daySalaryNum > 0 ? (daySalaryNum * daysBeforeToday).toFixed(2) : "-"
    )
  }, [config])

  // 实时薪资定时刷新（每秒）
  useEffect(() => {
    function updateRealtime() {
      const arr = getWorkDaysOfMonth(config.restType)
      const todayStr = new Date().toISOString().slice(0, 10)
      if (!arr.includes(todayStr)) {
        setRealtimeSalary("-")
        return
      }
      const daySalaryNum = arr.length > 0 ? config.monthSalary / arr.length : 0
      const worked = getTodayWorkedSeconds(
        config.workStart,
        config.workEnd,
        config.overtime,
        config.overtimeHours
      )
      const total = getTotalWorkSeconds(
        config.workStart,
        config.workEnd,
        config.overtime,
        config.overtimeHours
      )
      const percent = total > 0 ? Math.min(worked / total, 1) : 0
      setRealtimeSalary(
        daySalaryNum > 0 ? (daySalaryNum * percent).toFixed(2) : "-"
      )
    }
    updateRealtime()
    const timer = setInterval(updateRealtime, 1000)
    return () => clearInterval(timer)
  }, [config])

  return { workDaysArr, daySalary, monthAccum, realtimeSalary }
}
