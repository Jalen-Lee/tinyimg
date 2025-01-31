interface SettingsHeaderProps {
  heading: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function SettingsHeader({
  heading,
  text,
  className = "",
  children,
}: SettingsHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="grid gap-1">
        <h1 className="font-heading text-xl font-bold">{heading}</h1>
        {text && (
          <p className="text-md font-light text-muted-foreground">{text}</p>
        )}
      </div>
      {children}
    </div>
  );
}
