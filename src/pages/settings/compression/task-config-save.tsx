import { memo } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import { Input } from '@/components/ui/input';
import { SettingsKey } from '@/constants';
import { debounce } from 'radash';
import { Switch } from '@/components/ui/switch';

function SettingsCompressionTaskConfigSave() {
  const t = useI18n();
  const {settings,setSettings} = useAppStore(useSelector(['settings','setSettings']));

  const handleValueChange = debounce({ delay: 1000 }, (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSettings(SettingsKey['settings.compression.task_config.concurrency'], value);
  });
  
  return (
    <>
      <CardHeader className="flex flex-row justify-between gap-x-10">
        <div>
          <CardTitle className="text-lg">{t('settings.compression.task_config.quick_save.title')}</CardTitle>
          <CardDescription>{t('settings.compression.task_config.quick_save.description')}</CardDescription>
        </div>
        <Switch  onCheckedChange={() => {}} />
      </CardHeader>
      <CardHeader className="flex flex-row justify-between gap-x-10">
        <div>
          <CardTitle className="text-lg">{t('settings.compression.task_config.save_compress_rate.title')}</CardTitle>
          <CardDescription>{t('settings.compression.task_config.save_compress_rate.description')}</CardDescription>
        </div>
        <div className='flex items-center gap-x-2'>
          <Switch onCheckedChange={() => {}} />
          <Input 
            type="number" 
            defaultValue={settings.get(SettingsKey['settings.compression.task_config.save_compress_rate'])} 
            onChange={handleValueChange} 
            className="w-[180px]"
            min={1}
            max={100}
          />
        </div>
      </CardHeader>
    </>
  );
}

export default memo(SettingsCompressionTaskConfigSave);