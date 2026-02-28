import { users } from '../mock/users';
import { employeeScores } from '../mock/scores';

export interface TopMemberPerTechStack {
  techStack: string;
  topMembers: Array<{
    employeeId: string;
    name: string;
    average: number;
    totalTasks: number;
  }>;
}

export const getTopMembersPerTechStack = (): TopMemberPerTechStack[] => {
  const techStackMap = new Map<string, Array<{
    employeeId: string;
    name: string;
    average: number;
    totalTasks: number;
  }>>();

  employeeScores.forEach((score) => {
    const user = users.find((u) => u.id === score.employeeId);
    if (!user) return;

    Object.entries(score.scores).forEach(([tech, data]) => {
      if (data.count > 0 && data.average > 0) {
        if (!techStackMap.has(tech)) {
          techStackMap.set(tech, []);
        }
        
        techStackMap.get(tech)!.push({
          employeeId: score.employeeId,
          name: user.name,
          average: data.average,
          totalTasks: score.totalTasksCompleted,
        });
      }
    });
  });

  const result: TopMemberPerTechStack[] = [];
  
  techStackMap.forEach((members, techStack) => {
    const sortedMembers = members
      .sort((a, b) => b.average - a.average)
      .slice(0, 5); // Top 5 members per tech stack
    
    result.push({
      techStack,
      topMembers: sortedMembers,
    });
  });

  return result.sort((a, b) => b.topMembers.length - a.topMembers.length);
};
