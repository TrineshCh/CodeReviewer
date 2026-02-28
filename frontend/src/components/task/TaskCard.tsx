import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { timeAgo } from '@/utils/formatDate';
import { FiCode } from 'react-icons/fi';

interface TaskCardProps {
  task: Task;
  basePath: string;
  showEmployee?: boolean;
  employeeName?: string;
  className?: string;
}

export const TaskCard = ({ task, basePath, showEmployee, employeeName, className }: TaskCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className={`cursor-pointer hover:shadow-sm transition-shadow ${className || ''}`}
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <FiCode className="h-3 w-3" />
              Tech Stack:
            </div>
            {task.techStacks.slice(0, 3).map((tech) => {
              const techColors = {
                'react': 'bg-blue-100 text-blue-700 border-blue-200',
                'typescript': 'bg-blue-100 text-blue-700 border-blue-200', 
                'javascript': 'bg-yellow-100 text-yellow-700 border-yellow-200',
                'nodejs': 'bg-green-100 text-green-700 border-green-200',
                'python': 'bg-indigo-100 text-indigo-700 border-indigo-200',
                'java': 'bg-orange-100 text-orange-700 border-orange-200',
                'dotnet': 'bg-purple-100 text-purple-700 border-purple-200',
                'angular': 'bg-red-100 text-red-700 border-red-200',
                'vue': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                'docker': 'bg-cyan-100 text-cyan-700 border-cyan-200',
                'aws': 'bg-amber-100 text-amber-700 border-amber-200',
                'mongodb': 'bg-green-100 text-green-700 border-green-200',
                'postgresql': 'bg-blue-100 text-blue-700 border-blue-200',
                'mysql': 'bg-orange-100 text-orange-700 border-orange-200'
              };
              const colorClass = techColors[tech.toLowerCase() as keyof typeof techColors] || 'bg-gray-100 text-gray-700 border-gray-200';
              
              return (
                <Badge 
                  key={tech} 
                  className={`text-xs px-2 py-1 font-medium border ${colorClass} shadow-sm hover:shadow-md transition-shadow`}
                >
                  {TECH_STACK_LABELS[tech] || tech}
                </Badge>
              );
            })}
            {task.techStacks.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 font-medium border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
                +{task.techStacks.length - 3} more
              </Badge>
            )}
          </div>
          <span className="text-[13px] text-muted-foreground/60 shrink-0">{timeAgo(task.submittedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
