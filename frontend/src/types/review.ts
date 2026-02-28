export interface AnalysisCategory {
  score: number;
  remarks: string;
}

export interface Suggestion {
  severity: 'high' | 'medium' | 'low';
  message: string;
}

export interface Analysis {
  id: string;
  taskId: string;
  repoLink: string;
  analyzedAt: string;
  overallScore: number;
  summary: string;
  categories: {
    codeQuality: AnalysisCategory;
    security: AnalysisCategory;
    performance: AnalysisCategory;
    bestPractices: AnalysisCategory;
    documentation: AnalysisCategory;
  };
  suggestions: Suggestion[];
  filesAnalyzed: number;
  linesOfCode: number;
  languages: Record<string, number>;
}

export interface Review {
  id: string;
  taskId: string;
  adminId: string;
  feedback: string;
  scores: Record<string, number>;
  decision: 'completed' | 'rejected';
  reviewedAt: string;
}
