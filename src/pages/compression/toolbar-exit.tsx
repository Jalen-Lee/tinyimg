import {memo} from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import useCompressionStore from '@/store/compression';
import useSelector from "@/hooks/useSelector";


function ToolbarExit() {

  const {reset,inCompressing,inSaving} = useCompressionStore(useSelector([
    'reset','inCompressing','inSaving'
  ]))

  const handleExit = () => {
    if(inCompressing || inSaving) return;
    reset();
  }

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleExit}
      disabled={inCompressing || inSaving}
    >
      <LogOut className="w-4 h-4" />
    </Button>
  )
}

export default memo(ToolbarExit);