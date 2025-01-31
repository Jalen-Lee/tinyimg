import { Outlet } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './sidebar-nav';
import { Settings2, FileArchive } from 'lucide-react';
import { useI18n } from '../../i18n';
export default function SettingsLayout() {
  const t = useI18n();
  const sidebarNavItems = [
    {
      title: t('general'),
      href: 'general',
      icon: <Settings2 />,
    },
    {
      title: t('compression'),
      href: 'compression',
      icon: <FileArchive />,
    },
  ];

  return (
    <>
      <div className="block p-6 w-full">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{t('settings')}</h2>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
