import React from "react"

import Content from "../Content"
import Header from "../Header"

export default function Layout() {
  return (
    <div className="lh-flex lh-flex-col lh-h-auto lh-w-[360px] lh-overflow-hidden lh-bg-gradient-to-br lh-from-slate-50 lh-via-gray-50 lh-to-slate-100">
      {/* S 头部 */}
      <Header />
      {/* E 头部 */}

      {/* S 内容部分 */}
      <Content />
      {/* E 内容部分 */}
    </div>
  )
}
