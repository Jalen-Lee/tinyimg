import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
import i18next from 'i18next';
import { initReactI18next,useTranslation } from 'react-i18next';
import { load } from '@tauri-apps/plugin-store';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      'en-US': typeof enUS;
      'zh-CN': typeof zhCN;
    };
    returnNull: false;
  }
}

export const useI18n = () => {
  const { t } = useTranslation();
  return (key: keyof typeof enUS, options?: Parameters<typeof t>[2]) => {
    // @ts-ignore
    return t(key, options);
  }
};

(async function () {
  await i18next.use(initReactI18next).init({
    lng: 'en-US',
    fallbackLng: 'en-US',
    resources: {
      'en-US': { translation: enUS },
      'zh-CN': { translation: zhCN }
    },
    interpolation: {
      escapeValue: false
    }
  });
  const settingStore = await load('settings.json', { autoSave: false });
  const uaLang = window.navigator.language || 'en-US';
  const settingLang = await settingStore.get<string>('language');
  if(settingLang){
    i18next.changeLanguage(settingLang);
  }else{
    i18next.changeLanguage(uaLang);
    await settingStore.set('language', uaLang);
    await settingStore.save();
  }
})();
