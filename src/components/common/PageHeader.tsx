interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4 pb-1">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-[15px] text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
