import { Separator } from '@/components/ui/separator';
import { SettingsHeader } from '../header';
import Language from './language';
import { useI18n } from '../../../i18n';

export default function SettingsGeneral() {
  const t = useI18n();
  return (
    <div className="space-y-6 h-full overflow-auto px-6">
      <SettingsHeader
        heading={t('general')}
        text={t('general.description')}
      />
      <Separator />
      <Language />
    </div>
  );
}
