export const ROLES = {
  ADMIN: 'admin' as const,
  EMPLOYEE: 'employee' as const,
};

export const TASK_STATUSES = {
  PENDING_ANALYSIS: 'pending-analysis' as const,
  UNDER_REVIEW: 'under-review' as const,
  COMPLETED: 'completed' as const,
  REJECTED: 'rejected' as const,
};

export const TECH_STACKS = [
  'react',
  'angular',
  'vue',
  'nodejs',
  'express',
  'python',
  'django',
  'java',
  'spring',
  'typescript',
  'sql',
  'mongodb',
  'docker',
  'aws',
  'graphql',
  'nextjs',
  'tailwind',
  'csharp',
] as const;

export const TECH_STACK_LABELS: Record<string, string> = {
  react: 'React',
  angular: 'Angular',
  vue: 'Vue.js',
  nodejs: 'Node.js',
  express: 'Express',
  python: 'Python',
  django: 'Django',
  java: 'Java',
  spring: 'Spring Boot',
  typescript: 'TypeScript',
  sql: 'SQL',
  mongodb: 'MongoDB',
  docker: 'Docker',
  aws: 'AWS',
  graphql: 'GraphQL',
  nextjs: 'Next.js',
  tailwind: 'Tailwind CSS',
  csharp: 'C#',
};

export const STATUS_LABELS: Record<string, string> = {
  'pending-analysis': 'Pending Analysis',
  'under-review': 'Under Review',
  completed: 'Completed',
  rejected: 'Rejected',
};
