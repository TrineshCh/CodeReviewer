import { analyses } from '../mock/reviews';
import { tasks } from '../mock/tasks';
import { simulateDelay } from '../mock/delay';
import { Analysis } from '../types';

export const analysisService = {
  async analyzeRepo(taskId: string): Promise<Analysis> {
    // Simulate CodeRabbit analysis taking time
    await simulateDelay(2000);

    const task = tasks.find((t) => t.id === taskId);
    const mockAnalysis: Analysis = {
      id: `analysis-${Date.now()}`,
      taskId,
      repoLink: task?.githubRepoLink || '',
      analyzedAt: new Date().toISOString(),
      overallScore: Math.floor(Math.random() * 30) + 60,
      summary: 'Code analysis completed. The repository demonstrates a good understanding of the core concepts. There are some areas for improvement in code organization and error handling.',
      categories: {
        codeQuality: { score: Math.floor(Math.random() * 25) + 65, remarks: 'Generally clean code with room for improvement in function decomposition' },
        security: { score: Math.floor(Math.random() * 30) + 55, remarks: 'Basic security practices followed, some improvements needed' },
        performance: { score: Math.floor(Math.random() * 25) + 65, remarks: 'Adequate performance, optimization opportunities exist' },
        bestPractices: { score: Math.floor(Math.random() * 25) + 60, remarks: 'Follows most best practices with some deviations' },
        documentation: { score: Math.floor(Math.random() * 30) + 50, remarks: 'Documentation present but could be more comprehensive' },
      },
      suggestions: [
        { severity: 'medium', message: 'Consider adding more comprehensive error handling' },
        { severity: 'low', message: 'Add inline documentation for complex logic' },
        { severity: 'medium', message: 'Improve test coverage for edge cases' },
      ],
      filesAnalyzed: Math.floor(Math.random() * 20) + 5,
      linesOfCode: Math.floor(Math.random() * 3000) + 500,
      languages: { typescript: 80, javascript: 10, markdown: 10 },
    };

    analyses.push(mockAnalysis);

    if (task) {
      task.analysisId = mockAnalysis.id;
      task.status = 'under-review';
      task.updatedAt = new Date().toISOString();
    }

    return mockAnalysis;
  },

  async getAnalysisByTask(taskId: string): Promise<Analysis | null> {
    await simulateDelay(200);
    return analyses.find((a) => a.taskId === taskId) || null;
  },
};
