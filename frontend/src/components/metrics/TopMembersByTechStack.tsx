import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopMembersPerTechStack } from '@/utils/techStackUtils';
import { TECH_STACK_LABELS } from '@/utils/constants';

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600';
  if (score >= 5) return 'text-amber-600';
  return 'text-red-600';
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return 'text-amber-500';
    case 2: return 'text-gray-400';
    case 3: return 'text-orange-400';
    default: return 'text-muted-foreground/40';
  }
};

export const TopMembersByTechStack = () => {
  const topMembersByTechStack = getTopMembersPerTechStack();

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Top Members by Tech Stack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topMembersByTechStack.slice(0, 3).map((techStack) => (
          <div key={techStack.techStack} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {TECH_STACK_LABELS[techStack.techStack] || techStack.techStack}
              </h4>
              <Badge variant="secondary" className="text-xs">
                {techStack.topMembers.length}
              </Badge>
            </div>
            <div className="space-y-1.5">
              {techStack.topMembers.slice(0, 3).map((member, idx) => (
                <div key={member.employeeId} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`text-[12px] font-bold w-4 shrink-0 tabular-nums ${getRankColor(idx + 1)}`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium truncate">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {member.totalTasks} task{member.totalTasks !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[13px] font-bold tabular-nums shrink-0 ${scoreColor(member.average)}`}>
                    {member.average.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {topMembersByTechStack.length === 0 && (
          <div className="text-center py-4">
            <p className="text-[13px] text-muted-foreground/60">
              No tech stack data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
