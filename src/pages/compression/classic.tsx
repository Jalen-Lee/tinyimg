import {memo} from 'react';
import FileManager from './file-manager';

function CompressionClassic(){
  return (
    <div className="h-full">
      <FileManager/>
    </div>
  )
}

export default memo(CompressionClassic)