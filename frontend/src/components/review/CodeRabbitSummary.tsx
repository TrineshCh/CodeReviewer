import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Analysis } from '@/types';
import { FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface CodeRabbitSummaryProps {
  analysis: Analysis;
}

const categoryLabels: Record<string, string> = {
  codeQuality: 'Code Quality',
  security: 'Security',
  performance: 'Performance',
  bestPractices: 'Best Practices',
  documentation: 'Documentation',
};

const scoreColor = (score: number) => {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const progressColor = (score: number) => {
  if (score >= 70) return '[&>div]:bg-emerald-500';
  if (score >= 50) return '[&>div]:bg-amber-500';
  return '[&>div]:bg-red-500';
};

const severityConfig: Record<string, { icon: React.ElementType; class: string }> = {
  high: { icon: FiAlertTriangle, class: 'text-red-500' },
  medium: { icon: FiAlertCircle, class: 'text-amber-500' },
  low: { icon: FiInfo, class: 'text-muted-foreground' },
};

export const CodeRabbitSummary = ({ analysis }: CodeRabbitSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[17px] font-semibold">CodeRabbit Analysis</CardTitle>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {analysis.filesAnalyzed} files &middot; {analysis.linesOfCode.toLocaleString()} lines analyzed
            </p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold tabular-nums ${scoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}
            </span>
            <span className="text-[13px] text-muted-foreground">/100</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        <p className="text-[15px] text-muted-foreground leading-relaxed">{analysis.summary}</p>

        <Separator />

        <div>
          <h4 className="text-[15px] font-semibold mb-3">Category Scores</h4>
          <div className="grid gap-3">
            {Object.entries(analysis.categories).map(([key, category]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[13px] text-muted-foreground w-32 shrink-0">{categoryLabels[key] || key}</span>
                <Progress value={category.score} className={`h-2 flex-1 ${progressColor(category.score)}`} />
                <span className={`text-[13px] font-bold w-8 text-right tabular-nums ${scoreColor(category.score)}`}>{category.score}</span>
              </div>
            ))}
          </div>
        </div>

        {analysis.suggestions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-[15px] font-semibold mb-2.5">
                Suggestions
                <Badge variant="secondary" className="ml-2 text-xs text-muted-foreground">{analysis.suggestions.length}</Badge>
              </h4>
              <div className="space-y-2.5">
                {analysis.suggestions.map((suggestion, idx) => {
                  const config = severityConfig[suggestion.severity] || severityConfig.low;
                  const SeverityIcon = config.icon;
                  return (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <SeverityIcon className={`h-4 w-4 mt-0.5 shrink-0 ${config.class}`} />
                      <span className="text-[13px] text-muted-foreground leading-relaxed">{suggestion.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
