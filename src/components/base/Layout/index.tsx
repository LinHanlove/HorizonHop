import React from 'react'
import Header from '../Header'
import Content from '../Content'


export default function Layout() {
  return (
    <div className="flex flex-col h-auto w-[360px] overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
       {/* S 头部 */}
       <Header/>
       {/* E 头部 */}

       {/* S 内容部分 */}
       <Content/>
       {/* E 内容部分 */}

    </div>
  )
}
