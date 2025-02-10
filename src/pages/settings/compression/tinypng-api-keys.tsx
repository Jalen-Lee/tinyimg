import { CardHeader, CardContent, CardTitle,CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DataTable } from '@/components/data-table';
import { memo, useState,useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Trash, KeyRound } from 'lucide-react';
import useAppStore from '@/store/app.store';
import useSelector from '@/hooks/useSelector';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { debounce } from 'radash';
import { useI18n } from '@/i18n';
import { Trans } from 'react-i18next';
import { SETTINGS_FILE_NAME,SettingsKey } from '@/constants';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import dayjs from 'dayjs';
import {toast} from 'sonner';

const tinypngApiKeySchema = z.object({
  name: z.string().nonempty('Name is required'),
  api_key: z.string().nonempty('API Key is required'),
});

type TinypngApiKeyFormData = z.infer<typeof tinypngApiKeySchema>;

function SettingsCompressionTinyPngApiKeys() {
  const t = useI18n();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { settings, setSettings } = useAppStore(useSelector(['settings', 'setSettings']));
  const tinypngApiKeys = settings.get(SettingsKey['settings.compression.task_config.tinypng.api_keys']) || [];

  const form = useForm<TinypngApiKeyFormData>({
    resolver: zodResolver(tinypngApiKeySchema),
    defaultValues: {
      name: '',
      api_key: '',
    },
  });

  const handleSubmit = async (data: TinypngApiKeyFormData) => {
    if (tinypngApiKeys.findIndex((item: any) => item.name === data.name) !== -1) {
      form.setError('name', {
        type: 'manual',
        message: 'Name already exists',
      });
    }else if(tinypngApiKeys.findIndex((item: any) => item.api_key === data.api_key) !== -1){
      form.setError('api_key', {
        type: 'manual',
        message: 'API Key already exists',
      });
    }else {
      setSettings(SettingsKey['settings.compression.task_config.tinypng.api_keys'], [
        ...tinypngApiKeys,
        {
          ...data,
          created_at: Date.now(),
        }
      ]);
      setIsAddDialogOpen(false);
      form.reset();
      toast.success('API Key added successfully!')
    }
  };

  const handleDelete = (apiKey: string) => {
    const newApiKeys = tinypngApiKeys.filter((item: any) => item.api_key !== apiKey);
    setSettings(SettingsKey['settings.compression.task_config.tinypng.api_keys'], newApiKeys);
    toast.success('API Key deleted successfully!')
  }


  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      id: 'name',
      header: t('settings.compression.tinypng_api_keys.table.name'),
      cell: ({ row }) =>(
        <div>{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'api_key',
      id: 'api_key',
      header: t('settings.compression.tinypng_api_keys.table.api_key'),
      cell: ({ row }) => (
        <div className='cursor-pointer'>{row.original.api_key}</div>
      ),
    },
    {
      accessorKey: 'created_at',
      id: 'created_at',
      header: t('settings.compression.tinypng_api_keys.table.created_at'),
      cell: ({ row }) => (
        <div>{dayjs(Number(row.original.created_at)).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      header: t('settings.compression.tinypng_api_keys.table.actions'),
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => {
          handleDelete(row.original.api_key)
        }}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      )
    },
  ]

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between gap-10">
          <div>
            <CardTitle className="text-lg">{t('settings.compression.tinypng_api_keys.title')}</CardTitle>
            <CardDescription>
              {/* @ts-ignore */}
            <Trans i18nKey="settings.compression.tinypng_api_keys.description" components={{ 
              tinypng: <a target="_blank" href="https://tinypng.com/developers" className="text-blue-500 underline"/>, 
              here: <a target="_blank" href="https://tinypng.com/developers" className="text-blue-500 underline"/> 
            }}></Trans>
            </CardDescription>
          </div>
          <div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('settings.compression.tinypng_api_keys.form.add')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <DialogHeader>
                      <DialogTitle>{t('settings.compression.tinypng_api_keys.form.add_title')}</DialogTitle>
                      <DialogDescription>{t('settings.compression.tinypng_api_keys.form.add_description')}</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-4">
                      <div className='flex flex-col gap-2'>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings.compression.tinypng_api_keys.form.name')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={t('settings.compression.tinypng_api_keys.form.name_placeholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                      <FormField
                          control={form.control}
                          name="api_key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings.compression.tinypng_api_keys.form.api_key')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={t('settings.compression.tinypng_api_keys.form.api_key_placeholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          {t('settings.compression.tinypng_api_keys.form.cancel')}
                        </Button>
                      </DialogTrigger>
                      <Button type="submit">
                        <PlusCircle className="h-4 w-4" />
                        <span className="hidden sm:ml-2 sm:inline">{t('settings.compression.tinypng_api_keys.form.add')}</span>
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {
          Array.isArray(tinypngApiKeys) && tinypngApiKeys.length > 0 ? ( 
            <DataTable columns={columns} data={tinypngApiKeys}/>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
            <KeyRound className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">{t('settings.compression.tinypng_api_keys.no_api_keys')}</h3>
          </div>
          )
        }
      </CardContent>
    </>
  );
}


export default memo(SettingsCompressionTinyPngApiKeys);