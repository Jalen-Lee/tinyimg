import {memo} from 'react';
import FileManager from './file-manager';

function FileExplorer(){
  return (
    <div className="h-full">
      <FileManager/>
    </div>
  )
}

export default memo(FileExplorer)