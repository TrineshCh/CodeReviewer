export interface TechStackScore {
  total: number;
  count: number;
  average: number;
}

export interface EmployeeScore {
  employeeId: string;
  scores: Record<string, TechStackScore>;
  overallAverage: number;
  totalTasksCompleted: number;
  totalTasksRejected: number;
}
