import { Button } from "@/components/ui/button"

import { CountButton } from "~features/count-button"

import "~style.css"

function IndexPopup() {
  return (
    <div className="w-[500px] h-[500px]">
      <CountButton />
      <Button variant="outline">Outline</Button>
    </div>
  )
}

export default IndexPopup
