import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { useTaskStore } from '@/store/taskStore';
import { users } from '@/mock/users';
import { employeeScores } from '@/mock/scores';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  FiTrendingUp, FiTrendingDown, FiActivity, FiUsers, FiClock, FiAward, 
  FiTarget, FiBarChart2, FiPieChart, FiCalendar, FiDownload
} from 'react-icons/fi';
import { TECH_STACK_LABELS } from '@/utils/constants';

const AdminAnalytics = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'tasks' | 'performance' | 'engagement'>('tasks');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeRange) {
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredTasks = tasks.filter(task => 
      new Date(task.submittedAt) >= filterDate
    );

    // Task completion trends
    const taskTrends = useMemo(() => {
      const trends = [];
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.submittedAt);
          return taskDate >= dayStart && taskDate <= dayEnd;
        });

        trends.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          submitted: dayTasks.length,
          completed: dayTasks.filter(t => t.status === 'completed').length,
          underReview: dayTasks.filter(t => t.status === 'under-review' || t.status === 'pending-analysis').length,
          rejected: dayTasks.filter(t => t.status === 'rejected').length,
        });
      }
      return trends;
    }, [filteredTasks, timeRange]);

    // Tech stack performance
    const techStackPerformance = useMemo(() => {
      const techData = new Map();
      
      filteredTasks.forEach(task => {
        task.techStacks.forEach(tech => {
          if (!techData.has(tech)) {
            techData.set(tech, { total: 0, completed: 0, avgScore: 0, scores: [] });
          }
          const data = techData.get(tech);
          data.total++;
          if (task.status === 'completed') data.completed++;
          // In real app, this would come from actual scores
          data.scores.push(Math.random() * 10 + 3);
        });
      });

      return Array.from(techData.entries()).map(([tech, data]) => ({
        tech,
        name: TECH_STACK_LABELS[tech] || tech,
        total: data.total,
        completed: data.completed,
        completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
        avgScore: data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
      })).sort((a, b) => b.total - a.total);
    }, [filteredTasks]);

    // Employee performance distribution
    const performanceDistribution = useMemo(() => {
      const scores = employeeScores.map(emp => emp.overallAverage);
      return [
        { range: '0-3', count: scores.filter(s => s < 3).length, color: '#ef4444' },
        { range: '3-5', count: scores.filter(s => s >= 3 && s < 5).length, color: '#f97316' },
        { range: '5-7', count: scores.filter(s => s >= 5 && s < 7).length, color: '#eab308' },
        { range: '7-9', count: scores.filter(s => s >= 7 && s < 9).length, color: '#84cc16' },
        { range: '9-10', count: scores.filter(s => s >= 9).length, color: '#22c55e' },
      ];
    }, []);

    // Team productivity
    const teamProductivity = useMemo(() => {
      const teamData = new Map();
      
      users.forEach(user => {
        if (!teamData.has(user.teamId || 'unassigned')) {
          teamData.set(user.teamId || 'unassigned', {
            name: user.teamId ? `Team ${user.teamId}` : 'Unassigned',
            members: 0,
            tasks: 0,
            avgScore: 0
          });
        }
      });

      users.forEach(user => {
        const team = teamData.get(user.teamId || 'unassigned');
        if (team) {
          team.members++;
        }
      });

      filteredTasks.forEach(task => {
        const user = users.find(u => u.id === task.employeeId);
        if (user) {
          const team = teamData.get(user.teamId || 'unassigned');
          if (team) {
            team.tasks++;
          }
        }
      });

      return Array.from(teamData.values()).sort((a, b) => b.tasks - a.tasks);
    }, [filteredTasks]);

    return {
      taskTrends,
      techStackPerformance,
      performanceDistribution,
      teamProductivity,
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter(t => t.status === 'completed').length,
      avgCompletionTime: 3.2, // Mock data
      engagementRate: 78, // Mock data
    };
  }, [tasks, timeRange]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const exportData = () => {
    // In real app, this would generate and download a CSV/Excel file
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics Dashboard" 
        description="Advanced insights and performance metrics"
        action={
          <Button onClick={exportData} className="gap-2">
            <FiDownload className="h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {analyticsData.totalTasks}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    +{Math.floor(Math.random() * 20 + 5)}% from last period
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <FiActivity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completion Rate</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                  {analyticsData.completedTasks > 0 
                    ? ((analyticsData.completedTasks / analyticsData.totalTasks) * 100).toFixed(1)
                    : '0'}%
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    +{Math.floor(Math.random() * 15 + 3)}% improvement
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <FiTarget className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Engagement Rate</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                  {analyticsData.engagementRate}%
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    +{Math.floor(Math.random() * 10 + 2)}% active users
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <FiUsers className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg. Completion</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                  {analyticsData.avgCompletionTime}d
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <FiTrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">
                    -{Math.floor(Math.random() * 5 + 1)}% slower
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <FiClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tasks">Tasks</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FiCalendar className="h-4 w-4" />
              <span>Data as of {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Trends */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiBarChart2 className="h-5 w-5" />
              Task Submission Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.taskTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="submitted" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="underReview" 
                  stackId="1" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="rejected" 
                  stackId="1" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tech Stack Performance */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiPieChart className="h-5 w-5" />
              Tech Stack Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.techStackPerformance.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-muted-foreground">Tasks: {data.total}</p>
                          <p className="text-sm text-muted-foreground">Completed: {data.completed}</p>
                          <p className="text-sm font-medium text-blue-600">
                            Rate: {data.completionRate.toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Distribution */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiAward className="h-5 w-5" />
              Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.performanceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ range, count, percent }) => 
                    `${range}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {analyticsData.performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card className="border-0 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUsers className="h-5 w-5" />
              Team Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.teamProductivity}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-muted-foreground">Tasks: {data.tasks}</p>
                          <p className="text-sm text-muted-foreground">Members: {data.members}</p>
                          <p className="text-sm font-medium text-blue-600">
                            Avg: {data.members > 0 ? (data.tasks / data.members).toFixed(1) : 0} tasks/member
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
