import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { employeeScores } from '@/mock/scores';
import { users } from '@/mock/users';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { getTopMembersPerTechStack } from '@/utils/techStackUtils';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer, TreemapChart, Treemap } from 'recharts';

const AdminTechStack = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => { fetchTasks(); }, []);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const rejected = tasks.filter((t) => t.status === 'rejected').length;
  const topMembersByTechStack = getTopMembersPerTechStack();

  const pieRaw = [
    { status: 'pending', value: tasks.filter((t) => t.status === 'pending-analysis').length },
    { status: 'review', value: tasks.filter((t) => t.status === 'under-review').length },
    { status: 'completed', value: completed },
    { status: 'rejected', value: rejected },
  ].filter((d) => d.value > 0);

  const pieTotal = pieRaw.reduce((sum, d) => sum + d.value, 0);
  const pieData = pieRaw.map((d) => ({
    ...d,
    fill: `var(--color-${d.status})`,
    percent: pieTotal > 0 ? Math.round((d.value / pieTotal) * 100) : 0,
  }));

  const techStackAverages: Record<string, { total: number; count: number; experts: number }> = {};
  employeeScores.forEach((es) => {
    Object.entries(es.scores).forEach(([tech, data]) => {
      if (data.count > 0) {
        if (!techStackAverages[tech]) techStackAverages[tech] = { total: 0, count: 0, experts: 0 };
        techStackAverages[tech].total += data.average;
        techStackAverages[tech].count += 1;
        if (data.average >= 8) techStackAverages[tech].experts += 1;
      }
    });
  });

  const barData = Object.entries(techStackAverages)
    .map(([tech, data]) => ({
      tech: TECH_STACK_LABELS[tech] || tech,
      average: Number((data.total / data.count).toFixed(1)),
      count: data.count,
      experts: data.experts,
      expertPercentage: data.count > 0 ? Math.round((data.experts / data.count) * 100) : 0,
    }))
    .sort((a, b) => b.average - a.average);

  const selectedTechData = selectedTech 
    ? topMembersByTechStack.find(t => t.techStack === selectedTech)
    : null;

  const pieConfig = {
    value: { label: 'Tasks' },
    pending: { label: 'Pending', color: 'hsl(221 83% 45%)' },
    review: { label: 'Review', color: 'hsl(216 60% 60%)' },
    completed: { label: 'Completed', color: 'hsl(214 45% 72%)' },
    rejected: { label: 'Rejected', color: 'hsl(214 35% 85%)' },
  } satisfies ChartConfig;

  const barConfig = {
    average: { label: 'Avg Score', color: 'hsl(221 83% 53%)' },
    experts: { label: 'Experts', color: 'hsl(120 60% 50%)' },
  } satisfies ChartConfig;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-800';
    if (score >= 5) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tech Stack" description="Technology performance insights and team expertise distribution" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{Object.keys(techStackAverages).length}</p>
            <p className="text-sm text-muted-foreground">Tech Stacks</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Object.values(techStackAverages).reduce((acc, tech) => acc + tech.count, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Assessments</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {Object.values(techStackAverages).reduce((acc, tech) => acc + tech.experts, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Expert Members (8+)</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Object.keys(techStackAverages).length > 0 
                ? (Object.values(techStackAverages).reduce((acc, tech) => acc + tech.total, 0) / 
                   Object.values(techStackAverages).reduce((acc, tech) => acc + tech.count, 0)).toFixed(1)
                : '0'
              }
            </p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Distribution */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ChartContainer config={pieConfig} className="aspect-square h-[200px] shrink-0">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieData} dataKey="value" nameKey="status" innerRadius="55%" outerRadius="85%" strokeWidth={0} paddingAngle={0} />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col gap-3">
                {pieData.map((d) => {
                  const cfg = pieConfig[d.status as keyof typeof pieConfig] as { label?: string; color?: string };
                  return (
                    <div key={d.status} className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg?.color }} />
                      <span className="text-[14px] text-muted-foreground">{cfg?.label}:</span>
                      <span className="text-[14px] font-semibold text-foreground">{d.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">Tech Stack Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="min-h-[280px] w-full">
              <BarChart accessibilityLayer data={barData} layout="vertical" margin={{ left: 10, right: 40, top: 10, bottom: 10 }}>
                <YAxis dataKey="tech" type="category" hide />
                <XAxis dataKey="average" type="number" domain={[0, 10]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="average" fill="var(--color-average)" radius={6} barSize={32}>
                  <LabelList dataKey="tech" position="insideLeft" offset={10} className="fill-white" fontSize={13} fontWeight={500} />
                  <LabelList dataKey="average" position="right" offset={8} className="fill-foreground" fontSize={13} fontWeight={600} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Tech Stacks by Expert Count */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">Expertise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {barData.slice(0, 6).map((tech, index) => (
                <div 
                  key={tech.tech} 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTech === tech.tech ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTech(tech.tech === selectedTech ? null : tech.tech)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tech.tech}</span>
                      <Badge variant="secondary" className="text-xs">{tech.count} members</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{tech.average}</div>
                      <div className="text-xs text-muted-foreground">{tech.experts} experts</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all" 
                          style={{ width: `${tech.expertPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{tech.expertPercentage}% expert level</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Tech Stack Details */}
      {selectedTechData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {TECH_STACK_LABELS[selectedTechData.techStack] || selectedTechData.techStack} - Top Members
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                {selectedTechData.topMembers.length} total members
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedTechData.topMembers.map((member, idx) => {
                const user = users.find(u => u.id === member.employeeId);
                return (
                  <div key={member.employeeId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-bold w-6 shrink-0 tabular-nums ${
                        idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-muted-foreground/40'
                      }`}>
                        {idx + 1}
                      </span>
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs font-medium bg-muted">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.designation}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.totalTasks} task{member.totalTasks !== 1 ? 's' : ''} completed
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-lg font-bold tabular-nums ${getScoreColor(member.average)}`}>
                        {member.average.toFixed(1)}
                      </span>
                      <Badge className={`text-xs ${getScoreBgColor(member.average)}`}>
                        {member.average >= 8 ? 'Expert' : member.average >= 5 ? 'Proficient' : 'Developing'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTechStack;
