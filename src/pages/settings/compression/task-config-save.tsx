import { memo } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import useSettingsStore from '@/store/settings';
import useSelector from '@/hooks/useSelector';
import { Input } from '@/components/ui/input';
import { SettingsKey } from '@/constants';
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

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    set(SettingsKey.compression_tasks_save_compress_rate_limit_threshold, value);
  }
  
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
                value={threshold} 
                onChange={handleThresholdChange} 
                className="w-[100px] h-7"
                min={0}
                max={1}
                step={0.1}
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