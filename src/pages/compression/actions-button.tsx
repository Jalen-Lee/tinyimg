import { memo,useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {TaskListRef} from './tasks-list';
import { useI18n } from '@/i18n';
import {Save,Sparkles} from 'lucide-react'
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import useCompressionStore from '@/store/compression';

interface ActionsButtonProps{
  tasksListRef:React.RefObject<TaskListRef>
}

function ActionsButton(props:ActionsButtonProps){
  const {tasksListRef} = props;
  const t = useI18n();
  const {eventEmitter} = useAppStore(useSelector(['eventEmitter']))
  const {selectedFiles,fileMap} = useCompressionStore(useSelector(['selectedFiles','fileMap']))

  const handleSave = () => {
   

  }

  const handleCompress = () => {

  }

  

  return (
    <div className='flex items-center gap-x-2'>
      <Button size='sm' onClick={handleSave}>
        <Save className='w-4 h-4'/>
        {t('page.compression.process.actions.save')}
      </Button>
      <Button size='sm' onClick={handleCompress} disabled={!selectedFiles.length}>
        <Sparkles className='w-4 h-4'/>
        {t('page.compression.process.actions.compress')}
      </Button>
    </div>
  )
}

export default memo(ActionsButton)