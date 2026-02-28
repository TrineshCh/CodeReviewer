import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { FeedbackCard } from '@/components/review/FeedbackCard';
import { reviews } from '@/mock/reviews';
import { tasks as allTasks } from '@/mock/tasks';
import { employeeScores } from '@/mock/scores';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const EmployeeFeedback = () => {
  const { currentUser } = useAuth();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    if (currentUser) fetchTasks({ employeeId: currentUser.id });
  }, [currentUser]);

  const myTaskIds = tasks.map((t) => t.id);
  const myReviews = reviews
    .filter((r) => myTaskIds.includes(r.taskId))
    .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());

  const myScores = employeeScores.find((s) => s.employeeId === currentUser?.id);
  const radarData = myScores
    ? Object.entries(myScores.scores)
        .filter(([, data]) => data.count > 0)
        .map(([tech, data]) => ({ tech: TECH_STACK_LABELS[tech] || tech, score: data.average }))
    : [];

  const radarConfig = { score: { label: 'Score', color: 'var(--foreground)' } };

  return (
    <div className="space-y-6">
      <PageHeader title="My Feedback" description="View your skill scores and all review feedback" />

      {radarData.length > 0 && myScores && (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[15px] font-semibold">Skill Scores</CardTitle>
              <div className="text-right">
                <span className={`text-xl font-bold tabular-nums ${scoreColor(myScores.overallAverage)}`}>
                  {myScores.overallAverage.toFixed(1)}
                </span>
                <span className="text-[13px] text-muted-foreground">/10 overall</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartContainer config={radarConfig} className="h-[280px] w-full">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="tech" fontSize={13} />
                  <PolarRadiusAxis domain={[0, 10]} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar name="Score" dataKey="score" stroke="var(--color-score)" fill="var(--color-score)" fillOpacity={0.1} />
                </RadarChart>
              </ChartContainer>

              <div className="space-y-3.5">
                {Object.entries(myScores.scores)
                  .filter(([, data]) => data.count > 0)
                  .sort(([, a], [, b]) => b.average - a.average)
                  .map(([tech, data]) => (
                    <div key={tech} className="flex items-center justify-between">
                      <span className="text-[15px]">{TECH_STACK_LABELS[tech] || tech}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] text-muted-foreground">{data.count} reviews</span>
                        <span className={`text-[15px] font-bold tabular-nums ${scoreColor(data.average)}`}>
                          {data.average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">Overall Average</span>
                  <span className={`text-lg font-bold tabular-nums ${scoreColor(myScores.overallAverage)}`}>
                    {myScores.overallAverage.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="text-[15px] font-semibold">
          All Feedback
          {myReviews.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs text-muted-foreground">{myReviews.length}</Badge>
          )}
        </h3>
        {myReviews.map((review) => {
          const task = allTasks.find((t) => t.id === review.taskId);
          return <FeedbackCard key={review.id} review={review} taskTitle={task?.title} />;
        })}
        {myReviews.length === 0 && (
          <p className="text-[15px] text-muted-foreground text-center py-12">
            No feedback received yet. Submit tasks to get reviewed!
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeFeedback;
