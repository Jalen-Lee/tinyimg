import { memo } from 'react';
import TaskItem from '../task-item';
import { ScrollArea } from '@radix-ui/themes';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import { Checkbox } from 'antd';

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
    workspace:{
      fileList
    }
  } = useAppStore(useSelector(['workspace']))


  const handleSelect = (e:React.MouseEvent<HTMLDivElement>)=>{
    const id = e.currentTarget.getAttribute('data-id')
    id && onSelect(id)
  }

  const handleGroupChange = (values:string[])=>{
    onChange(values)
  }

  return (
    <ScrollArea className='w-full h-full pt-[12px] px-[12px] flex flex-col gap-y-[12px]'>
      <Checkbox.Group onChange={handleGroupChange}>
        <div className='flex flex-col gap-y-[12px]'>
          {fileList.map((file)=>(
            <div className='w-full flex items-center gap-[12px]' key={file.id} data-id={file.id} onClick={handleSelect}>
              <Checkbox value={file.id} ><></></Checkbox>
              <TaskItem data={file} />
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </ScrollArea>
  );
}

export default memo(TaskList);
