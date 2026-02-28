import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiExternalLink } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { taskService } from '@/api/taskService';
import { reviewService } from '@/api/reviewService';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CodeRabbitSummary } from '@/components/review/CodeRabbitSummary';
import { FeedbackCard } from '@/components/review/FeedbackCard';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatDate';
import { Task, Analysis, Review } from '@/types';

const EmployeeTaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!taskId) return;
      const t = await taskService.getById(taskId);
      setTask(t);
      if (t?.analysisId) setAnalysis(await reviewService.getAnalysis(taskId));
      if (t?.reviewId) setReview(await reviewService.getReview(taskId));
    };
    loadData();
  }, [taskId]);

  if (!task) return <p className="text-muted-foreground p-8">Loading...</p>;

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" className="gap-1.5 text-[15px] text-muted-foreground -ml-2" onClick={() => navigate(-1)}>
        <FiArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="space-y-1 min-w-0">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-[15px] text-muted-foreground">Submitted {formatDateTime(task.submittedAt)}</p>
            </div>
            <StatusBadge status={task.status} />
          </div>

          <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">{task.description}</p>

          <div className="flex items-center justify-between gap-4">
            <a href={task.githubRepoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[15px] text-foreground hover:underline">
              <FiGithub className="h-[18px] w-[18px]" />
              <span className="truncate max-w-sm">{task.githubRepoLink}</span>
              <FiExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
            <div className="flex gap-1.5 flex-wrap shrink-0">
              {task.techStacks.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs font-normal text-muted-foreground">{TECH_STACK_LABELS[tech] || tech}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[15px] font-semibold">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-5 space-y-4">
            <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border" />

            <div className="relative flex items-center gap-3">
              <div className="absolute left-[-13px] h-2.5 w-2.5 rounded-full bg-foreground ring-2 ring-background" />
              <span className="text-[15px]">Submitted</span>
              <span className="text-[13px] text-muted-foreground">{formatDateTime(task.submittedAt)}</span>
            </div>

            {analysis && (
              <div className="relative flex items-center gap-3">
                <div className="absolute left-[-13px] h-2.5 w-2.5 rounded-full bg-foreground/50 ring-2 ring-background" />
                <span className="text-[15px]">Analysis Complete</span>
                <span className="text-[13px] text-muted-foreground">{formatDateTime(analysis.analyzedAt)}</span>
              </div>
            )}

            {review && (
              <div className="relative flex items-center gap-3">
                <div className={`absolute left-[-13px] h-2.5 w-2.5 rounded-full ring-2 ring-background ${review.decision === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-[15px]">{review.decision === 'completed' ? 'Approved' : 'Rejected'}</span>
                <span className="text-[13px] text-muted-foreground">{formatDateTime(review.reviewedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && <CodeRabbitSummary analysis={analysis} />}

      {review && (
        <div className="space-y-3">
          <h3 className="text-[15px] font-semibold">Team Lead Feedback</h3>
          <FeedbackCard review={review} />
        </div>
      )}
    </div>
  );
};

export default EmployeeTaskDetail;
