import { useState } from "react";
import { toast } from "sonner";
import '../../style'

export const useNewAddShortcut = () => {
  // 新增的快捷方式
  const [newShortcut, setNewShortcut] = useState<TYPE.Shortcuts>({ 
    alias: "", 
    icon: "🔗",
    prefix:'',
    suffix:'' ,
    category: "other"
  })

  /**
   * @function 设置新增的快捷方式
   */
  const onSubmitNewShortcut = (shortcut) => {
    const { alias, icon, prefix, suffix, category } = shortcut;
    console.log('submitNewShortcut--->', shortcut);
    if(!alias) {
      toast.error("注意", {
        description: "请输入快捷方式名称",
        position: "top-center",
        action: {
          label: "我知道了",
          onClick: () => console.log("Undo"),
        },
      })
    }

    
  }

  return { 
    newShortcut,
    setNewShortcut,
    onSubmitNewShortcut
   };
}