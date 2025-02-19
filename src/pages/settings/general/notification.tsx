import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../../i18n';
import {memo} from 'react'
import useSettingsStore from '../../../store/settings';
import useSelector from '@/hooks/useSelector';
import { SettingsKey } from '@/constants';
import { Switch } from '@/components/ui/switch';
import {
  isPermissionGranted,
  requestPermission,
} from '@tauri-apps/plugin-notification';

export default memo(function SettingsGeneralNotification() {
  const { i18n } = useTranslation();
  const t = useI18n();
  const {system_notification,set} = useSettingsStore(useSelector([SettingsKey.system_notification,'set']));

  const handleChangeNotification = async (value: boolean) => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      set(SettingsKey.system_notification,value);
    }
  }

  return (
    <CardHeader className="flex flex-row justify-between">
      <div>
        <CardTitle className="text-lg">{t('settings.general.notification.title')}</CardTitle>
        <CardDescription>{t('settings.general.notification.description')}</CardDescription>
      </div>
      <Switch checked={system_notification} onCheckedChange={handleChangeNotification} />
    </CardHeader>
  );
});