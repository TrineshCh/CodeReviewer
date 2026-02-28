import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { TaskCard } from '@/components/task/TaskCard';

const EmployeeTaskHistory = () => {
  const { currentUser } = useAuth();
  const { tasks, fetchTasks } = useTaskStore();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (currentUser) fetchTasks({ employeeId: currentUser.id });
  }, [currentUser]);

  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Tasks"
        description={`${tasks.length} total tasks`}
        action={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 h-10 text-[15px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending-analysis">Pending Analysis</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} basePath="/employee/tasks" />
        ))}
        {filteredTasks.length === 0 && (
          <p className="text-[15px] text-muted-foreground text-center py-12">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeTaskHistory;
