import {memo} from 'react';
import FileCard from './file-card';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import Toolbar from './toolbar';
import { CheckboxGroup } from '@radix-ui/themes';
export interface FileManagerProps {

}

function FileManager(props: FileManagerProps){
  const {files,selectedFiles,setSelectedFiles} = useCompressionStore(useSelector(['files','selectedFiles','setSelectedFiles']))

  const handleSelect = (value:string[])=>{
    setSelectedFiles(value)
  }

  return (
    <div className="h-full relative flex flex-col">
      <CheckboxGroup.Root className="flex-1 p-4" value={selectedFiles} highContrast color="gray" onValueChange={handleSelect}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 contain-layout">
          {
            files.map((file) => (
              <FileCard 
                key={file.id} 
                id={file.id}
                name={file.name}
                ext={file.ext}
                size={file.size}
                compressedSize={file.compressedSize}
                formatSize={file.formatSize}
                formatCompressedSize={file.formatCompressedSize}
                compressStatus={file.compressStatus}
                assetPath={file.assetPath}
                compressRate={file.compressRate}
              />
            ))
          }
        </div>
      </CheckboxGroup.Root>
      <div className="sticky bottom-2 left-0 right-0">
        <Toolbar />
      </div>
    </div>
  )
}

export default memo(FileManager)