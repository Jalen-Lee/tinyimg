import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../../i18n';
import {memo} from 'react'
import useAppStore from '../../../store/app.store';
import useSelector from '@/hooks/useSelector';

const languages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English(US)' },
]

export default memo(function SettingsGeneralLanguage() {
  const { i18n } = useTranslation();
  const t = useI18n();
  const {getSettings,setSettings} = useAppStore(useSelector(['getSettings','setSettings']));
  const handleChangeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    setSettings('language', value);
  }
  return (
    <Card >
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle className="text-lg">{t('settings.general.language')}</CardTitle>
          <CardDescription>{t('settings.general.language.description')}</CardDescription>
        </div>
        <Select defaultValue={getSettings('language')} onValueChange={handleChangeLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      {/* <CardContent>
      </CardContent> */}
    </Card>
  );
});