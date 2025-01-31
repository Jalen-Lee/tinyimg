import Logo from "@/assets/logo.png";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, useLocation } from 'react-router';
import { Button } from "@/components/ui/button";
import { Settings,House,Zap } from "lucide-react";
import { cn } from '@/lib/utils';
import { Tooltip } from "@radix-ui/themes";
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

const navigation: NavigationProps = {
  primary: [
    {
      icon: <House className="h-5 w-5" />,
      title: 'Home',
      href: '/',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Compression',
      href: '/compression',
    },
  ],
  secondary: [],
};


export default function SidebarNav() {
  const [showSetting, setShowSetting] = useState(false);

  const handleSetting = () => {
    setShowSetting(!showSetting);
  };

  return (
    <>
      <div
        className="h-screen w-[78px] flex-shrink-0 pt-12 pb-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-between"
        data-tauri-drag-region="true"
      >
        <div className="flex flex-col gap-2 justify-center items-center">
          <img
            className={`h-10 w-10 rounded-full bg-transparent shadow-lg duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(-180deg)]`}
            aria-hidden="true"
            src={Logo}
          />
          {navigation?.primary?.map((item) => NavItem({ item }))}
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <Link to="/settings" viewTransition>
            <Button variant="ghost" size="icon">
              <Settings size={20} className="shrink-0 !w-[20px] !h-[20px]"/>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

function NavItem({
  item,
  className,
  ...props
}: {
  item: NavLink;
  className?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  return (
    <Tooltip content={item.title} side="right">
      <Button
        key={item.title}
        variant={location.pathname === item.href ? 'secondary' : 'ghost'}
        asChild
        className={cn('h-12 justify-start', className)}
      >
        <Link key={item.title} to={item.href} title={item.title} viewTransition {...props}>
          {item.icon}
        </Link>
      </Button>
    </Tooltip>
  );
}