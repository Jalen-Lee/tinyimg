import {memo} from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';


export interface ToolbarResetProps {

}

function ToolbarReset(props: ToolbarResetProps) {
  return (
    <Button variant="ghost" size="icon">
      <LogOut className="w-4 h-4" />
    </Button>
  )
}

export default memo(ToolbarReset);