import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SearchInput } from '@/components/common/SearchInput';
import { users } from '@/mock/users';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { timeAgo } from '@/utils/formatDate';
import { useDebounce } from '@/hooks/useDebounce';

const AdminTaskList = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => { fetchTasks(); }, []);

  const filteredTasks = tasks
    .filter((t) => statusFilter === 'all' || t.status === statusFilter)
    .filter((t) => {
      if (!debouncedSearch) return true;
      const emp = users.find((u) => u.id === t.employeeId);
      const s = debouncedSearch.toLowerCase();
      return t.title.toLowerCase().includes(s) || emp?.name.toLowerCase().includes(s) || t.techStacks.some((ts) => ts.includes(s));
    });

  return (
    <div className="space-y-5">
      <PageHeader title="All Tasks" description={`${tasks.length} total tasks`} />

      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by title, employee..." />
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
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Tech Stacks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => {
            const emp = users.find((u) => u.id === task.employeeId);
            return (
              <TableRow
                key={task.id}
                className="cursor-pointer"
                onClick={() => navigate(`/admin/tasks/${task.id}`)}
              >
                <TableCell className="font-medium">{emp?.name || 'Unknown'}</TableCell>
                <TableCell className="max-w-[300px]">
                  <span className="truncate block">{task.title}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5 flex-wrap">
                    {task.techStacks.slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs font-normal text-muted-foreground">
                        {TECH_STACK_LABELS[tech] || tech}
                      </Badge>
                    ))}
                    {task.techStacks.length > 2 && (
                      <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                        +{task.techStacks.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={task.status} /></TableCell>
                <TableCell className="text-[13px] text-muted-foreground text-right">{timeAgo(task.submittedAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {filteredTasks.length === 0 && (
        <p className="text-[15px] text-muted-foreground text-center py-12">No tasks match your criteria.</p>
      )}
    </div>
  );
};

export default AdminTaskList;
