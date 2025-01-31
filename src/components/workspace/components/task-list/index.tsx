import { memo,useEffect } from 'react';
import TaskItem from '../task-item';
import { ScrollArea,CheckboxGroup } from '@radix-ui/themes';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import { Checkbox } from 'antd';
import { Event } from '@/constants';
import { ProcessorType } from '@/utils/processor';
import { formatFileSize } from '@/utils/fs';
interface TaskListProps{
  onSelect: (fileId: FileInfo['id']) => void;
  onChange: (values: Array<FileInfo['id']>) => void;
}

function TaskList(props:TaskListProps) {
  const {
    onSelect,
    onChange
  } = props
  const {
    workspace,
    getFileById,
    setWorkspace,
    eventEmitter
  } = useAppStore(useSelector(['workspace','eventEmitter','getFileById','setWorkspace']))

  console.log("workspace",workspace)


  const handleSelect = (e:React.MouseEvent<HTMLDivElement>)=>{
    const id = e.currentTarget.getAttribute('data-id')
    id && onSelect(id)
  }

  const handleGroupChange = (values:string[])=>{
    onChange(values)
  }

  useEffect(()=>{
    eventEmitter.on(Event['Compress.completed'],(res:ProcessorType.TaskResult)=>{
      const target = getFileById(res.id)
      if(target){
        console.log("压缩完成111",res)
        target.compressStatus = ProcessorType.TaskStatus.Completed
        target.compressedSize = res.size || 0
        target.formatCompressedSize = formatFileSize(target.compressedSize)
        target.compressRate = `${((target.size - target.compressedSize) / target.size * 100).toFixed(2)}%`
        setWorkspace({
          ...workspace,
        })
      }
    })
    return ()=>{
      eventEmitter.removeAllListeners();
    }
  },[eventEmitter])

  return (
    <ScrollArea className='w-full h-full pt-[12px] px-[12px] flex flex-col gap-y-[12px]'>
      <CheckboxGroup.Root onValueChange={handleGroupChange} >
        <div className='flex flex-col gap-y-[12px]'>
          {workspace.fileList.map((file)=>(
            <div className='w-full flex items-center gap-[12px]' key={file.id} data-id={file.id}>
              <CheckboxGroup.Item value={file.id} />
              <div onClick={handleSelect}>
                <TaskItem data={file} />
              </div>
            </div>
          ))}
        </div>
      </CheckboxGroup.Root>
    </ScrollArea>
  );
}

export default memo(TaskList);
