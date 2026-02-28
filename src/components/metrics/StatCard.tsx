interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ElementType;
  color: string;
  subtitle?: string;
}

const bgColors: Record<string, string> = {
  blue: 'bg-[hsl(214_30%_91%)] dark:bg-blue-950/40',
  green: 'bg-[hsl(100_25%_91%)] dark:bg-emerald-950/40',
  yellow: 'bg-[hsl(45_30%_91%)] dark:bg-amber-950/40',
  red: 'bg-[hsl(10_30%_92%)] dark:bg-red-950/40',
  purple: 'bg-[hsl(270_25%_92%)] dark:bg-purple-950/40',
};

export const StatCard = ({ label, value, color, icon: Icon }: StatCardProps) => {
  return (
    <div className={`rounded-xl px-4 py-4 ${bgColors[color] || 'bg-muted'}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground shrink-0" />}
        <div>
          <p className="text-[24px] font-bold tracking-tight tabular-nums text-foreground">{value}</p>
          <p className="text-[13px] text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
};
