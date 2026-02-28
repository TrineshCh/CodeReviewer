import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/metrics/StatCard';
import { TaskCard } from '@/components/task/TaskCard';
import { FeedbackCard } from '@/components/review/FeedbackCard';
import { reviews } from '@/mock/reviews';
import { tasks as allTasks } from '@/mock/tasks';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) fetchTasks({ employeeId: currentUser.id });
  }, [currentUser]);

  const underReview = tasks.filter((t) => t.status === 'under-review' || t.status === 'pending-analysis').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const myTaskIds = tasks.map((t) => t.id);
  const myReviews = reviews.filter((r) => myTaskIds.includes(r.taskId));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${currentUser?.name?.split(' ')[0]}`}
        description="Here's an overview of your tasks and feedback"
        action={
          <Button onClick={() => navigate('/employee/submit')}>
            <FiPlus className="mr-1.5 h-4 w-4" /> Submit Task
          </Button>
        }
      />

      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Under Review" value={underReview} color="blue" />
          <StatCard label="Completed" value={completed} color="green" />
          <StatCard label="Feedback" value={myReviews.length} color="blue" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-[15px] font-semibold">Recent Tasks</h3>
          {tasks.slice(0, 4).map((task) => (
            <TaskCard key={task.id} task={task} basePath="/employee/tasks" />
          ))}
          {tasks.length === 0 && (
            <p className="text-[15px] text-muted-foreground py-8 text-center">No tasks submitted yet. Get started!</p>
          )}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-[15px] font-semibold">Recent Feedback</h3>
          {myReviews.slice(0, 3).map((review) => {
            const task = allTasks.find((t) => t.id === review.taskId);
            return <FeedbackCard key={review.id} review={review} taskTitle={task?.title} />;
          })}
          {myReviews.length === 0 && (
            <p className="text-[15px] text-muted-foreground py-8 text-center">No feedback yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
