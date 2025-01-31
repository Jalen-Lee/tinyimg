import { Separator } from '@/components/ui/separator';
import { SettingsHeader } from '../header';
import SettingsGeneralLanguage from './language';
import { useI18n } from '../../../i18n';

export default function SettingsGeneral() {
  const t = useI18n();
  return (
    <div className="space-y-6">
      <SettingsHeader
        heading={t('general')}
        text={t('general.description')}
      />
      <Separator />
      <SettingsGeneralLanguage />
    </div>
  );
}
