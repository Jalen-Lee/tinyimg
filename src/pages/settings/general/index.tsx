import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { SettingsHeader } from '../header';
import Language from './language';
import Notification from './notification';
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
      <Card>
        <Language />
        <Notification />
      </Card>
    </div>
  );
}
