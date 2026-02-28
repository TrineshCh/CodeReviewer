import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS } from '@/utils/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'severity';
}

const statusVariants: Record<string, string> = {
  'pending-analysis': 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  'under-review': 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  completed: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  rejected: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
};

const severityVariants: Record<string, string> = {
  high: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
  medium: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
  low: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
};

export const StatusBadge = ({ status, type = 'status' }: StatusBadgeProps) => {
  const variants = type === 'status' ? statusVariants : severityVariants;
  const label = type === 'status' ? STATUS_LABELS[status] || status : status;

  return (
    <Badge variant="secondary" className={cn('font-medium text-[13px] border-0', variants[status])}>
      {label}
    </Badge>
  );
};
