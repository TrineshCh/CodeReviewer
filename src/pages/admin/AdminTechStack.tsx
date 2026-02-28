import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/store/taskStore';
import { PageHeader } from '@/components/common/PageHeader';
import { employeeScores } from '@/mock/scores';
import { TECH_STACK_LABELS } from '@/utils/constants';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';

const AdminTechStack = () => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => { fetchTasks(); }, []);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const rejected = tasks.filter((t) => t.status === 'rejected').length;

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

  const pieConfig = {
    value: { label: 'Tasks' },
    pending: { label: 'Pending', color: 'hsl(221 83% 45%)' },
    review: { label: 'Review', color: 'hsl(216 60% 60%)' },
    completed: { label: 'Completed', color: 'hsl(214 45% 72%)' },
    rejected: { label: 'Rejected', color: 'hsl(214 35% 85%)' },
  } satisfies ChartConfig;

  const techStackAverages: Record<string, { total: number; count: number }> = {};
  employeeScores.forEach((es) => {
    Object.entries(es.scores).forEach(([tech, data]) => {
      if (data.count > 0) {
        if (!techStackAverages[tech]) techStackAverages[tech] = { total: 0, count: 0 };
        techStackAverages[tech].total += data.average;
        techStackAverages[tech].count += 1;
      }
    });
  });

  const barData = Object.entries(techStackAverages)
    .map(([tech, data]) => ({
      tech: TECH_STACK_LABELS[tech] || tech,
      average: Number((data.total / data.count).toFixed(1)),
    }))
    .sort((a, b) => b.average - a.average);

  const barConfig = {
    average: { label: 'Avg Score', color: 'hsl(221 83% 53%)' },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <PageHeader title="Tech Stack" description="Task distribution and tech stack performance" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">Tech Stack Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="min-h-[280px] w-full">
              <BarChart accessibilityLayer data={barData} layout="vertical" margin={{ left: 10, right: 40, top: 10, bottom: 10 }}>
                <YAxis dataKey="tech" type="category" hide />
                <XAxis dataKey="average" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="average" fill="var(--color-average)" radius={6} barSize={32}>
                  <LabelList dataKey="tech" position="insideLeft" offset={10} className="fill-white" fontSize={13} fontWeight={500} />
                  <LabelList dataKey="average" position="right" offset={8} className="fill-foreground" fontSize={13} fontWeight={600} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTechStack;
