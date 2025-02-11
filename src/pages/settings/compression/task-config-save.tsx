import { memo } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import useSettingsStore from '@/store/settings';
import useSelector from '@/hooks/useSelector';
import { Input } from '@/components/ui/input';
import { SettingsKey } from '@/constants';
import { debounce } from 'radash';
import { Switch } from '@/components/ui/switch';

function SettingsCompressionTaskConfigSave() {
  const t = useI18n();
  const {
    compression_quick_save: quickSave,
    compression_tasks_save_compress_rate_limit: hasLimit,
    compression_tasks_save_compress_rate_limit_threshold: threshold,
    set
  } = useSettingsStore(useSelector([
    SettingsKey.compression_quick_save,
    SettingsKey.compression_tasks_save_compress_rate_limit,
    SettingsKey.compression_tasks_save_compress_rate_limit_threshold,
    'set'
  ]));

  const handleQuickSaveChange = (checked: boolean) => {
    set(SettingsKey.compression_quick_save, checked);
  };

  const handleLimitChange = (checked: boolean) => {
    set(SettingsKey.compression_tasks_save_compress_rate_limit, checked);
  }

  const handleThresholdChange = debounce({ delay: 1000 }, (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    set(SettingsKey.compression_tasks_save_compress_rate_limit_threshold, value);
  });
  
  return (
    <>
      <CardHeader className="flex flex-row justify-between gap-x-10">
        <div>
          <CardTitle className="text-lg">{t('settings.compression.task_config.quick_save.title')}</CardTitle>
          <CardDescription>{t('settings.compression.task_config.quick_save.description')}</CardDescription>
        </div>
        <Switch checked={quickSave} onCheckedChange={handleQuickSaveChange} />
      </CardHeader>
      <CardHeader className="flex flex-row justify-between gap-x-10">
        <div>
          <CardTitle className="text-lg">{t('settings.compression.task_config.save_compress_rate.title')}</CardTitle>
          <CardDescription>{t('settings.compression.task_config.save_compress_rate.description')}</CardDescription>
        </div>
        <div className='flex items-center gap-x-2'>
          {
            hasLimit && (
              <Input 
                type="number" 
                defaultValue={threshold} 
                onChange={handleThresholdChange} 
                className="w-[180px]"
                min={1}
                max={100}
              />
            )
          }
          <Switch checked={hasLimit} onCheckedChange={handleLimitChange} />
        </div>
      </CardHeader>
    </>
  );
}

export default memo(SettingsCompressionTaskConfigSave);