import { memo,useEffect,useState } from 'react';
import useAppStore from '@/store/app.store';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import { Event } from '@/constants';


interface FilePreviewProps{

}

function FilePreview(props:FilePreviewProps){
  const {
    getFile
  } = useCompressionStore(useSelector(['getFile']))
  const {eventEmitter} = useAppStore(useSelector(['eventEmitter']))
  const [currentFile,setCurrentFile] = useState<FileInfo | undefined>(undefined)


  useEffect(()=>{
    eventEmitter.on(Event['Compress.detail'],(id:string)=>{
      const file = getFile(id)
      file && setCurrentFile(file)
    })
  },[])


  return (
    <div className='w-full h-full flex flex-col'>
      <div className='h-[30px] border-b border-gray-200 flex justify-between items-center px-[12px] relative'>
        <div className='max-w-[50%] text-nowrap overflow-hidden truncate'>
          {currentFile?.name}
        </div>
      </div>
      <div className='flex-1 overflow-hidden flex justify-center items-center'>
        <img src={currentFile?.assetPath} className='object-contain' />
      </div>
    </div>
  )
}

export default memo(FilePreview);