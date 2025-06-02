import { Icon } from "@iconify/react"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"

// import { Slider } from "~components/ui/slider"

import "~style.css"

import { useEffect, useRef, useState } from "react"

import {
  Compressor_PNG,
  convertImageFormat,
  formatFileSize,
  UPNG_PNG
} from "~utils"

export default function CompressHero() {
  /**
   * @constant adjustList
   * @description 压缩率
   */
  const adjustList = [
    { value: null, label: "仅转换" },
    { value: 0.8, label: "轻度" },
    { value: 0.6, label: "一般" },
    { value: 0.4, label: "重度" }
  ]

  /**
   * @constant formatType
   * @description 格式转换
   */
  const formatTypeList = [
    { value: "png", label: "PNG" },
    { value: "webp", label: "WEBP" },
    { value: "jpeg", label: "JPEG" }
  ]

  /**
   * @useState quality
   * @description 选择的压缩率
   */
  const [quality, setQuality] = useState<number>(0.6)

  /**
   * @useState quality
   * @description 选择的压缩率
   */
  const [formatType, setFormatType] = useState<string>("png")

  /**
   * @useState fileList
   */
  const [fileList, setFileList] = useState<any[]>([])

  /**
   * @useState uploadFileRef
   */
  const uploadFileRef = useRef(null)

  /**
   * @useState isDragging
   */
  const [isDragging, setIsDragging] = useState(false)

  /**
   * @useState isOpen preview
   */
  const [isOpen, setIsOpen] = useState(false)

  /**
   * @useState isOpen format
   */
  const [isOpenFormat, setIsOpenFormat] = useState(false)

  /**
   * @useState compressor details
   */
  const [compressorDetails, setCompressorDetails] = useState<any[]>([])

  /**
   * @useState previewImage
   */
  const [previewImage, setPreviewImage] = useState<{
    original: {
      url: string
      file: any
    }
    compressed: {
      url: string
      file: any
    }
  }>({
    original: null,
    compressed: null
  })

  /**
   * @useState formatImage
   */
  const [formatImage, setFormatImage] = useState<File>()

  /**
   * @useState errorText
   */
  const [errorText, setErrorText] = useState<string>()

  /**
   * @description 监听文件列表
   */
  useEffect(() => {
    if (!fileList.length) {
      setCompressorDetails([])
    } else {
      processFiles()
    }
  }, [fileList])

  /***
   * @function processFiles
   */
  const processFiles = async () => {
    const afterData = []
    console.log("监听文件列表", fileList, quality)

    for (let index = 0; index < fileList.length; index++) {
      let fileData
      const file = fileList[index]

      if (file.status !== "success" && file.type.startsWith("image/")) {
        if (quality) {
          console.log("文件类型--->", file.type, file.type === "image/png")

          if (file.type === "image/png") {
            fileData = await UPNG_PNG(file, quality)
          } else {
            fileData = await Compressor_PNG(file, quality, window)
          }
        }
        console.log("压缩前--->", file)

        console.log("压缩后-->", fileData)
        file["status"] = "success"
        const compressibility = quality
          ? ((file.size - fileData.size) / file.size) * 100
          : 0
        afterData.push({
          id: file.id,
          file: quality ? fileData : file,
          name: file.name,
          size: quality ? fileData.size : file.size,
          type: file.type,
          key: quality ? "compress" : "convert", // 标记是否是压缩文件还是转换文件
          compressibility
        })
      }
    }

    setCompressorDetails([...afterData, ...compressorDetails])
  }

  /**
   * @function handleFileChange
   * @description 上传文件
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files).forEach((file) => {
      file["id"] = file.type.startsWith("image/")
        ? file.name.split(".")[0] + "-" + new Date().getTime()
        : null
    })

    setFileList([...fileList, ...e.target.files])
    e.target.value = ""
  }

  /**
   * @function handleDownload
   * @description 下载文件
   */
  const handleDownload = (file: any) => {
    const a = document.createElement("a")
    const downloadFile = compressorDetails.find(
      (item) => item.id === file.id
    )?.file
    a.href = URL.createObjectURL(downloadFile)
    a.download = downloadFile.name
    a.click()
  }

  /**
   * @function handleDelete
   * @description 删除文件
   */
  const handleDelete = (file: any) => {
    setFileList(fileList.filter((item) => item.id !== file.id))
    setCompressorDetails(
      compressorDetails.filter((item) => item.id !== file.id)
    )
  }

  /**
   * @function handlePreview
   * @description 预览文件
   */
  const handlePreview = (file: any) => {
    setPreviewImage({
      original: {
        url: URL.createObjectURL(file),
        file: file
      },
      compressed: {
        url: URL.createObjectURL(
          compressorDetails.find((item) => item.id === file.id)?.file
        ),
        file: compressorDetails.find((item) => item.id === file.id)?.file
      }
    })
    setIsOpen(true)
  }

  /**
   * @function handleConvertImageFormat
   * @description 转换图片格式
   * @param file 文件
   */
  const handleConvertImageFormat = async () => {
    if (formatImage.type.split("/")[1] === formatType)
      return setErrorText("格式相同，无需转换")
    const res = await convertImageFormat({
      file: formatImage,
      format: formatType
    })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(res)
    a.download = res.name
    a.click()
    setIsOpenFormat(false)
  }

  /**
   * @function handleCancel
   * @description 取消
   */
  const handleCancel = () => {}

  useEffect(() => {
    const uploadFileDom = uploadFileRef.current
    if (uploadFileDom) {
      // 拖拽文件进入
      uploadFileDom?.addEventListener("dragenter", (e) => setIsDragging(true))
      // 拖拽文件经过
      uploadFileDom?.addEventListener("dragover", (e) => setIsDragging(true))
      // 拖拽文件离开
      uploadFileDom?.addEventListener("dragleave", (e) => setIsDragging(false))
      // 拖拽文件释放
      uploadFileDom?.addEventListener("drop", (e) => setIsDragging(false))
    }

    console.log(uploadFileDom)
    return () => {
      if (uploadFileDom) {
        uploadFileDom?.removeEventListener("dragenter")
        uploadFileDom?.removeEventListener("dragover")
        uploadFileDom?.removeEventListener("dragleave")
        uploadFileDom?.removeEventListener("drop")
      }
    }
  }, [])

  /**
   * @function isConvert
   */
  const isConvert = (file) => {
    return compressorDetails.find((i) => i.id === file.id)?.key === "convert"
  }
  return (
    <div className="lh-min-h-screen lh-bg-gradient-to-br lh-from-slate-50 lh-to-slate-100/50">
      {/* 背景装饰 */}
      <div className="lh-fixed lh-inset-0 lh-opacity-[0.02] lh-pointer-events-none">
        <div
          className="lh-absolute lh-inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105) 1px, transparent 0)`,
            backgroundSize: "20px 20px"
          }}></div>
      </div>

      <div className="lh-relative lh-container lh-mx-auto lh-px-4 lh-py-8">
        {/* 标题区域 */}
        <div className="lh-mb-8 lh-text-center">
          <h1 className="lh-text-3xl lh-font-bold lh-text-slate-800 lh-tracking-tight lh-mb-2">
            图片压缩
          </h1>
          <p className="lh-text-slate-500 lh-text-sm">
            支持多种图片格式，快速压缩，保持画质
          </p>
        </div>

        {/* 上传区域 */}
        <div className="lh-max-w-2xl lh-mx-auto lh-mb-8">
          <div className="lh-bg-white/80 lh-backdrop-blur-sm lh-rounded-xl lh-border lh-border-slate-200/60 lh-shadow-sm lh-p-6 lh-transition-all hover:lh-shadow-md">
            <div className="lh-text-center">
              <div className="lh-mb-4 lh-flex lh-justify-center">
                <div className="lh-w-16 lh-h-16 lh-rounded-full lh-bg-slate-100 lh-flex lh-items-center lh-justify-center lh-text-slate-400">
                  <Icon icon="mdi:image-plus" className="lh-w-8 lh-h-8" />
                </div>
              </div>
              <h3 className="lh-text-lg lh-font-medium lh-text-slate-700 lh-mb-2">
                拖拽图片到这里
              </h3>
              <p className="lh-text-sm lh-text-slate-500 lh-mb-4">
                或者点击选择图片
              </p>
              <Button
                variant="outline"
                className="lh-bg-white lh-border-slate-200 hover:lh-bg-slate-50 lh-text-slate-600">
                选择图片
              </Button>
            </div>
          </div>
        </div>

        {/* 设置区域 */}
        <div className="lh-max-w-2xl lh-mx-auto">
          <div className="lh-bg-white/80 lh-backdrop-blur-sm lh-rounded-xl lh-border lh-border-slate-200/60 lh-shadow-sm lh-p-6">
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-700 lh-mb-4">
              压缩设置
            </h3>
            <div className="lh-space-y-4">
              <div className="lh-flex lh-items-center lh-justify-between">
                <label className="lh-text-sm lh-text-slate-600">压缩质量</label>
                <div className="lh-w-48">
                  {/* <Slider
                    defaultValue={[80]}
                    max={100}
                    min={0}
                    step={1}
                    className="lh-w-full"
                  /> */}
                </div>
              </div>
              <div className="lh-flex lh-items-center lh-justify-between">
                <label className="lh-text-sm lh-text-slate-600">最大宽度</label>
                <div className="lh-w-48">
                  <Input
                    type="number"
                    className="lh-h-8 lh-text-sm"
                    placeholder="原始宽度"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

