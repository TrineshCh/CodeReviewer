import { create } from 'zustand';
import { User, EmployeeScore, Team } from '../types';
import { employeeService } from '../api/employeeService';

interface EmployeeState {
  employees: User[];
  scores: EmployeeScore[];
  teams: Team[];
  isLoading: boolean;
  fetchEmployees: () => Promise<void>;
  fetchScores: (employeeId?: string) => Promise<void>;
  fetchTeams: () => Promise<void>;
  addEmployee: (employee: User) => Promise<void>;
  addTeam: (team: Team) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  scores: [],
  teams: [],
  isLoading: false,
  fetchEmployees: async () => {
    set({ isLoading: true });
    const employees = await employeeService.getEmployees();
    set({ employees, isLoading: false });
  },
  fetchScores: async (employeeId) => {
    const scores = await employeeService.getScores(employeeId);
    set({ scores });
  },
  fetchTeams: async () => {
    const teams = await employeeService.getTeams();
    set({ teams });
  },
  addEmployee: async (employee) => {
    await employeeService.addEmployee(employee);
    const employees = await employeeService.getEmployees();
    set({ employees });
  },
  addTeam: async (team) => {
    await employeeService.addTeam(team);
    const teams = await employeeService.getTeams();
    set({ teams });
  },
}));
