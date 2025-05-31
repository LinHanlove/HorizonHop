import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import React from "react"

export default function Setting({ ...props }) {
  console.log("设置弹窗", props)

  const { open, setOpen } = props
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="lh-sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setting</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="lh-grid lh-gap-4 lh-py-4">
          <div className="lh-grid lh-grid-cols-4 lh-items-center lh-gap-4"></div>
          <div className="lh-grid lh-grid-cols-4 lh-items-center lh-gap-4"></div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
