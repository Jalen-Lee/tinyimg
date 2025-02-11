import { memo } from 'react';
import ToolbarCompress from './toolbar-compress';
import { Separator } from '@radix-ui/themes';
import ToolbarReset from './toolbar-reset';
import ToolbarSelect from './toolbar-select'; 

export interface ToolbarProps {

}

function Toolbar(props: ToolbarProps){
  
  return (
    <div className="max-w-sm mx-auto p-2 bg-white rounded-xl border shadow-lg">
      <div className="flex justify-center items-center gap-2">
        <ToolbarSelect />
        <Separator orientation="vertical" />
        <ToolbarCompress />
        <Separator orientation="vertical" />
        <ToolbarReset />
      </div>
    </div>
  )
}

export default memo(Toolbar)