import {memo,useEffect,useState,useMemo,useReducer} from 'react';
import FileCard from './file-card';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import Toolbar from './toolbar';
import { CheckboxGroup } from '@radix-ui/themes';
import ToolbarPagination from './toolbar-pagination';
import { Empty } from 'antd';
import { isValidArray } from '@/utils';

export interface FileManagerProps {

}

const DEFAULT_PAGE_SIZE = 100;

function FileManager(props: FileManagerProps){
  const {files,selectedFiles,setSelectedFiles,inCompressing,inSaving} = useCompressionStore(useSelector([
    'files','selectedFiles','setSelectedFiles','inCompressing','inSaving'
  ]))

  const [pageIndex,setPageIndex] = useState(1);
  const [pageSize,setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const dataList = useMemo(()=>{
    let list = files.slice((pageIndex-1)*pageSize,pageIndex * pageSize)
    if(list.length === 0 && pageIndex !== 1){
      list = files.slice((pageIndex-2)*pageSize,(pageIndex - 1) * pageSize)
      setPageIndex(pageIndex - 1)
    }
    return list;
  },[files,pageIndex,pageSize])
  
  return (
    <div className="h-full relative flex flex-col items-center">
      {
        isValidArray(dataList) ? (
          <>
            <CheckboxGroup.Root 
              className="flex-1 p-4 w-full" 
              value={selectedFiles} 
              highContrast 
              color="gray" 
              onValueChange={setSelectedFiles} 
              disabled={inCompressing || inSaving}
            >
              <div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 contain-layout"
                style={{
                  contentVisibility:"auto"
                }}
              >
                {
                  dataList.map((file) => (
                    <FileCard 
                      key={file.id} 
                      id={file.id}
                    />
                  ))
                }
              </div>
            </CheckboxGroup.Root>
          </>
        ): <div className="flex-1 flex items-center justify-center"><Empty description={false} /></div>
      }
      <div className="sticky bottom-2 flex flex-col gap-1">
        {
          files.length > pageSize && (
            <ToolbarPagination 
              total={files.length} 
              current={pageIndex}        
              pageSize={pageSize} 
              onChange={(pageIndex,pageSize)=>{
                if(pageIndex){
                  setPageIndex(pageIndex)
                }
                if(pageSize){
                  setPageSize(pageSize)
                }
              }} 
            />
          )
        }
        <Toolbar/>
      </div>
    </div>
  )
}

export default memo(FileManager)