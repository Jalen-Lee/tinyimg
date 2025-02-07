import { memo,useEffect,forwardRef,useImperativeHandle,useState,useRef } from 'react';
import TaskItem from './tasks-list-item';
import { ScrollArea,CheckboxGroup } from '@radix-ui/themes';
import useAppStore from '@/store/app.store';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import { Event } from '@/constants';
import { isFunction } from 'radash';


export interface TaskListRef{

}

interface TasksListProps{
  onSelect?: (fileId: FileInfo['id']) => void;
  onChange?: (values: Array<FileInfo['id']>) => void;
}

const TasksList = forwardRef<TaskListRef,TasksListProps>((props,ref)=>{
  const {onSelect,onChange} = props
  const { eventEmitter } = useAppStore(useSelector(['eventEmitter']))
  const { files,setSelectedFiles} = useCompressionStore(useSelector(['files','setSelectedFiles']))


  const handleSelect = (e:React.MouseEvent<HTMLDivElement>)=>{
    const id = e.currentTarget.getAttribute('data-id')
    eventEmitter.emit(Event['Compress.detail'],id)
    id && isFunction(onSelect) && onSelect(id)
  }

  const handleCheckedChange = (values:Array<FileInfo['id']>)=>{
    setSelectedFiles(values)
    isFunction(onChange) && onChange(values)
  }

  const handleItemClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.stopPropagation();
  }


  useImperativeHandle(ref,()=>{
    return {

    }
  })

  useEffect(()=>{
    // eventEmitter.on(Event['Compress.completed'],(res:ProcessorType.TaskResult)=>{
    //   const target = getFileById(res.id)
    //   if(target){
    //     console.log("压缩完成111",res)
    //     target.compressStatus = ProcessorType.TaskStatus.Completed
    //     target.compressedSize = res.size || 0
    //     target.formatCompressedSize = formatFileSize(target.compressedSize)
    //     target.compressRate = `${((target.size - target.compressedSize) / target.size * 100).toFixed(2)}%`
    //     setWorkspace({
    //       ...workspace,
    //     })
    //   }
    // })
    return ()=>{
      eventEmitter.removeAllListeners();
    }
  },[eventEmitter])

  return (
    <ScrollArea className='w-full h-full pt-6 px-[12px] flex flex-col gap-y-[12px]'>
      <CheckboxGroup.Root onValueChange={handleCheckedChange} color='gray' highContrast>
        <div className='flex flex-col gap-y-[12px]'>
          {files.map((file)=>(
            <div className='w-full flex items-center gap-[12px]' key={file.id} onClick={handleSelect} data-id={file.id}>
              <CheckboxGroup.Item value={file.id} onClick={handleItemClick}/>
              <TaskItem data={file} />
            </div>
          ))}
        </div>
      </CheckboxGroup.Root>
    </ScrollArea>
  );
})

export default memo(TasksList);