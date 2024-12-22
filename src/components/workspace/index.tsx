import {memo,useState} from 'react'
import { Splitter,Button,notification } from 'antd';
import { SettingOutlined,FileAddOutlined } from '@ant-design/icons';
import TaskList from './components/task-list';
import Detail from './components/viewer';
import SettingPanel from '../setting-panel';
import Processor,{ProcessorTask} from '@/utils/processor';
import useSelector from '@/hooks/useSelector';
import useAppStore from '@/store/app.store';

function Workspace(){
  const [currentFile,setCurrentFile] = useState<FileInfo['id']>('')
  const [selectedFiles,setSelectedFiles] = useState<Array<FileInfo['id']>>([])
  const {getFileById} = useAppStore(useSelector(['getFileById']));
  
  const handleCompress = async () => {
    console.log("handleCompress")
    const processor = new Processor()
    const result = await processor
    .setTasks(selectedFiles.map(file=>{
      const fileInfo = getFileById(file)
      if(fileInfo){
        return {
          path:fileInfo.path,
          mime:fileInfo.mimeType,
          ext:fileInfo.ext
        }
      }
    }).filter(Boolean) as ProcessorTask[])
    .setFulfilledCb((res)=>{
      console.log("压缩完成",res)
    })
    .setRejectedCb((err)=>{
      console.log("压缩失败",err)
    })
    .run()
    console.log("压缩全部完成",result)
  }


  return (
    <section className="h-full">
      <Splitter className='h-[calc(100%-48px)]'>
        <Splitter.Panel defaultSize={300} min={200} max={500} collapsible>
          <TaskList onSelect={setCurrentFile} onChange={setSelectedFiles} />
        </Splitter.Panel>
        <Splitter.Panel>
          <Detail currentFileId={currentFile} />
        </Splitter.Panel>
      </Splitter>
      <div className='bg-[#fbfcfc] w-full h-[48px] border-t border-gray-200 flex justify-between items-center px-[12px]'>
        <div className='flex items-center gap-2'>

        </div>
        <div className='flex items-center gap-2'>
          {/* <Button color="default" size='middle' icon={<SettingOutlined />}/> */}
          {/* <Button color="default"  size='middle' icon={<FileAddOutlined />}/> */}
          <SettingPanel />
          <Button color="default" variant="solid" size='middle' onClick={handleCompress}>
            Compress
          </Button>
          <Button color="default" variant="solid" size='middle' disabled>
            Save
          </Button>
        </div>
      </div>
    </section>
  )
}

export default memo(Workspace);