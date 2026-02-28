import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SearchInput } from '@/components/common/SearchInput';
import { users } from '@/mock/users';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { timeAgo } from '@/utils/formatDate';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  FiFilter, FiDownload, FiEye, FiCalendar, FiClock, FiCheckCircle, 
  FiAlertCircle, FiTrendingUp, FiUsers, FiCode, FiStar
} from 'react-icons/fi';

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

  // Calculate stats
  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending-analysis').length,
    underReview: tasks.filter(t => t.status === 'under-review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    rejected: tasks.filter(t => t.status === 'rejected').length,
  }), [tasks]);

  // Calculate recent threshold once
  const recentThreshold = useMemo(() => new Date(Date.now() - 24 * 60 * 60 * 1000), []);

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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Task Management" 
        description={`${tasks.length} total tasks across all teams`}
        action={
          <Button variant="outline" className="gap-2">
            <FiDownload className="h-4 w-4" />
            Export
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <div className="h-10 w-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.pending}</p>
              </div>
              <div className="h-10 w-10 bg-amber-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <FiClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Under Review</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.underReview}</p>
              </div>
              <div className="h-10 w-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <FiEye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed</p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.completed}</p>
              </div>
              <div className="h-10 w-10 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950/30 dark:to-pink-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.rejected}</p>
              </div>
              <div className="h-10 w-10 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1 md:max-w-md">
                <SearchInput 
                  value={search} 
                  onChange={setSearch} 
                  placeholder="Search by title, employee, or tech stack..." 
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-10">
                  <SelectValue placeholder="Filter by status" />
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
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FiCalendar className="h-4 w-4" />
              <span>{filteredTasks.length} of {tasks.length} tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[200px] font-semibold">Employee</TableHead>
                <TableHead className="font-semibold">Task Details</TableHead>
                <TableHead className="w-[300px] font-semibold">Tech Stack</TableHead>
                <TableHead className="w-[120px] font-semibold">Status</TableHead>
                <TableHead className="w-[140px] text-right font-semibold">Submitted</TableHead>
                <TableHead className="w-[80px] text-center font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task, index) => {
                const emp = users.find((u) => u.id === task.employeeId);
                
                return (
                  <TableRow
                    key={task.id}
                    className={`cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                      index === 0 ? 'border-t-2 border-t-blue-200' : ''
                    }`}
                    onClick={() => navigate(`/admin/tasks/${task.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {emp?.name?.charAt(0) || 'U'}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{emp?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">
                            {emp?.teamId ? `Team ${emp.teamId}` : 'No team'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm line-clamp-1">{task.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FiCode className="h-3 w-3 text-muted-foreground" />
                        <div className="flex gap-1 flex-wrap">
                          {task.techStacks.slice(0, 2).map((tech) => {
                            const colorClass = techColors[tech.toLowerCase() as keyof typeof techColors] || 'bg-gray-100 text-gray-700 border-gray-200';
                            return (
                              <Badge 
                                key={tech} 
                                className={`text-xs px-2 py-1 font-medium border ${colorClass} shadow-sm`}
                              >
                                {TECH_STACK_LABELS[tech] || tech}
                              </Badge>
                            );
                          })}
                          {task.techStacks.length > 2 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 font-medium border-2 border-dashed border-muted-foreground/30">
                              +{task.techStacks.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{timeAgo(task.submittedAt)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(task.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/tasks/${task.id}`);
                        }}
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFilter className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-1">No tasks found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTaskList;
