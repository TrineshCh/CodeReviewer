import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Review } from '@/types';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { timeAgo } from '@/utils/formatDate';
import { users } from '@/mock/users';
import { FiCheck, FiX } from 'react-icons/fi';

interface FeedbackCardProps {
  review: Review;
  taskTitle?: string;
}

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

export const FeedbackCard = ({ review, taskTitle }: FeedbackCardProps) => {
  const admin = users.find((u) => u.id === review.adminId);
  const isApproved = review.decision === 'completed';

  return (
    <Card>
      <CardContent className="px-6 py-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            {taskTitle && <p className="text-[15px] font-medium truncate">{taskTitle}</p>}
            <p className="text-[13px] text-muted-foreground">
              {admin?.name || 'Unknown'} &middot; {timeAgo(review.reviewedAt)}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={`shrink-0 gap-1 text-[13px] border-0 ${isApproved
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
            }`}
          >
            {isApproved ? <FiCheck className="h-3.5 w-3.5" /> : <FiX className="h-3.5 w-3.5" />}
            {isApproved ? 'Approved' : 'Rejected'}
          </Badge>
        </div>

        <p className="text-[15px] text-muted-foreground mb-3 leading-relaxed">{review.feedback}</p>

        <div className="flex gap-4 flex-wrap">
          {Object.entries(review.scores).map(([tech, score]) => (
            <div key={tech} className="flex items-center gap-1.5">
              <span className="text-[13px] text-muted-foreground">{TECH_STACK_LABELS[tech] || tech}</span>
              <span className={`text-[13px] font-bold tabular-nums ${scoreColor(score)}`}>{score}/10</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
