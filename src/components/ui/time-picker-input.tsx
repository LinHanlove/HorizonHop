import { Input } from "@/components/ui/input"
import * as React from "react"

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withSeconds?: boolean
  step?: number
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(({ value, onChange, withSeconds = false, step = 60, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let val = e.target.value.trim()
    // 支持 9.00、9-00、9 00、9:00、9:0、09:0、09:00、9、09
    val = val.replace(/[.\-\s]/g, ":") // 全部转成冒号
    let [h = "0", m = "0", s = "0"] = val.split(":")
    // 只输入了小时
    if (val && (m === undefined || m === "")) m = "0"
    // 只输入了小时和分钟
    if (!withSeconds) {
      val = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")
    } else {
      val =
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
    }
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: val } })
    }
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern={withSeconds ? "\\d{2}:\\d{2}:\\d{2}" : "\\d{2}:\\d{2}"}
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      step={step}
      className={`lh-w-[120px] lh-text-center lh-px-2 lh-py-1 lh-rounded-md lh-text-base ${props.className ?? ""}`}
      {...props}
    />
  )
})
TimePickerInput.displayName = "TimePickerInput"
export { TimePickerInput }
