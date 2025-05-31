import Dialog, {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/base/Dialog"
import { Button } from "@/components/ui/button"
import React from "react"

export default function Setting({ ...props }) {
  console.log("设置弹窗", props)

  const { open, setOpen } = props
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="tw-sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setting</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="tw-grid tw-gap-4 tw-py-4">
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4"></div>
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4"></div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
