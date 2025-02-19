import Logo from "@/assets/logo.png";
import { Link, useLocation } from 'react-router';
import { Button } from "@/components/ui/button";
import { Settings,House,Zap } from "lucide-react";
import { cn } from '@/lib/utils';
import { Tooltip } from "@radix-ui/themes";
import { useI18n } from '@/i18n';
import { memo } from 'react';
export interface NavLink {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavigationSection {
  title: string;
  buttons: NavLink[];
}

export interface NavigationProps {
  primary: NavLink[];
  secondary?: NavLink[];
}

export default memo(function SidebarNav() {
  const t = useI18n();
  const location = useLocation();

  const navigation: NavigationProps = {
    primary: [
      // {
      //   icon: <House className="h-5 w-5" />,
      //   title: t('nav.home'),
      //   href: '/home',
      // },
      {
        icon: <Zap className="h-5 w-5" />,
        title: t('nav.compression'),
        href: '/compression',
      },
    ],
    secondary: [],
  };

  return (
    <div
      className="h-screen w-[73px] flex-shrink-0 pt-12 pb-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-between"
      data-tauri-drag-region="true"
    >
      <div className="flex flex-col gap-2 justify-center items-center">
        <img
          className={`h-10 w-10 bg-transparent duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(-180deg)]`}
          aria-hidden="true"
          src={Logo}
        />
        {navigation?.primary?.map((item) => <NavItem item={item} key={item.href}/>)}
      </div>
      <div className="flex flex-col justify-center items-center">
        <Tooltip content={t('nav.settings')} side="right">
          <Link 
            to="/settings" 
            title={t('nav.settings')} 
            viewTransition 
            onClick={(event) => {
              if (location.pathname.startsWith("/settings")) {
                event.preventDefault();
              }
            }}
          >
            <Button
              variant='ghost'
              className={cn('h-12 justify-start',location.pathname.startsWith('/settings') ? 'bg-gray-100' : 'bg-muted')}
            >
              <Settings className="h-5 w-5"/>
            </Button>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
})

const NavItem = memo(function NavItem({
  item,
  className,
  ...props
}: {
  item: NavLink;
  className?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const preventDefault = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname.startsWith(item.href)) {
      event.preventDefault();
    }
  };
  return (
    <Tooltip content={item.title} side="right">
      <Link key={item.title} to={item.href} title={item.title} viewTransition onClick={preventDefault} {...props}>
        <Button
          key={item.title}
          variant='ghost'
          className={cn('h-12 justify-start',location.pathname.startsWith(item.href) ? 'bg-gray-100' : 'bg-muted', className)}
        >
          {item.icon}
        </Button>
      </Link>
    </Tooltip>
  );
});