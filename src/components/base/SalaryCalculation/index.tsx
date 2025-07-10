import Dialog, {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import { toast } from "@/components/base/Sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { TimePickerInput } from "@/components/ui/time-picker-input"
import { useSalaryConfig } from "@/hooks/modules/salaryCalculation"
import React from "react"

const restTypeOptions = [
  { label: "双休", value: "double" },
  { label: "单休", value: "single" },
  { label: "单双休轮", value: "alt" }
]

export default function SalaryCalculation({
  open,
  setOpen
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const { config, setConfig, saveConfig } = useSalaryConfig(open)

  const handleChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    saveConfig(config)
      .then(() => {
        toast("保存成功", { type: "success" })
        setOpen(false)
      })
      .catch(() => {
        toast("保存失败", { type: "error" })
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lh-w-[400px] lh-flex lh-flex-col lh-max-h-[50vh] lh-backdrop-blur-sm lh-hide-scrollbar">
        <DialogHeader>
          <DialogTitle>工资设置</DialogTitle>
        </DialogHeader>
        <div className="lh-space-y-6 lh-overflow-y-auto lh-py-4 lh-pr-2 lh-flex-1">
          <div>
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-800 lh-mb-4">
              基础设置
            </h3>
            <div className="lh-space-y-4">
              <div className="lh-flex lh-items-center lh-justify-between">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  上班时间
                </span>
                <TimePickerInput
                  value={config.workStart}
                  onChange={(e) => handleChange("workStart", e.target.value)}
                  className="!lh-w-[120px] lh-rounded-xl"
                />
              </div>
              <div className="lh-flex lh-items-center lh-justify-between">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  下班时间
                </span>
                <TimePickerInput
                  value={config.workEnd}
                  onChange={(e) => handleChange("workEnd", e.target.value)}
                  className="!lh-w-[120px] lh-rounded-xl"
                />
              </div>
              <div className="lh-flex lh-items-center lh-justify-between">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  月薪（元）
                </span>
                <Input
                  value={config.monthSalary}
                  onChange={(e) =>
                    handleChange("monthSalary", Number(e.target.value))
                  }
                  className="!lh-w-[120px] lh-rounded-xl"
                />
              </div>
              <div className="lh-flex lh-items-center lh-justify-between">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  发薪日（1-31，月底为当月最后一天）
                </span>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={config.payday}
                  onChange={(e) =>
                    handleChange("payday", Number(e.target.value))
                  }
                  className="!lh-w-[120px] lh-rounded-xl"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-800 lh-mb-4">
              休息规则
            </h3>
            <div className="lh-flex lh-gap-2">
              {restTypeOptions.map((item) => (
                <Button
                  key={item.value}
                  className={`lh-px-4 lh-py-2 lh-rounded-xl lh-text-sm lh-font-medium lh-border ${config.restType === item.value ? "lh-bg-slate-800 lh-text-white" : "lh-bg-slate-50 lh-text-slate-700 lh-border-slate-200"}`}
                  onClick={() => handleChange("restType", item.value)}
                  variant={
                    config.restType === item.value ? undefined : "outline"
                  }>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-800 lh-mb-4">
              加班设置
            </h3>
            <div className="lh-flex lh-items-center lh-justify-between lh-mb-3">
              <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                是否日常加班
              </span>
              <Switch
                checked={config.overtime}
                onCheckedChange={(v) => handleChange("overtime", v)}
              />
            </div>
            {config.overtime && (
              <div className="lh-flex lh-items-center lh-justify-between">
                <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                  加班时长（小时/天）
                </span>
                <Input
                  max={12}
                  value={config.overtimeHours}
                  onChange={(e) => {
                    if (Number(e.target.value) < 0)
                      handleChange("overtimeHours", 0)
                    handleChange("overtimeHours", Number(e.target.value))
                  }}
                  className="!lh-w-[120px] lh-rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
        <div className="lh-pt-4 lh-border-t lh-border-slate-200 lh-flex lh-gap-2">
          <Button className="lh-flex-1 lh-rounded-xl" onClick={handleSave}>
            保存
          </Button>
          <Button
            className="lh-flex-1 lh-rounded-xl"
            variant="outline"
            onClick={() => setOpen(false)}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
