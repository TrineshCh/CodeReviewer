export type TaskStatus = 'pending-analysis' | 'under-review' | 'completed' | 'rejected';

export interface Screenshot {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Task {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  githubRepoLink: string;
  techStacks: string[];
  screenshots: Screenshot[];
  status: TaskStatus;
  submittedAt: string;
  updatedAt: string;
  analysisId: string | null;
  reviewId: string | null;
  teamId: string;
}
