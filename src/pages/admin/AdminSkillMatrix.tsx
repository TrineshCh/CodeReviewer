import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/common/PageHeader';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { employeeScores } from '@/mock/scores';
import { users } from '@/mock/users';

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const AdminSkillMatrix = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matrix');

  const allTechStacks = new Set<string>();
  employeeScores.forEach((es) => {
    Object.entries(es.scores).forEach(([tech, data]) => {
      if (data.count > 0) allTechStacks.add(tech);
    });
  });
  const techStacks = Array.from(allTechStacks);

  const scoredEmployees = employeeScores
    .filter((es) => es.overallAverage > 0)
    .map((es) => {
      const user = users.find((u) => u.id === es.employeeId);
      return { ...es, name: user?.name || 'Unknown', avatar: user?.avatar || '' };
    });

  const leaderboard = [...scoredEmployees].sort((a, b) => b.overallAverage - a.overallAverage);

  return (
    <div className="space-y-5">
      <PageHeader title="Skill Matrix" description="Employee proficiency across tech stacks" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="matrix" className="text-[15px]">Matrix View</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-[15px]">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="sticky left-0 bg-card z-10 min-w-[200px]">Employee</TableHead>
                  {techStacks.map((tech) => (
                    <TableHead key={tech} className="text-center min-w-[100px]">
                      {TECH_STACK_LABELS[tech] || tech}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold min-w-[90px]">Overall</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoredEmployees.map((emp) => (
                  <TableRow
                    key={emp.employeeId}
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
                  >
                    <TableCell className="sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback className="text-xs font-medium bg-muted">{emp.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </TableCell>
                    {techStacks.map((tech) => {
                      const data = emp.scores[tech];
                      const hasScore = data && data.count > 0;
                      return (
                        <TableCell key={tech} className="text-center">
                          {hasScore ? (
                            <span className={`font-bold tabular-nums ${scoreColor(data.average)}`}>
                              {data.average.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-[13px] text-muted-foreground/30">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <span className={`font-bold tabular-nums ${scoreColor(emp.overallAverage)}`}>
                        {emp.overallAverage.toFixed(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4 space-y-2">
          {leaderboard.map((emp, idx) => {
            const topSkills = Object.entries(emp.scores)
              .filter(([, data]) => data.count > 0)
              .sort(([, a], [, b]) => b.average - a.average)
              .slice(0, 3);

            const rankColor = idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-muted-foreground/30';

            return (
              <Card
                key={emp.employeeId}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
              >
                <CardContent className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xl font-bold w-7 shrink-0 tabular-nums ${rankColor}`}>{idx + 1}</span>
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback className="text-xs font-medium bg-muted">{emp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium truncate">{emp.name}</p>
                        <div className="flex gap-1.5 mt-0.5">
                          {topSkills.map(([tech, data]) => (
                            <Badge key={tech} variant="secondary" className="text-xs font-normal text-muted-foreground">
                              {TECH_STACK_LABELS[tech] || tech} {data.average.toFixed(0)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-lg font-bold tabular-nums ${scoreColor(emp.overallAverage)}`}>
                        {emp.overallAverage.toFixed(1)}
                      </span>
                      <p className="text-[13px] text-muted-foreground">{emp.totalTasksCompleted} done</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSkillMatrix;
