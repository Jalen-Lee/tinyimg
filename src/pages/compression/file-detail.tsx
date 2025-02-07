import { memo } from 'react';
import { Button } from 'antd';
import FilePreview from './file-preview';

interface FileDetailProps{

}

function FileDetail(props:FileDetailProps){


  return (
    <div className='w-full h-full flex flex-col pt-6'>
      <div className='flex-1 overflow-hidden'>
        <FilePreview/>
      </div>
    </div>
  )
}

export default memo(FileDetail);