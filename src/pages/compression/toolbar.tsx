import { memo } from 'react';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import CompressButton from './toolbar-compress';

export interface ToolbarProps {

}

function Toolbar(props: ToolbarProps){
  const {selectedFiles} = useCompressionStore(useSelector(['selectedFiles']))
  
  return (
    <div className="max-w-sm mx-auto p-2 bg-white rounded-xl border shadow-lg">
      <div className="flex justify-center items-center gap-2">

        {/* <Button
          size="icon"
        >
          <Save className="h-4 w-4" />
        </Button> */}

        <CompressButton />
      </div>
    </div>
  )
}

export default memo(Toolbar)