import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { timeAgo } from '@/utils/formatDate';

interface TaskCardProps {
  task: Task;
  basePath: string;
  showEmployee?: boolean;
  employeeName?: string;
}

export const TaskCard = ({ task, basePath, showEmployee, employeeName }: TaskCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-sm transition-shadow"
      onClick={() => navigate(`${basePath}/${task.id}`)}
    >
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="text-[15px] font-semibold truncate flex-1">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>

        {showEmployee && employeeName && (
          <p className="text-[13px] text-muted-foreground mb-0.5">{employeeName}</p>
        )}
        <p className="text-[13px] text-muted-foreground/70 line-clamp-1 mb-2.5">{task.description}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {task.techStacks.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5 font-normal text-muted-foreground">
                {TECH_STACK_LABELS[tech] || tech}
              </Badge>
            ))}
            {task.techStacks.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal text-muted-foreground">
                +{task.techStacks.length - 3}
              </Badge>
            )}
          </div>
          <span className="text-[13px] text-muted-foreground/60 shrink-0">{timeAgo(task.submittedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
