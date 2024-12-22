import { memo } from 'react';
import { Button } from 'antd';
import ImagePreview from '../image-preview';

interface ViewerProps{
  currentFileId: FileInfo['id']
}

function Viewer(props:ViewerProps){
  const {
    currentFileId
  } = props

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='flex-1 overflow-hidden'>
        <ImagePreview currentFileId={currentFileId} />
      </div>
    </div>
  )
}

export default memo(Viewer);