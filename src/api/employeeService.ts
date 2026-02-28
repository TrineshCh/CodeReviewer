import { users } from '../mock/users';
import { employeeScores } from '../mock/scores';
import { teams } from '../mock/teams';
import { simulateDelay } from '../mock/delay';
import { User, EmployeeScore, Team } from '../types';

export const employeeService = {
  async getEmployees(): Promise<User[]> {
    await simulateDelay(200);
    return users.filter((u) => u.role === 'employee');
  },

  async getEmployeeById(empId: string): Promise<User | null> {
    await simulateDelay(100);
    return users.find((u) => u.id === empId) || null;
  },

  async getScores(employeeId?: string): Promise<EmployeeScore[]> {
    await simulateDelay(200);
    if (employeeId) return employeeScores.filter((s) => s.employeeId === employeeId);
    return employeeScores;
  },

  async getTeams(): Promise<Team[]> {
    await simulateDelay(200);
    return teams;
  },

  async getTeamById(teamId: string): Promise<Team | null> {
    await simulateDelay(100);
    return teams.find((t) => t.id === teamId) || null;
  },

  async addEmployee(employee: User): Promise<void> {
    await simulateDelay(200);
    users.push(employee);
  },

  async addTeam(team: Team): Promise<void> {
    await simulateDelay(200);
    teams.push(team);
  },

  async getSkillMatrix(): Promise<{ employeeId: string; name: string; scores: Record<string, number> }[]> {
    await simulateDelay(300);
    return employeeScores.map((es) => {
      const user = users.find((u) => u.id === es.employeeId);
      const scoreMap: Record<string, number> = {};
      Object.entries(es.scores).forEach(([tech, data]) => {
        if (data.count > 0) scoreMap[tech] = data.average;
      });
      return {
        employeeId: es.employeeId,
        name: user?.name || 'Unknown',
        scores: scoreMap,
      };
    });
  },
};
