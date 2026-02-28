import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiExternalLink, FiCalendar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { taskService } from '@/api/taskService';
import { reviewService } from '@/api/reviewService';
import { useAuth } from '@/hooks/useAuth';
import { useTaskStore } from '@/store/taskStore';
import { useReviewStore } from '@/store/reviewStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CodeRabbitSummary } from '@/components/review/CodeRabbitSummary';
import { FeedbackCard } from '@/components/review/FeedbackCard';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatDate';
import { Task, Analysis, Review } from '@/types';
import { users } from '@/mock/users';

const scoreColor = (score: number) => {
  if (score >= 7) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 4) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const scoreBg = (score: number) => {
  if (score >= 7) return 'bg-emerald-50 dark:bg-emerald-950/30';
  if (score >= 4) return 'bg-amber-50 dark:bg-amber-950/30';
  return 'bg-red-50 dark:bg-red-950/30';
};

const AdminTaskReview = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateTaskStatus } = useTaskStore();
  const { submitReview } = useReviewStore();

  const [task, setTask] = useState<Task | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [feedback, setFeedback] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!taskId) return;
      const t = await taskService.getById(taskId);
      setTask(t);
      if (t) {
        const initScores: Record<string, number> = {};
        t.techStacks.forEach((tech) => (initScores[tech] = 5));
        setScores(initScores);
        if (t.analysisId) setAnalysis(await reviewService.getAnalysis(taskId));
        if (t.reviewId) setExistingReview(await reviewService.getReview(taskId));
      }
    };
    loadData();
  }, [taskId]);

  const handleSubmitReview = async (decision: 'completed' | 'rejected') => {
    if (!taskId || !currentUser || !feedback.trim()) return;
    setIsSubmitting(true);
    await submitReview({ taskId, adminId: currentUser.id, feedback, scores, decision });
    await updateTaskStatus(taskId, decision);
    setIsSubmitting(false);
    navigate('/admin/tasks');
  };

  if (!task) return <p className="text-muted-foreground p-8">Loading...</p>;

  const employee = users.find((u) => u.id === task.employeeId);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 text-[15px] text-muted-foreground -ml-2" onClick={() => navigate(-1)}>
        <FiArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* Task Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="text-[22px] font-semibold tracking-tight">{task.title}</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">{task.description}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Info Row */}
      <Card className="p-0">
        <CardContent className="px-6 py-4">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={employee?.avatar} />
                <AvatarFallback className="text-sm font-medium bg-muted">{employee?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[14px] font-medium">{employee?.name || 'Unknown'}</p>
                <p className="text-[12px] text-muted-foreground">{employee?.designation}</p>
              </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-2 text-muted-foreground">
              <FiCalendar className="h-4 w-4" />
              <span className="text-[14px]">{formatDateTime(task.submittedAt)}</span>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <a href={task.githubRepoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[14px] text-foreground hover:text-primary transition-colors">
              <FiGithub className="h-4 w-4" />
              <span className="truncate max-w-xs">{task.githubRepoLink.replace('https://github.com/', '')}</span>
              <FiExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>

            <div className="flex gap-1.5 flex-wrap ml-auto">
              {task.techStacks.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs font-normal text-muted-foreground">{TECH_STACK_LABELS[tech] || tech}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout: Analysis + Review */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: CodeRabbit Analysis */}
        <div className="lg:col-span-3">
          {analysis && <CodeRabbitSummary analysis={analysis} />}
          {!analysis && (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="relative mx-auto mb-5 h-14 w-14">
                  {/* Outer orbit */}
                  <div className="absolute inset-0 rounded-full border border-primary/10 animate-spin [animation-duration:4s]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary/60 blur-[1px]" />
                  </div>
                  {/* Middle orbit */}
                  <div className="absolute inset-2 rounded-full border border-primary/15 animate-spin [animation-duration:2.5s] [animation-direction:reverse]">
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary/80" />
                  </div>
                  {/* Core glow */}
                  <div className="absolute inset-4 rounded-full bg-primary/15 animate-pulse [animation-duration:1.5s]" />
                  <div className="absolute inset-5 rounded-full bg-primary/25 animate-pulse [animation-duration:2s]" />
                  {/* Sparkle dots */}
                  <div className="absolute top-0 right-0 h-1 w-1 rounded-full bg-primary/50 animate-ping [animation-duration:2s]" />
                  <div className="absolute bottom-1 left-0 h-1 w-1 rounded-full bg-primary/40 animate-ping [animation-duration:3s] [animation-delay:0.5s]" />
                  <div className="absolute top-2 -left-1 h-0.5 w-0.5 rounded-full bg-primary/30 animate-ping [animation-duration:2.5s] [animation-delay:1s]" />
                </div>
                <p className="text-[15px] text-foreground font-medium">AI is analysing Task</p>
                <p className="text-[13px] text-muted-foreground mt-1">Analysis will appear here once complete</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Review Form or Existing Review */}
        <div className="lg:col-span-2">
          {existingReview ? (
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold">Your Review</h3>
              <FeedbackCard review={existingReview} />
            </div>
          ) : (
            <Card className="sticky top-20">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Submit Review</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div>
                  <label className="text-[14px] font-medium mb-1.5 block">
                    Feedback <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Code quality, approach, suggestions..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="text-[14px] resize-none"
                  />
                </div>

                <Separator />

                <div>
                  <label className="text-[14px] font-medium mb-3 block">Tech Stack Scores</label>
                  <div className="space-y-3.5">
                    {task.techStacks.map((tech) => (
                      <div key={tech}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] text-muted-foreground">{TECH_STACK_LABELS[tech] || tech}</span>
                          <span className={`text-[14px] font-bold tabular-nums rounded-md px-2 py-0.5 ${scoreColor(scores[tech] || 5)} ${scoreBg(scores[tech] || 5)}`}>
                            {scores[tech] || 5}/10
                          </span>
                        </div>
                        <Slider
                          min={1} max={10} step={1}
                          value={[scores[tech] || 5]}
                          onValueChange={(val) => setScores((prev) => ({ ...prev, [tech]: val[0] }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2.5">
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                    onClick={() => handleSubmitReview('rejected')}
                    disabled={isSubmitting || !feedback.trim()}
                  >
                    Reject
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleSubmitReview('completed')}
                    disabled={isSubmitting || !feedback.trim()}
                  >
                    {isSubmitting ? 'Submitting...' : 'Approve'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskReview;
