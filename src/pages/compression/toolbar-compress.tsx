import { memo,useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import useCompressionStore from "@/store/compression";
import useSelector from "@/hooks/useSelector";
import { IScheduler } from "@/utils/scheduler";
import { getStore } from '@tauri-apps/plugin-store';
import { SETTINGS_FILE_NAME,SettingsKey } from '@/constants';
import { isValidArray } from "@/utils";
import Compressor from "@/utils/compressor";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/fs";
import { isString } from "radash";
import { useI18n } from "@/i18n";

export interface ToolbarCompressProps {

}

function ToolbarCompress(props: ToolbarCompressProps){
  const {selectedFiles,fileMap,files,setFiles} = useCompressionStore(useSelector([
    'selectedFiles','fileMap','files','setFiles'
  ]))
  const t = useI18n()

  const disabled = useMemo(() => {
    return selectedFiles.length === 0 || 
    !selectedFiles.some(file => fileMap.get(file)?.compressStatus === IScheduler.TaskStatus.Pending)
  },[selectedFiles,fileMap])

  const handleCompress = async () => {
    const tasks = selectedFiles.map(id => {
      const file = fileMap.get(id)
      if(file && file.compressStatus === IScheduler.TaskStatus.Pending){
        return {
          filePtah:file.path,
          mimeType:file.mimeType
        }
      }
    })

    const store = await getStore(SETTINGS_FILE_NAME);
    const concurrency = await store.get<number>(SettingsKey['settings.compression.task_config.concurrency']);
		const apiKeys = await store.get<{api_key:string}[]>(SettingsKey['settings.compression.task_config.tinypng.api_keys']);
    if(!isValidArray(apiKeys)){
      toast.error("TinyPNG API 密钥未配置");
      return;
    }

    console.log("concurrency",concurrency);
    console.log("apiKeys",apiKeys);

    const compressor = new Compressor({
      concurrency,
      tinypngApiKeys:apiKeys.map(item=>item.api_key)
    }).addTasks(tasks);

    await compressor.compress({
      onFulfilled:(res)=>{
        const targetFile = fileMap.get(res.id);
        if(targetFile){
          targetFile.compressStatus = IScheduler.TaskStatus.Completed;
          targetFile.compressedSize = res.output.size;
          targetFile.formatCompressedSize = formatFileSize(res.output.size);
          targetFile.compressRate = `${((targetFile.size - targetFile.compressedSize) / targetFile.size * 100).toFixed(2)}%`;
          setFiles([...files])
        }
      },
      onRejected:(res)=>{
        const targetFile = fileMap.get(res.id);
        if(targetFile){
          targetFile.compressStatus = IScheduler.TaskStatus.Failed;
          if(isString(res)){
            targetFile.errorMessage = res;
          }
          setFiles([...files])
        }
      }
    });
    toast.success("✅压缩完成！");
  }

  return (
    <Button
      size="icon"
      disabled={disabled}
      onClick={handleCompress}
    >
      <Sparkles className="h-4 w-4" />
    </Button>
  )
}

export default memo(ToolbarCompress)