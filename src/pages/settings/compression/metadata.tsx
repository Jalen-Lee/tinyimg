import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import { SettingsKey, SettingsCompressionTaskConfigMetadata } from '@/constants';
import { debounce } from 'radash';

import { CheckboxGroup } from '@radix-ui/themes';

function SettingsCompressionMetadata() {
  const t = useI18n();
  const {settings,setSettings} = useAppStore(useSelector(['settings','setSettings']));
  const metadata = settings.get(SettingsKey['settings.compression.task_config.metadata']) || [];

  const handleValueChange = debounce({ delay: 1000 }, (value: string[]) => {
    setSettings(SettingsKey['settings.compression.task_config.metadata'], value);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-x-10 items-center">
        <div>
          <CardTitle className="text-lg">{t('settings.compression.task_config.metadata.title')}</CardTitle>
          <CardDescription>{t('settings.compression.task_config.metadata.description')}</CardDescription>
        </div>
        <div>
          <CheckboxGroup.Root defaultValue={metadata} color="gray" highContrast onValueChange={handleValueChange}>
            <CheckboxGroup.Item value={SettingsCompressionTaskConfigMetadata.copyright}>{t('settings.compression.task_config.metadata.copyright')}</CheckboxGroup.Item>
            <CheckboxGroup.Item value={SettingsCompressionTaskConfigMetadata.creator}>{t('settings.compression.task_config.metadata.creator')}</CheckboxGroup.Item>
            <CheckboxGroup.Item value={SettingsCompressionTaskConfigMetadata.location}>{t('settings.compression.task_config.metadata.location')}</CheckboxGroup.Item>
          </CheckboxGroup.Root>
        </div>
      </CardHeader>
    </Card>
  );
}

export default memo(SettingsCompressionMetadata);