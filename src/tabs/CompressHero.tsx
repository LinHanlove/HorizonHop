import { Icon } from "@iconify/react"

import Dialog, {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~components/base/Dialog"
import { Button } from "~components/ui/button"
import { Progress } from "~components/ui/progress"

import "~style.css"

import { useEffect, useRef, useState } from "react"

import {
  Compressor_PNG,
  convertImageFormat,
  formatFileSize,
  UPNG_PNG
} from "~utils/func"
import { getUUID } from "~utils/public"

export default function CompressHero() {
  /**
   * @constant adjustList
   * @description 压缩率
   */
  const adjustList = [
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
   * @useState progress
   * @description 压缩进度
   */
  const [progress, setProgress] = useState<number>(0)

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
        // 更新进度
        setProgress(((index + 1) / fileList.length) * 100)

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
    setProgress(0) // 重置进度
  }

  /**
   * @function handleFileSelect
   * @description 处理文件选择
   */
  const handleFileSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files)
      files.forEach((file: any) => {
        file["id"] = getUUID()
      })
      setFileList([...fileList, ...files])
    }
    input.click()
  }

  /**
   * @function handleDragEnter
   * @description 处理拖拽进入
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  /**
   * @function handleDragOver
   * @description 处理拖拽经过
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  /**
   * @function handleDragLeave
   * @description 处理拖拽离开
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  /**
   * @function handleDrop
   * @description 处理文件拖放
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )
    files.forEach((file) => {
      file["id"] = getUUID()
    })
    setFileList([...fileList, ...files])
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
          <div
            ref={uploadFileRef}
            className={`lh-bg-white/80 lh-backdrop-blur-sm lh-rounded-xl lh-border lh-border-slate-200/60 lh-shadow-sm lh-p-6 lh-transition-all hover:lh-shadow-md ${
              isDragging ? "lh-border-teal-500 lh-bg-teal-50/50" : ""
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <div className="lh-text-center">
              <div className="lh-mb-4 lh-flex lh-justify-center">
                <div
                  className={`lh-w-16 lh-h-16 lh-rounded-full lh-flex lh-items-center lh-justify-center lh-transition-colors ${
                    isDragging
                      ? "lh-bg-teal-100 lh-text-teal-600"
                      : "lh-bg-slate-100 lh-text-slate-400"
                  }`}>
                  <Icon icon="mdi:image-plus" className="lh-w-8 lh-h-8" />
                </div>
              </div>
              <h3 className="lh-text-lg lh-font-medium lh-text-slate-700 lh-mb-2">
                {isDragging ? "释放以上传图片" : "拖拽图片到这里"}
              </h3>
              <p className="lh-text-sm lh-text-slate-500 lh-mb-4">
                或者点击选择图片
              </p>
              <div className="lh-flex lh-justify-center lh-space-x-4">
                <Button
                  variant="outline"
                  className="lh-bg-white lh-border-slate-200 hover:lh-bg-slate-50 lh-text-slate-600"
                  onClick={handleFileSelect}>
                  <Icon icon="mdi:upload" className="lh-w-4 lh-h-4 lh-mr-2" />
                  选择图片
                </Button>
                {fileList.length > 0 && (
                  <Button
                    variant="default"
                    className="lh-bg-teal-600 hover:lh-bg-teal-700"
                    onClick={() => {
                      compressorDetails.forEach((file) => {
                        const a = document.createElement("a")
                        a.href = URL.createObjectURL(file.file)
                        a.download = file.file.name
                        a.click()
                      })
                    }}>
                    <Icon
                      icon="mdi:download"
                      className="lh-w-4 lh-h-4 lh-mr-2"
                    />
                    批量下载
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 设置区域 */}
        <div className="lh-max-w-2xl lh-mx-auto lh-mb-8">
          <div className="lh-bg-white/80 lh-backdrop-blur-sm lh-rounded-xl lh-border lh-border-slate-200/60 lh-shadow-sm lh-p-6">
            <h3 className="lh-text-lg lh-font-medium lh-text-slate-700 lh-mb-4">
              压缩设置
            </h3>
            <div className="lh-space-y-4">
              <div className="lh-flex lh-items-center lh-justify-between">
                <label className="lh-text-sm lh-text-slate-600">压缩质量</label>
                <div className="lh-w-48">
                  <div className="lh-flex lh-items-center lh-space-x-2">
                    {adjustList.map((item) => (
                      <Button
                        key={item.label}
                        variant={quality === item.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuality(item.value)}
                        className="lh-flex-1">
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文件列表区域 */}
        {fileList.length > 0 && (
          <div className="lh-max-w-2xl lh-mx-auto">
            <div className="lh-bg-white/80 lh-backdrop-blur-sm lh-rounded-xl lh-border lh-border-slate-200/60 lh-shadow-sm lh-p-6">
              <div className="lh-flex lh-items-center lh-justify-between lh-mb-6">
                <h3 className="lh-text-lg lh-font-medium lh-text-slate-700">
                  文件列表
                </h3>
                <div className="lh-flex lh-items-center lh-space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFileList([])
                      setCompressorDetails([])
                    }}
                    className="lh-text-red-500">
                    <Icon icon="mdi:delete" className="lh-w-4 lh-h-4 lh-mr-1" />
                    清空列表
                  </Button>
                </div>
              </div>
              {progress > 0 && (
                <div className="lh-mb-6 lh-bg-slate-50 lh-p-4 lh-rounded-lg lh-border lh-border-slate-200">
                  <div className="lh-flex lh-items-center lh-justify-between lh-mb-2">
                    <div className="lh-flex lh-items-center lh-space-x-2">
                      <Icon
                        icon="mdi:loading"
                        className="lh-w-4 lh-h-4 lh-text-teal-500 lh-animate-spin"
                      />
                      <span className="lh-text-sm lh-font-medium lh-text-slate-700">
                        处理进度
                      </span>
                    </div>
                    <span className="lh-text-sm lh-font-medium lh-text-teal-600">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="lh-h-1.5 lh-bg-slate-200/60 [&>div]:lh-bg-gradient-to-r [&>div]:lh-from-teal-500 [&>div]:lh-to-teal-600 [&>div]:lh-transition-all [&>div]:lh-duration-300"
                  />
                </div>
              )}
              <div className="lh-space-y-4">
                {fileList.map((file) => {
                  const compressedFile = compressorDetails.find(
                    (item) => item.id === file.id
                  )
                  const isProcessing =
                    !compressedFile && file.status !== "success"
                  return (
                    <div
                      key={file.id}
                      className="lh-flex lh-items-center lh-justify-between lh-p-4 lh-bg-slate-50 lh-rounded-lg lh-border lh-border-slate-200">
                      <div className="lh-flex lh-items-center lh-space-x-4 lh-min-w-0">
                        <div className="lh-w-12 lh-h-12 lh-rounded-lg lh-bg-slate-100 lh-flex lh-items-center lh-justify-center lh-flex-shrink-0">
                          <Icon
                            icon="mdi:image"
                            className="lh-w-6 lh-h-6 lh-text-slate-400"
                          />
                        </div>
                        <div className="lh-min-w-0 lh-flex-1">
                          <p className="lh-text-sm lh-font-medium lh-text-slate-700 lh-truncate">
                            {file.name}
                          </p>
                          <p className="lh-text-xs lh-text-slate-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="lh-flex lh-items-center lh-space-x-2 lh-ml-4 lh-flex-shrink-0">
                        {isProcessing ? (
                          <div className="lh-flex lh-items-center lh-text-slate-500">
                            <Icon
                              icon="mdi:loading"
                              className="lh-w-4 lh-h-4 lh-mr-2 lh-animate-spin"
                            />
                            处理中...
                          </div>
                        ) : (
                          <>
                            {compressedFile && (
                              <div className="lh-text-xs lh-text-slate-500 lh-mr-4">
                                <span className="lh-text-green-600">
                                  {compressedFile.compressibility.toFixed(1)}%
                                </span>
                                压缩率
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(file)}
                              className="lh-text-slate-600">
                              <Icon
                                icon="mdi:eye"
                                className="lh-w-4 lh-h-4 lh-mr-1"
                              />
                              预览
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFormatImage(file)
                                setIsOpenFormat(true)
                              }}
                              className="lh-text-slate-600">
                              <Icon
                                icon="mdi:format-image"
                                className="lh-w-4 lh-h-4 lh-mr-1"
                              />
                              转换格式
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="lh-text-slate-600">
                              <Icon
                                icon="mdi:download"
                                className="lh-w-4 lh-h-4 lh-mr-1"
                              />
                              下载
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(file)}
                              className="lh-text-red-500">
                              <Icon
                                icon="mdi:delete"
                                className="lh-w-4 lh-h-4 lh-mr-1"
                              />
                              删除
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 预览模态框 */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="lh-w-[1000px] lh-flex lh-flex-col lh-max-h-[90vh] lh-backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>
          <DialogDescription>对比原始图片和压缩后的效果</DialogDescription>
          {previewImage?.original && previewImage?.compressed && (
            <div className="lh-grid lh-grid-cols-2 lh-gap-8 lh-p-6">
              <div className="lh-space-y-3">
                <div className="lh-flex lh-items-center lh-justify-between lh-bg-slate-50 lh-px-4 lh-py-2 lh-rounded-lg">
                  <p className="lh-text-sm lh-font-medium lh-text-slate-700">
                    原始图片
                  </p>
                  <p className="lh-text-xs lh-text-slate-500">
                    {formatFileSize(previewImage.original.file.size)}
                  </p>
                </div>
                <div className="lh-aspect-[4/3] lh-bg-slate-100 lh-rounded-lg lh-overflow-hidden lh-border lh-border-slate-200 lh-shadow-sm">
                  <img
                    src={previewImage.original.url}
                    alt="原始图片"
                    className="lh-w-full lh-h-full lh-object-contain"
                  />
                </div>
              </div>
              <div className="lh-space-y-3">
                <div className="lh-flex lh-items-center lh-justify-between lh-bg-slate-50 lh-px-4 lh-py-2 lh-rounded-lg">
                  <p className="lh-text-sm lh-font-medium lh-text-slate-700">
                    压缩后
                  </p>
                  <p className="lh-text-xs lh-text-slate-500">
                    {formatFileSize(previewImage.compressed.file.size)}
                  </p>
                </div>
                <div className="lh-aspect-[4/3] lh-bg-slate-100 lh-rounded-lg lh-overflow-hidden lh-border lh-border-slate-200 lh-shadow-sm">
                  <img
                    src={previewImage.compressed.url}
                    alt="压缩后"
                    className="lh-w-full lh-h-full lh-object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* 预览模态框 */}

      {/* 格式转换模态框 */}
      <Dialog open={isOpenFormat} onOpenChange={setIsOpenFormat}>
        <DialogContent className="lh-w-[520px] lh-flex lh-flex-col lh-max-h-[60vh] lh-backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>格式转换</DialogTitle>
          </DialogHeader>
          <DialogDescription>选择目标格式进行转换</DialogDescription>
          {formatImage && (
            <div className="lh-space-y-6">
              <div className="lh-flex lh-items-center lh-justify-center lh-space-x-4 lh-text-sm">
                <div className="lh-flex lh-items-center lh-bg-slate-50 lh-px-4 lh-py-2 lh-rounded-lg">
                  <span className="lh-text-slate-600">当前格式：</span>
                  <span className="lh-text-red-500 lh-ml-2 lh-font-medium">
                    {formatImage.type.split("/")[1].toUpperCase()}
                  </span>
                </div>
                <Icon
                  icon="mdi:arrow-right"
                  className="lh-w-5 lh-h-5 lh-text-orange-500"
                />
                <div className="lh-flex lh-items-center lh-bg-slate-50 lh-px-4 lh-py-2 lh-rounded-lg">
                  <span className="lh-text-slate-600">目标格式：</span>
                  <span className="lh-text-green-500 lh-ml-2 lh-font-medium">
                    {formatType.toUpperCase()}
                  </span>
                </div>
              </div>

              {errorText && (
                <div className="lh-text-sm lh-text-red-500 lh-text-center lh-bg-red-50 lh-px-4 lh-py-2 lh-rounded-lg">
                  {errorText}
                </div>
              )}

              <div className="lh-flex lh-justify-center lh-space-x-3">
                {formatTypeList.map((item) => (
                  <Button
                    key={item.value}
                    variant={formatType === item.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFormatType(item.value)
                      setErrorText("")
                    }}
                    className={`lh-w-28 lh-h-10 lh-transition-all ${
                      formatType === item.value
                        ? "lh-bg-teal-600 hover:lh-bg-teal-700"
                        : "lh-border-slate-200 hover:lh-border-teal-500 hover:lh-text-teal-600"
                    }`}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <DialogFooter className="lh-flex lh-justify-end lh-space-x-3 lh-mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpenFormat(false)
                setErrorText("")
              }}
              className="lh-px-6">
              取消
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleConvertImageFormat}
              className="lh-bg-teal-600 hover:lh-bg-teal-700 lh-px-6">
              开始转换
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 格式转换模态框 */}
    </div>
  )
}
