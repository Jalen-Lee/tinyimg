import { Outlet } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './sidebar-nav';
import { Settings2, FileArchive, ListRestart } from 'lucide-react';
import { useI18n } from '../../i18n';
import { Button,buttonVariants } from '@/components/ui/button';
import useSettingsStore from '@/store/settings';
import useSelector from '@/hooks/useSelector';
import { Popconfirm } from 'antd';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { sleep } from '@/utils';
import { toast } from 'sonner';


export default function SettingsLayout() {
  const t = useI18n();
  const navigate = useNavigate();
  const { reset } = useSettingsStore(useSelector([
    'reset'
  ]));
  const sidebarNavItems = [
    {
      title: t('general'),
      href: '/settings/general',
      icon: <Settings2 />,
    },
    {
      title: t('compression'),
      href: '/settings/compression',
      icon: <FileArchive />,
    },
  ];

  return (
    <div className="py-6 h-full flex flex-col">
      <div className="space-y-0.5 px-6 gap-x-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('settings')}</h2>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>
        <div className='flex items-center gap-x-2'>
          <Popconfirm
            title={t('settings.reset_all_confirm')}
            onConfirm={async () => {
              await sleep(1000);
              await reset();
              toast.success(t('tips.settings_reset_success'));
            }}
            destroyTooltipOnHide
            align={{
              offset: [-25, -10]
            }}
            showCancel={false}
            okButtonProps={{
              variant: 'text',
              type: 'text',
              className: cn(buttonVariants({ variant: 'default' }), 'h-7')
            }}
          >
            <Button variant="default" size='sm'>
              <ListRestart className="w-5 h-5" />
              {t('settings.reset_all')}
            </Button>
          </Popconfirm>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex-1 flex flex-col space-y-8 lg:flex-row lg:space-y-0 overflow-auto">
        <aside className="lg:w-1/6 px-6">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 w-full mx-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
