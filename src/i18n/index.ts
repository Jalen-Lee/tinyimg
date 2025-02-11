import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import i18next from 'i18next';
import { initReactI18next,useTranslation } from 'react-i18next';
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

i18next.use(initReactI18next).init({
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
