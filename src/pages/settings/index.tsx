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
      <div className="space-y-0.5 px-6">
        <h2 className="text-2xl font-bold tracking-tight">{t('settings')}</h2>
        <p className="text-muted-foreground">{t('settings.description')}</p>
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
