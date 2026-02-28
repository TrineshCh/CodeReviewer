import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/metrics/StatCard';
import { TaskCard } from '@/components/task/TaskCard';
import { users } from '@/mock/users';
import { employeeScores } from '@/mock/scores';
import { FiAward, FiTrendingUp, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const scoreColor = (score: number) => {
  if (score >= 8) return {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700'
  };
  if (score >= 5) return {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700'
  };
  return {
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700'
  };
};

const AdminDashboard = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

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
          <StatCard label="Total Tasks" value={total} color="blue" icon={FiClock} />
          <StatCard label="Under Review" value={underReview} color="yellow" icon={FiTrendingUp} />
          <StatCard label="Completed" value={completed} color="green" icon={FiCheckCircle} />
          <StatCard label="Rejected" value={rejected} color="red" icon={FiXCircle} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold">Recent Submissions</h3>
            <button 
              className="text-[13px] text-muted-foreground hover:text-foreground font-medium transition-colors px-3 py-1 rounded-md hover:bg-muted/50" 
              onClick={() => navigate('/admin/tasks')}
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => {
              const emp = users.find((u) => u.id === task.employeeId);
              return (
                <div key={task.id} className="transition-all duration-200">
                  <TaskCard 
                    task={task} 
                    basePath="/admin/tasks" 
                    showEmployee 
                    employeeName={emp?.name} 
                    className="border-2 border-muted-foreground/20 bg-muted/10 hover:shadow-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Card className="lg:col-span-2 border-2 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FiTrendingUp className="h-5 w-5 text-blue-600" />
                Top Performers
              </CardTitle>
              <div className="flex items-center gap-1">
                <FiAward className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">Elite Team</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((performer, idx) => {
              const colors = scoreColor(performer.overallAverage);
              
              return (
                <div 
                  key={performer.employeeId} 
                  className="relative overflow-hidden rounded-lg border-2 border-muted-foreground/20 bg-muted/10 p-4 transition-all duration-200 hover:shadow-lg cursor-pointer"
                  onClick={() => navigate(`/admin/employees/${performer.employeeId}`)}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md bg-muted text-muted-foreground">
                      {idx + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex items-center justify-between gap-3 pl-10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold truncate">{performer.name}</p>
                        <p className="text-[13px] text-muted-foreground">{performer.totalTasksCompleted} tasks completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[15px] font-bold tabular-nums ${colors.text}`}>
                        {performer.overallAverage.toFixed(1)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge} mt-1 inline-block`}>
                        {performer.overallAverage >= 8 ? 'Expert' : performer.overallAverage >= 5 ? 'Proficient' : 'Developing'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
