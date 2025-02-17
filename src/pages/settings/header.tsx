import { cn } from '@/lib/utils';
import { memo } from 'react';
interface SettingsHeaderProps {
  heading: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SettingsHeader = memo(function SettingsHeader({ heading, text, className, children }: SettingsHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="grid gap-1">
          <h1 className="font-heading text-xl font-bold">{heading}</h1>
          {text && <p className="text-md font-light text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
    );
  }
);

SettingsHeader.displayName = 'SettingsHeader';
