import { Separator } from '@/components/ui/separator';
import { SettingsHeader } from '../header';
import TinyPng from './tinypng';
import TaskConfig from './task-config';
import Metadata from './metadata';
import { useI18n } from '@/i18n';

export default function SettingsCompression() {
  const t = useI18n();
  return (
    <div className="space-y-6 h-full overflow-auto px-6">
      <SettingsHeader
        heading={t('settings.compression.title')}
        text={t('settings.compression.description')}
      />
      <Separator />
      <TinyPng />
      <TaskConfig />
      <Metadata />
    </div>
  );
}

