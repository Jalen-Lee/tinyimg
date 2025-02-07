import {memo,useRef} from 'react'
import { Splitter,notification } from 'antd';
import TaskList from './tasks-list';
import FileDetail from './file-detail';
import ActionsButton from './actions-button';
import { TaskListRef } from './tasks-list';

function ProcessFile(){
  const tasksListRef = useRef<TaskListRef>(null)

  return (
    <div className='w-full h-full'>
      <Splitter className='h-[calc(100%-48px)]'>
        <Splitter.Panel defaultSize={300} min={200} max={500} collapsible>
          <TaskList ref={tasksListRef}/>
        </Splitter.Panel>
        <Splitter.Panel>
          <FileDetail/>
        </Splitter.Panel>
      </Splitter>
      <div className='h-[48px] border-t border-gray-200 flex justify-between items-center px-3'>
        <div className='h-full flex items-center'>
          {/* <Button variant='ghost' size='icon'>
            <LogOut className='w-4 h-4 rotate-180'/>
          </Button> */}
        </div>
        <div className='h-full flex items-center gap-x-2'>
          <ActionsButton tasksListRef={tasksListRef}/>
        </div>
      </div>
    </div>
  )
}

export default memo(ProcessFile)