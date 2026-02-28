export const statusColors: Record<string, string> = {
  'pending-analysis': 'blue',
  'under-review': 'yellow',
  completed: 'green',
  rejected: 'red',
};

export const severityColors: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
};

export const scoreColor = (score: number): string => {
  if (score >= 8) return 'green';
  if (score >= 5) return 'yellow';
  return 'red';
};
