import { memo,useMemo } from "react";
import useCompressionStore from "@/store/compression";
import useSelector from "@/hooks/useSelector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import { Popover } from 'antd';
import { useI18n } from "@/i18n";
import { formatFileSize } from "@/utils/fs";
import { IScheduler } from "@/utils/scheduler";

function ToolbarInfo(){

  const {files} = useCompressionStore(useSelector(['files']))
  const t = useI18n();

  const content = useMemo(() => {
    const totalSavedVolume = files.reduce((acc,file) => {
      if(file.compressedSize){
        return acc + (file.size - file.compressedSize)
      }
      return acc
    },0)

    const totalFilesSize = files.reduce((acc,file) => {
      return acc + file.size
    },0)

    const compressRate = totalSavedVolume > 0 ? ((totalFilesSize - totalSavedVolume) / totalFilesSize * 100).toFixed(2) : '0'

    return (
      <div className="flex items-center">
        <div className="flex flex-col items-center">
          <div className="text-sm">
            {t('compression.toolbar.info.total_files')}
          </div>
          <div className="text-lg font-bold">
            {files.length}
          </div>
        </div>
        <Separator orientation="vertical" className="h-[40px] mx-6" />
        <div className="flex flex-col items-center">
          <div className="text-sm">
            {t('compression.toolbar.info.files_size')}
          </div>
          <div className="text-lg font-bold">
            {formatFileSize(totalFilesSize)}
          </div>
        </div>
        <Separator orientation="vertical" className="h-[40px] mx-6" />
        <div className="flex flex-col items-center">
          <div className="text-sm ">
            {t('compression.toolbar.info.saved_volume')}
          </div>
          <div className="text-lg font-bold">
            {formatFileSize(totalSavedVolume)}
          </div>
        </div>
        <Separator orientation="vertical" className="h-[40px] mx-6" />
        <div className="flex flex-col items-center">
          <div className="text-sm ">
            {t('compression.toolbar.info.saved_volume_rate')}
          </div>
          <div className="text-lg font-bold">
            {compressRate}%
          </div> 
        </div>
      </div>
    )
  },[files])

  return (
    <Popover content={content} trigger="hover">
      <Button 
        variant="ghost" 
        size="icon"
      >
        <Info className="w-4 h-4" />
      </Button>
    </Popover>
  )
}

export default memo(ToolbarInfo)

