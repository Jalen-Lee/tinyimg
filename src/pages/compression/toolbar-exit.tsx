import {memo} from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import useCompressionStore from '@/store/compression';
import useSelector from "@/hooks/useSelector";
import { useNavigate } from 'react-router';


function ToolbarExit() {
  const navigate = useNavigate();
  const {reset,inCompressing,inSaving} = useCompressionStore(useSelector([
    'reset','inCompressing','inSaving'
  ]))

  const handleExit = () => {
    if(inCompressing || inSaving) return;
    reset();
    navigate('/compression/guide');
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