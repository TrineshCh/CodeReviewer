import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { useNotification } from '@/components/common/NotificationSystem';
import { getTopMembersPerTechStack } from '@/utils/techStackUtils';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { users } from '@/mock/users';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiDownload, FiTrendingUp, FiUsers, FiAward, FiBarChart2, FiStar, FiGrid } from 'react-icons/fi';
import { Progress } from '@/components/ui/progress';
import { TooltipProvider } from '@/components/ui/tooltip';



const scoreColor = (score: number) => {
  if (score >= 8) return {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-700',
    progress: 'bg-emerald-500',
    label: 'Expert'
  };
  if (score >= 5) return {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    progress: 'bg-amber-500',
    label: 'Proficient'
  };
  return {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-700',
    progress: 'bg-red-500',
    label: 'Developing'
  };
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const TechStackMembers = () => {
  const [selectedTechStack, setSelectedTechStack] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'tasks' | 'name'>('score');
  const topMembersByTechStack = getTopMembersPerTechStack();
  const { addNotification } = useNotification();

  // Simulate team lead feedback (in real app, this would come from backend)
  useEffect(() => {
    const handleTeamLeadFeedback = (event: CustomEvent) => {
      const { internName, taskTitle } = event.detail;
      
      addNotification({
        type: 'info',
        title: `Task Review Feedback`,
        message: `${internName}'s task "${taskTitle}" has been reviewed by team lead.`,
        duration: 6000,
      });
    };

    // Listen for custom events from team lead feedback
    window.addEventListener('teamLeadFeedback', handleTeamLeadFeedback as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('teamLeadFeedback', handleTeamLeadFeedback as EventListener);
    };
  }, [addNotification]);

  // Enhanced data preparation with filtering and sorting
  const processedData = useMemo(() => {
    const filtered = topMembersByTechStack.map(tech => ({
      ...tech,
      topMembers: tech.topMembers
        .filter(member => {
          const user = users.find((u) => u.id === member.employeeId);
          return user?.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'score':
              return b.average - a.average;
            case 'tasks':
              return b.totalTasks - a.totalTasks;
            case 'name': {
              const userA = users.find((u) => u.id === a.employeeId);
              const userB = users.find((u) => u.id === b.employeeId);
              return (userA?.name || '').localeCompare(userB?.name || '');
            }
            default:
              return 0;
          }
        })
    }));

    return filtered;
  }, [searchTerm, sortBy, topMembersByTechStack]);

  const selectedTechData = useMemo(() => {
    if (selectedTechStack === 'all' || selectedTechStack === '') return null;
    return processedData.find((t) => t.techStack === selectedTechStack);
  }, [selectedTechStack, processedData]);

  // Enhanced stats calculation
  const stats = useMemo(() => {
    const totalTechStacks = processedData.length;
    const totalMembers = processedData.reduce((acc, tech) => acc + tech.topMembers.length, 0);
    const topPerformers = processedData.reduce((acc, tech) => 
      acc + tech.topMembers.filter(m => m.average >= 8).length, 0
    );
    const avgScore = totalMembers > 0 
      ? processedData.reduce((acc, tech) => acc + tech.topMembers.reduce((sum, m) => sum + m.average, 0), 0) / totalMembers 
      : 0;
    
    return { totalTechStacks, totalMembers, topPerformers, avgScore };
  }, [processedData]);

  // Prepare data for charts
  const techStackDistribution = useMemo(() => processedData.map((tech, index) => ({
    name: TECH_STACK_LABELS[tech.techStack] || tech.techStack,
    members: tech.topMembers.length,
    fill: COLORS[index % COLORS.length],
  })), [processedData]);

  const performanceData = useMemo(() => processedData.flatMap(tech =>
    tech.topMembers.slice(0, 3).map(member => {
      const user = users.find((u) => u.id === member.employeeId);
      return {
        name: user?.name || 'Unknown',
        score: member.average,
        tech: TECH_STACK_LABELS[tech.techStack] || tech.techStack,
      };
    })
  ).slice(0, 10), [processedData]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader 
          title="Tech Stack Analytics" 
          description="Advanced technology performance insights and team expertise distribution" 
        />

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tech Stacks</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.totalTechStacks}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiGrid className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Members</p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">{stats.totalMembers}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiUsers className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Top Performers</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">{stats.topPerformers}</p>
                </div>
                <div className="h-12 w-12 bg-amber-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiStar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Average Score</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{stats.avgScore.toFixed(1)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiBarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={selectedTechStack} onValueChange={setSelectedTechStack}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Select a tech stack" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technologies</SelectItem>
                    {processedData.map((tech) => (
                      <SelectItem key={tech.techStack} value={tech.techStack}>
                        {TECH_STACK_LABELS[tech.techStack] || tech.techStack} ({tech.topMembers.length} members)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: 'score' | 'tasks' | 'name') => setSortBy(value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="tasks">Tasks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <FiDownload className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <button
                  onClick={() => {
                    const event = new CustomEvent('teamLeadFeedback', {
                      detail: {
                        type: 'success',
                        internName: 'John Doe',
                        taskTitle: 'React Component Development',
                        feedback: 'Great work on the component architecture!'
                      }
                    });
                    window.dispatchEvent(event);
                  }}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors h-9"
                >
                  Test Notification
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Top Performers Section */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FiAward className="h-5 w-5" />
                Top Performers by Tech Stack
              </CardTitle>
              <Badge variant="secondary" className="text-sm h-6 px-3">
                {selectedTechData ? selectedTechData.topMembers.length : stats.totalMembers} members
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTechData ? (
              <div className="space-y-6">
                {/* Enhanced Selected Tech Stack Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500 shadow-lg"></div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {TECH_STACK_LABELS[selectedTechData.techStack] || selectedTechData.techStack}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedTechData.topMembers.length} total members
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {selectedTechData.topMembers.length > 0 
                        ? (selectedTechData.topMembers.reduce((sum, m) => sum + m.average, 0) / selectedTechData.topMembers.length).toFixed(1)
                        : '0'
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>

                {/* Enhanced Top Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTechData.topMembers.map((member, idx: number) => {
                    const user = users.find((u) => u.id === member.employeeId);
                    const scoreInfo = scoreColor(member.average);
                    
                    return (
                      <Card
                        key={member.employeeId}
                        className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-0 shadow-lg"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                                idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' :
                                idx === 1 ? 'bg-gradient-to-br from-gray-400 to-slate-500 text-white' :
                                idx === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {idx + 1}
                              </div>
                              <Avatar className="h-12 w-12 mt-3 ring-2 ring-background shadow-md">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-muted to-muted/60">
                                  {user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-base truncate">{user?.name}</p>
                              <p className="text-sm text-muted-foreground mb-2">{user?.designation}</p>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Score</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-lg tabular-nums ${scoreInfo.text}`}>
                                      {member.average.toFixed(1)}
                                    </span>
                                    <div className={`h-2 w-2 rounded-full ${scoreInfo.progress}`}></div>
                                  </div>
                                </div>
                                <Progress value={member.average * 10} className="h-2" />
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Tasks</span>
                                  <span className="font-medium">{member.totalTasks}</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Team</span>
                                  <span className="font-medium">
                                    {user?.teamId ? `Team ${user.teamId}` : 'No team'}
                                  </span>
                                </div>
                                
                                <Badge className={`text-xs w-full justify-center ${scoreInfo.bg} ${scoreInfo.border} ${scoreInfo.text}`}>
                                  {scoreInfo.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedTechData.topMembers.length === 0 && (
                  <div className="text-center py-16">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUsers className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground mb-2">
                      No members found for this technology
                    </p>
                    <p className="text-sm text-muted-foreground/60">
                      Team members need to complete tasks to generate tech stack insights
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiGrid className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground mb-2">
                  Select a tech stack to view top performers
                </p>
                <p className="text-sm text-muted-foreground/60">
                  Choose from the dropdown above to see detailed member information
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FiGrid className="h-5 w-5" />
                Tech Stack Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={techStackDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="members"
                    label={({ name, percent, members }) => 
                      percent > 0.05 ? `${name}: ${members}` : name
                    }
                  >
                    {techStackDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = techStackDistribution.reduce((sum, item) => sum + item.members, 0);
                        const percentage = ((data.members / total) * 100).toFixed(1);
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.members} members</p>
                            <p className="text-sm font-medium text-blue-600">{percentage}% of total</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Enhanced Legend */}
              <div className="mt-4 space-y-3 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-muted-foreground mb-2">All Tech Stacks:</p>
                <div className="grid grid-cols-2 gap-2">
                  {techStackDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div 
                        className="w-3 h-3 rounded-sm shadow-sm" 
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="truncate font-medium">{item.name}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {item.members}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FiTrendingUp className="h-5 w-5" />
                Top Performance Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const scoreInfo = scoreColor(data.score);
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.tech}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-bold">Score: {data.score.toFixed(1)}</p>
                              <div className={`h-2 w-2 rounded-full ${scoreInfo.progress}`}></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TechStackMembers;
