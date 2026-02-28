import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiStar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { employeeService } from '@/api/employeeService';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatCard } from '@/components/metrics/StatCard';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { formatDate, timeAgo } from '@/utils/formatDate';
import { User } from '@/types';
import { tasks as allTasks } from '@/mock/tasks';
import { employeeScores } from '@/mock/scores';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const AdminEmployeeDetail = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!empId) return;
      const emp = await employeeService.getEmployeeById(empId);
      setEmployee(emp);
    };
    loadData();
  }, [empId]);

  if (!employee) return <p className="text-muted-foreground p-8">Loading...</p>;

  const scores = employeeScores.find((s) => s.employeeId === employee.id);
  const empTasks = allTasks.filter((t) => t.employeeId === employee.id);
  const completedTasks = empTasks.filter((t) => t.status === 'completed').length;

  const radarData = scores
    ? Object.entries(scores.scores)
        .filter(([, data]) => data.count > 0)
        .map(([tech, data]) => ({ tech: TECH_STACK_LABELS[tech] || tech, score: data.average }))
    : [];

  const chartConfig = {
    score: { label: 'Score', color: 'hsl(221 83% 53%)' },
  } satisfies ChartConfig;

  const skillBreakdown = scores
    ? Object.entries(scores.scores)
        .filter(([, data]) => data.count > 0)
        .sort(([, a], [, b]) => b.average - a.average)
    : [];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 text-[15px] text-muted-foreground -ml-2" onClick={() => navigate(-1)}>
        <FiArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="px-7 py-2">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5 min-w-0">
              <Avatar className="h-[72px] w-[72px] shrink-0">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-lg font-medium bg-muted">{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-[24px] font-semibold tracking-tight">{employee.name}</h1>
                <p className="text-[16px] text-muted-foreground mt-0.5">{employee.designation}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {employee.joinedAt && (
                    <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
                      <FiCalendar className="h-3.5 w-3.5" />
                      Joined {formatDate(employee.joinedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {scores && scores.overallAverage > 0 && (
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <FiStar className="h-5 w-5 text-amber-500" />
                  <span className={`text-[28px] font-bold tabular-nums ${scoreColor(scores.overallAverage)}`}>
                    {scores.overallAverage.toFixed(1)}/10
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">avg score</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="p-4">
        <CardContent className="p-0 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Tasks" value={empTasks.length} color="blue" />
          <StatCard label="Completed" value={completedTasks} color="green" />
          <StatCard label="Avg Score" value={scores && scores.overallAverage > 0 ? scores.overallAverage.toFixed(1) : 'N/A'} color="yellow" />
          <StatCard label="Reviews" value={scores?.totalTasksCompleted || 0} color="purple" />
        </CardContent>
      </Card>

      {/* Two-column: Task History (left) + Skills (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* Left: Task History */}
        <div className="lg:col-span-7">
          <h3 className="text-[16px] font-semibold mb-3">Task History ({empTasks.length})</h3>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Title</TableHead>
                <TableHead>Tech Stacks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empTasks.map((task) => (
                <TableRow key={task.id} className="cursor-pointer" onClick={() => navigate(`/admin/tasks/${task.id}`)}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {task.techStacks.slice(0, 2).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs font-normal text-muted-foreground">
                          {TECH_STACK_LABELS[tech] || tech}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={task.status} /></TableCell>
                  <TableCell className="text-[13px] text-muted-foreground text-right">{timeAgo(task.submittedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right: Skill Radar + Score Breakdown stacked */}
        {radarData.length > 0 && (
          <div className="lg:col-span-3 space-y-5">
            {/* Radar Chart */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-[16px]">Skill Radar</CardTitle>
                <CardDescription className="text-[13px]">Proficiency across tech stacks</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto w-full h-[320px]">
                  <RadarChart data={radarData} outerRadius="65%">
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <PolarAngleAxis dataKey="tech" tick={{ fontSize: 13, fill: 'hsl(var(--muted-foreground))' }} />
                    <PolarGrid className="fill-primary/5 stroke-border" />
                    <Radar
                      dataKey="score"
                      fill="var(--color-score)"
                      fillOpacity={0.15}
                      stroke="var(--color-score)"
                      strokeWidth={2}
                      dot={{ r: 4, fillOpacity: 1, fill: 'var(--color-score)' }}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="pt-0 pb-4 justify-center">
                <p className="text-[13px] text-muted-foreground">Based on {scores?.totalTasksCompleted || 0} reviewed tasks</p>
              </CardFooter>
            </Card>

            {/* Score Breakdown */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-[16px]">Score Breakdown</CardTitle>
                <CardDescription className="text-[13px]">Per tech stack performance</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {skillBreakdown.map(([tech, data]) => (
                    <div key={tech}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[15px] font-medium">{TECH_STACK_LABELS[tech] || tech}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-muted-foreground">{data.count} {data.count === 1 ? 'review' : 'reviews'}</span>
                          <span className={`text-[16px] font-bold tabular-nums ${scoreColor(data.average)}`}>
                            {data.average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(data.average / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">Overall</span>
                  <span className={`text-[20px] font-bold tabular-nums ${scoreColor(scores!.overallAverage)}`}>
                    {scores!.overallAverage.toFixed(1)}/10
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployeeDetail;
