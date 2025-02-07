import { memo } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import { Input } from '@/components/ui/input';
import { SettingsKey } from '@/constants';
import { debounce } from 'radash';

function SettingsCompressionTaskConfigConcurrency() {
  const t = useI18n();
  const {settings,setSettings} = useAppStore(useSelector(['settings','setSettings']));

  const handleValueChange = debounce({ delay: 1000 }, (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSettings(SettingsKey['settings.compression.task_config.concurrency'], value);
  });
  
  return (
    <CardHeader className="flex flex-row justify-between gap-x-10">
      <div>
        <CardTitle className="text-lg">{t('settings.compression.task_config.concurrency.title')}</CardTitle>
        <CardDescription>{t('settings.compression.task_config.concurrency.description')}</CardDescription>
      </div>
      <Input 
        type="number" 
        defaultValue={settings.get(SettingsKey['settings.compression.task_config.concurrency'])} 
        onChange={handleValueChange} 
        className="w-[180px]"
        min={1}
        max={10}
      />
    </CardHeader>
  );
}

export default memo(SettingsCompressionTaskConfigConcurrency);