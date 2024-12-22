import { memo } from 'react';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';

interface ImagePreviewProps{
  currentFileId: FileInfo['id']
}

function ImagePreview(props:ImagePreviewProps){
  const { currentFileId } = props;
  const {
    getFileById
  } = useAppStore(useSelector(['getFileById']))
  const file = getFileById(currentFileId)

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='h-[30px] border-b border-gray-200 flex justify-between items-center px-[12px] relative'>
        <div className='max-w-[50%] text-nowrap overflow-hidden truncate'>
          {file?.name}
        </div>
      </div>
      <div className='flex-1 overflow-hidden flex justify-center items-center'>
        <img src={file?.assetPath} className='h-[70%] object-contain' />
      </div>
    </div>
  )
}

export default memo(ImagePreview);