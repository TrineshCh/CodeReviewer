import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/metrics/StatCard';
import { TaskCard } from '@/components/task/TaskCard';
import { users } from '@/mock/users';
import { employeeScores } from '@/mock/scores';

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600';
  if (score >= 5) return 'text-amber-600';
  return 'text-red-600';
};

const AdminDashboard = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, []);

  const total = tasks.length;
  const underReview = tasks.filter((t) => t.status === 'under-review' || t.status === 'pending-analysis').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const rejected = tasks.filter((t) => t.status === 'rejected').length;

  const topPerformers = [...employeeScores]
    .filter((s) => s.overallAverage > 0)
    .sort((a, b) => b.overallAverage - a.overallAverage)
    .slice(0, 5)
    .map((s) => ({ ...s, name: users.find((u) => u.id === s.employeeId)?.name || 'Unknown' }));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of tasks and team performance" />

      <Card className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Tasks" value={total} color="blue" />
          <StatCard label="Under Review" value={underReview} color="blue" />
          <StatCard label="Completed" value={completed} color="green" />
          <StatCard label="Rejected" value={rejected} color="red" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold">Recent Submissions</h3>
            <button className="text-[13px] text-muted-foreground hover:text-foreground font-medium transition-colors" onClick={() => navigate('/admin/tasks')}>
              View all
            </button>
          </div>
          {tasks.slice(0, 4).map((task) => {
            const emp = users.find((u) => u.id === task.employeeId);
            return <TaskCard key={task.id} task={task} basePath="/admin/tasks" showEmployee employeeName={emp?.name} />;
          })}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {topPerformers.map((performer, idx) => (
              <div key={performer.employeeId} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[15px] font-bold w-5 shrink-0 tabular-nums ${
                    idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-muted-foreground/40'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium truncate">{performer.name}</p>
                    <p className="text-[13px] text-muted-foreground">{performer.totalTasksCompleted} tasks</p>
                  </div>
                </div>
                <span className={`text-[15px] font-bold tabular-nums ${scoreColor(performer.overallAverage)}`}>
                  {performer.overallAverage.toFixed(1)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
