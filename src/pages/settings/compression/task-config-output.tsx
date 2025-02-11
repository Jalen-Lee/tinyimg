import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import useSettingsStore from '@/store/settings';
import useSelector from '@/hooks/useSelector';
import { Input } from '@/components/ui/input';
import { SettingsKey, SettingsCompressionTaskConfigOutputMode } from '@/constants';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { open } from '@tauri-apps/plugin-dialog';
import { debounce } from 'radash';
import { Tooltip } from '@radix-ui/themes';
import { openPath } from '@tauri-apps/plugin-opener';


function SettingsCompressionTaskConfigOutput() {
  const t = useI18n();
  const { 
    compression_tasks_output_mode: outputMode,
    compression_tasks_output_mode_save_as_file_suffix: saveAsFileSuffix,
    compression_tasks_output_mode_save_to_folder: saveToFolder,
    set
  } = useSettingsStore(useSelector([
    SettingsKey.compression_tasks_output_mode,
    SettingsKey.compression_tasks_output_mode_save_as_file_suffix,
    SettingsKey.compression_tasks_output_mode_save_to_folder,
    'set'
  ]));

  const languages = [
    { value: SettingsCompressionTaskConfigOutputMode.overwrite, label: t('settings.compression.task_config.output.mode.overwrite') },
    { value: SettingsCompressionTaskConfigOutputMode.save_as_new_file, label: t('settings.compression.task_config.output.mode.new_file') },
    { value: SettingsCompressionTaskConfigOutputMode.save_to_new_folder, label: t('settings.compression.task_config.output.mode.new_folder') },
  ]

  const handleModeChange = (value: SettingsCompressionTaskConfigOutputMode) => {
    set(SettingsKey.compression_tasks_output_mode, value);
  }

  const handleSuffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(SettingsKey.compression_tasks_output_mode_save_as_file_suffix, e.target.value);
  }

  const handleChooseFolder = async () => {
    const file = await open({
      multiple: false,
      directory: true,
    });
    if(file){
      set(SettingsKey.compression_tasks_output_mode_save_to_folder, file);
    }
  }

  return (
    <>
      <CardHeader className="flex flex-row justify-between gap-x-10">
        <div>
          <CardTitle className="text-lg">{t('settings.compression.task_config.output.title')}</CardTitle>
          <CardDescription>{t('settings.compression.task_config.output.description')}</CardDescription>
        </div>
        <Select value={outputMode} onValueChange={handleModeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue/>
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
      {
        outputMode === SettingsCompressionTaskConfigOutputMode.save_as_new_file && (
          <CardHeader>
            <div className="flex justify-between gap-x-10 items-center">
              <div>
                <CardTitle className="text-lg">{t('settings.compression.task_config.output.mode.new_file.title')}</CardTitle>
                <CardDescription>{t('settings.compression.task_config.output.mode.new_file.description')}</CardDescription>
              </div>
              <Input 
                type="text" 
                placeholder={t('settings.compression.task_config.output.mode.new_file.title')} 
                className="w-[180px]"
                defaultValue={saveAsFileSuffix || ''}
                onChange={debounce({delay: 1000}, handleSuffixChange)}
              />
            </div>
          </CardHeader>
        )
      }
      {
        outputMode === SettingsCompressionTaskConfigOutputMode.save_to_new_folder && (
          <CardHeader>
            <div className="flex justify-between gap-x-10 items-center">
              <div>
                <CardTitle className="text-lg">{t('settings.compression.task_config.output.mode.new_folder.title')}</CardTitle>
                <CardDescription>{t('settings.compression.task_config.output.mode.new_folder.description')}</CardDescription>
              </div>
              <div className="flex flex-col gap-y-2 items-end">
                <Button className='w-[auto]' size={'sm'} onClick={handleChooseFolder}>{t('settings.compression.task_config.output.mode.new_folder.choose')}</Button>
                <Tooltip content={saveToFolder} side="bottom">
                  <p onClick={() => openPath(saveToFolder)} className="cursor-pointer underline text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px]">{saveToFolder}</p>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
        )
      }
    </>
  );
}

export default memo(SettingsCompressionTaskConfigOutput);