//  <Modal
//         isOpen={isOpenFormat}
//         setIsOpen={(isOpenFormat) => setIsOpenFormat(isOpenFormat)}
//         hasConfirm
//         confirmText="下载"
//         onConfirm={handleConvertImageFormat}
//         onCancel={handleCancel}
//         title="格式转换">
//         <div className="w-[50vw] flex justify-center items-center flex-col">
//           <div className=" text-[#666] text-[14px] font-semibold mb-3 flex items-center">
//             <span> 转换前</span>
//             <span className="text-red-500 ">({formatImage?.type})</span>
//             <Icon
//               icon="eos-icons:arrow-rotate"
//               className=" text-[orange] w-[20px] h-[20px] mx-4"
//             />
//             <span>转换为</span>
//             <span className="text-green-500">(imgae/{formatType})</span>
//           </div>
//           <p className="text-[#666] text-[14px] font-semibold mb-3">
//             {errorText}
//           </p>
//           <div className="flex justify-start mt-5">
//             <div className="flex items-center mb-4 bg-[#f5f5f5] p-1 rounded-lg">
//               {formatTypeList.map((item, idx) => {
//                 return (
//                   <div
//                     style={{
//                       backgroundColor:
//                         item.value === formatType ? "orange" : "#f5f5f5"
//                     }}
//                     onClick={() => setFormatType(item.value)}
//                     className={`${idx === formatTypeList.length - 1 ? "" : "mr-2"} w-[60px] h-[26px] flex items-center justify-center rounded-lg  cursor-pointer hover:bg-[#e0e0e0] transition-all`}
//                     key={item.value}>
//                     <div className="flex items-center ">{item.label}</div>
//                   </div>
//                 )
//               })}
//             </div>
//             {/* E 调节区 */}
//           </div>
//         </div>
//       </Modal>
