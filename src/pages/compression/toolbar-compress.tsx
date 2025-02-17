import { memo,useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles,Save } from "lucide-react";
import useCompressionStore from "@/store/compression";
import useSelector from "@/hooks/useSelector";
import { IScheduler } from "@/utils/scheduler";
import { getStore } from '@tauri-apps/plugin-store';
import { SETTINGS_FILE_NAME,SettingsKey,SettingsCompressionTaskConfigOutputMode } from '@/constants';
import { isValidArray } from "@/utils";
import Compressor, { ICompressor } from "@/utils/compressor";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/fs";
import { isString } from "radash";
import { useI18n } from "@/i18n";
import { convertFileSrc } from '@tauri-apps/api/core';

export interface ToolbarCompressProps {

}

function ToolbarCompress(props: ToolbarCompressProps){
  const {selectedFiles,fileMap,files,setFiles,setInCompressing,setInSaving,inCompressing,inSaving} = useCompressionStore(useSelector([
    'selectedFiles','fileMap','files','setFiles','setInCompressing','setInSaving','inCompressing','inSaving'
  ]))
  const t = useI18n()

  const disabledCompress = useMemo(() => {
    return selectedFiles.length === 0 ||
    inCompressing ||
    inSaving ||
    !selectedFiles.some(file => fileMap.get(file)?.compressStatus === IScheduler.TaskStatus.Pending)
  },[selectedFiles,fileMap,inCompressing,inSaving])

  const disabledSave = useMemo(() => {
    return selectedFiles.length === 0 ||
    inCompressing ||
    inSaving ||
    !selectedFiles.some(file => fileMap.get(file)?.compressStatus === IScheduler.TaskStatus.Completed)
  },[selectedFiles,fileMap,inSaving,inCompressing])

  const handleCompress = async () => {
    setInCompressing(true);
    const store = await getStore(SETTINGS_FILE_NAME);
    const concurrency = await store.get<number>(SettingsKey.compression_tasks_concurrency);
    const outputMode = await store.get<string>(SettingsKey.compression_tasks_output_mode);
    const newFileSuffix = await store.get<string>(SettingsKey.compression_tasks_output_mode_save_as_file_suffix);
    const newFolderPath = await store.get<string>(SettingsKey.compression_tasks_output_mode_save_to_folder);
		const apiKeys = await store.get<{api_key:string}[]>(SettingsKey.compression_tinypng_api_keys);
    const quickSave = await store.get<boolean>(SettingsKey.compression_quick_save) || false;

    const tasks = selectedFiles
    .map<ICompressor.QuickCompressTask | ICompressor.CompressTask>(id => {
      const file = fileMap.get(id)
      if(file && file.compressStatus === IScheduler.TaskStatus.Pending){
        file.compressStatus = IScheduler.TaskStatus.Processing;
        if(quickSave){
          let savePtah = ''
          if(outputMode === SettingsCompressionTaskConfigOutputMode.overwrite){
            savePtah = file.path
          }else if(outputMode === SettingsCompressionTaskConfigOutputMode.save_as_new_file){
            savePtah = `${file.parentDir}/${file.name}${newFileSuffix ? `${newFileSuffix}` : ''}.${file.ext}`
          }else if(outputMode === SettingsCompressionTaskConfigOutputMode.save_to_new_folder){
            savePtah = `${newFolderPath}/${file.name}.${file.ext}`
          }
          return {
            filePtah:file.path,
            mimeType:file.mimeType,
            target:savePtah
          } as ICompressor.QuickCompressTask
        }else{
          return {
            filePtah:file.path,
            mimeType:file.mimeType
          } as ICompressor.CompressTask
        }
      }
    }).filter(Boolean)
    setFiles([...files])

    if(!isValidArray(apiKeys)){
      toast.error(t("tips.tinypng_api_keys_not_configured"));
      return;
    }

    const toastId = toast('Compress');
    let fulfilled = 0;
    let rejected = 0;

    if(quickSave){
      const compressor = new Compressor({
        concurrency,
      }).quickCompress(tasks as ICompressor.QuickCompressTask[],{
        tinypngApiKeys:apiKeys.map(item=>item.api_key),
        onFulfilled:(res)=>{
          const targetFile = fileMap.get(res.id);
          if(targetFile){
            fulfilled++;
            toast(`正在压缩...（${fulfilled + rejected}/${tasks.length}）`, {
              id: toastId,
            });
            targetFile.compressStatus = IScheduler.TaskStatus.Done;
            targetFile.compressedSize = res.output.size;
            targetFile.formatCompressedSize = formatFileSize(res.output.size);
            targetFile.compressRate = `${((targetFile.size - targetFile.compressedSize) / targetFile.size * 100).toFixed(2)}%`;
            targetFile.assetPath = convertFileSrc(res.target);
            targetFile.compressedPath = res.target;
            setFiles([...files])
          }
        },
        onRejected:(res)=>{
          const targetFile = fileMap.get(res.id);
          if(targetFile){
            rejected++;
            toast(`正在压缩...（${fulfilled + rejected}/${tasks.length}）`, {
              id: toastId,
            });
            targetFile.compressStatus = IScheduler.TaskStatus.Failed;
            if(isString(res)){
              targetFile.errorMessage = res;
            }
            setFiles([...files])
          }
        }
      });
      toast.promise(compressor, {
        loading: `正在压缩...（${fulfilled + rejected}/${tasks.length}）`,
        id:toastId,
        success: () => {
          return t("tips.quick_compress_completed",{num:tasks.length});
        },
        error: () => {
          setInCompressing(false);
          return t("tips.quick_compress_failed",{num:tasks.length});
        }
      });
    }else{
      await new Compressor({
        concurrency,
      }).compress(tasks as ICompressor.CompressTask[],{
        tinypngApiKeys:apiKeys.map(item=>item.api_key),
        onFulfilled:(res)=>{
          const targetFile = fileMap.get(res.id);
          if(targetFile){
            targetFile.compressStatus = IScheduler.TaskStatus.Completed;
            targetFile.compressedSize = res.output.size;
            targetFile.formatCompressedSize = formatFileSize(res.output.size);
            targetFile.compressRate = `${((targetFile.size - targetFile.compressedSize) / targetFile.size * 100).toFixed(2)}%`;
            targetFile.compressedPath = res.output.url;
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
      toast.success(t("tips.compress_completed",{num:tasks.length}));
      setInCompressing(false);
    }
  }

  const handleSave = async () => {
    const store = await getStore(SETTINGS_FILE_NAME);
    const concurrency = await store.get<number>(SettingsKey.compression_tasks_concurrency);
    const outputMode = await store.get<string>(SettingsKey.compression_tasks_output_mode);
    const newFileSuffix = await store.get<string>(SettingsKey.compression_tasks_output_mode_save_as_file_suffix);
    const newFolderPath = await store.get<string>(SettingsKey.compression_tasks_output_mode_save_to_folder);

    const tasks = selectedFiles.filter(id => fileMap.get(id)?.compressStatus === IScheduler.TaskStatus.Completed).map(id => {
      const file = fileMap.get(id)
      if(file && file.compressStatus === IScheduler.TaskStatus.Completed){
        file.compressStatus = IScheduler.TaskStatus.Saving;
        let target = ''
        if(outputMode === SettingsCompressionTaskConfigOutputMode.overwrite){
          target = file.path
        }else if(outputMode === SettingsCompressionTaskConfigOutputMode.save_as_new_file){
          target = `${file.parentDir}/${file.name}${newFileSuffix ? `${newFileSuffix}` : ''}.${file.ext}`
        }else if(outputMode === SettingsCompressionTaskConfigOutputMode.save_to_new_folder){
          target = `${newFolderPath}/${file.name}.${file.ext}`
        }
        return {
          id:file.id,
          source:file.compressedPath,
          target
        }
      }
    })
    setFiles([...files])

    await new Compressor({
      concurrency,
    }).save(tasks,{
      onFulfilled:(res)=>{
        const targetFile = fileMap.get(res.id);
        if(targetFile){
          targetFile.compressStatus = IScheduler.TaskStatus.Done;
          targetFile.assetPath = convertFileSrc(res.target);
          targetFile.compressedPath = res.target;
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
    toast.success(t("tips.save_completed",{num:tasks.length}));
    setInSaving(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        disabled={disabledCompress}
        onClick={handleCompress}
      >
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabledSave}
        onClick={handleSave}
      >
        <Save className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default memo(ToolbarCompress)