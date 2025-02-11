import {memo} from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown,MousePointer2 } from 'lucide-react';

export interface ToolbarSelectProps {

}

function ToolbarSelect(props: ToolbarSelectProps) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon">
        <MousePointer2 className="w-4 h-4" />
        <ChevronDown className="w-2 h-2" />
      </Button>
    </div>
  )
}

export default memo(ToolbarSelect);