import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { employeeScores } from '@/mock/scores';
import { users } from '@/mock/users';
import { FiArrowLeft, FiArrowRight, FiMaximize2, FiTrendingUp, FiAward, FiSearch, FiDownload, FiGrid, FiList, FiStar, FiUsers, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const scoreColor = (score: number) => {
  if (score >= 8) return {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-700',
    progress: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    label: 'Expert'
  };
  if (score >= 5) return {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    progress: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    label: 'Proficient'
  };
  return {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-700',
    progress: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    label: 'Developing'
  };
};

const AdminSkillMatrix = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'tasks'>('score');

  const allTechStacks = new Set<string>();
  employeeScores.forEach((es) => {
    Object.entries(es.scores).forEach(([tech, data]) => {
      if (data.count > 0) allTechStacks.add(tech);
    });
  });
  const techStacks = Array.from(allTechStacks);

  const scoredEmployees = useMemo(() => {
    const filtered = employeeScores
      .filter((es) => es.overallAverage > 0)
      .map((es) => {
        const user = users.find((u) => u.id === es.employeeId);
        return { ...es, name: user?.name || 'Unknown', avatar: user?.avatar || '' };
      })
      .filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.overallAverage - a.overallAverage;
        case 'tasks':
          return b.totalTasksCompleted - a.totalTasksCompleted;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchTerm, sortBy]);

  const filteredTechStacks = useMemo(() => {
    if (selectedTech === 'all') return techStacks;
    return techStacks.filter(tech => tech === selectedTech);
  }, [selectedTech, techStacks]);

  const leaderboard = [...scoredEmployees].sort((a, b) => b.overallAverage - a.overallAverage);
  
  const stats = useMemo(() => {
    const totalEmployees = scoredEmployees.length;
    const avgScore = scoredEmployees.reduce((sum, emp) => sum + emp.overallAverage, 0) / totalEmployees || 0;
    const topPerformers = scoredEmployees.filter(emp => emp.overallAverage >= 8).length;
    const totalTasks = scoredEmployees.reduce((sum, emp) => sum + emp.totalTasksCompleted, 0);
    
    return { totalEmployees, avgScore, topPerformers, totalTasks };
  }, [scoredEmployees]);

  const scrollTable = (direction: 'left' | 'right') => {
    const tableContainer = document.getElementById('skill-matrix-table');
    if (tableContainer) {
      const scrollAmount = 300;
      if (direction === 'left') {
        tableContainer.scrollLeft -= scrollAmount;
      } else {
        tableContainer.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader title="Skill Matrix" description="Advanced employee proficiency analytics across tech stacks" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.totalEmployees}</p>
                </div>
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <FiUsers className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.avgScore.toFixed(1)}</p>
                </div>
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <FiBarChart2 className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.topPerformers}</p>
                </div>
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <FiStar className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.totalTasks}</p>
                </div>
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <FiActivity className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="border-2 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={selectedTech} onValueChange={setSelectedTech}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by tech" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technologies</SelectItem>
                    {techStacks.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {TECH_STACK_LABELS[tech] || tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: 'name' | 'score' | 'tasks') => setSortBy(value)}>
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
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-9"
                >
                  <FiGrid className="h-4 w-4 mr-2" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-9"
                >
                  <FiList className="h-4 w-4 mr-2" />
                  Cards
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <FiDownload className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="matrix" className="text-[15px] flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4" />
              Matrix View
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-[15px] flex items-center gap-2">
              <FiAward className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-6">
            {viewMode === 'table' ? (
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FiGrid className="h-5 w-5" />
                      Tech Stack Proficiency Matrix
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm h-6 px-3">
                      {filteredTechStacks.length} technologies
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Enhanced Scroll Controls */}
                  <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium">Expert (8+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-sm font-medium">Proficient (5-7.9)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium">Developing (&lt;5)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollTable('left')}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <FiArrowLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollTable('right')}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <FiArrowRight className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const tableContainer = document.getElementById('skill-matrix-table');
                          if (tableContainer) {
                            tableContainer.scrollLeft = tableContainer.scrollWidth;
                          }
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        <FiMaximize2 className="h-3 w-3 mr-1" />
                        End
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Table */}
                  <div 
                    id="skill-matrix-table"
                    className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 max-h-175"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <Table className="border-separate border-spacing-0">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-2">
                          <TableHead className="sticky left-0 bg-background z-30 w-56 border-r-2 border-b-2 text-xs font-bold uppercase tracking-wider">
                            Employee
                          </TableHead>
                          {filteredTechStacks.map((tech, index) => {
                            return (
                              <TableHead 
                                key={tech} 
                                className={`text-center w-28 text-xs font-bold uppercase tracking-wider border-b-2 border-r-2 ${
                                  index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/10'
                                }`}
                              >
                                <div className="space-y-2 py-2">
                                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-bold leading-tight">
                                    {TECH_STACK_LABELS[tech] || tech}
                                  </div>
                                  <div className="h-1 w-full bg-muted rounded-full"></div>
                                </div>
                              </TableHead>
                            );
                          })}
                          <TableHead className="text-center w-24 text-xs font-bold uppercase tracking-wider bg-muted/20 border-l-2 border-r-2 border-b-2">
                            Overall
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scoredEmployees.map((emp, empIndex) => {
                          const scoreInfo = scoreColor(emp.overallAverage);
                          return (
                            <TableRow
                              key={emp.employeeId}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-b-2 ${
                                empIndex % 2 === 0 ? 'hover:bg-muted/20' : 'bg-muted/5 hover:bg-muted/30'
                              }`}
                              onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
                            >
                              <TableCell className="sticky left-0 bg-background z-20 w-56 border-r-2 border-b-2 p-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                                      <AvatarImage src={emp.avatar} />
                                      <AvatarFallback className="text-sm font-bold bg-muted">
                                        {emp.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                                      emp.overallAverage >= 8 ? 'bg-emerald-500' :
                                      emp.overallAverage >= 5 ? 'bg-amber-500' :
                                      'bg-red-500'
                                    }`}></div>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{emp.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {emp.totalTasksCompleted} tasks
                                      </span>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className={`text-xs font-medium ${scoreInfo.text}`}>
                                        {scoreInfo.label}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              {filteredTechStacks.map((tech, techIndex) => {
                                const data = emp.scores[tech];
                                const hasScore = data && data.count > 0;
                                const techScoreInfo = hasScore ? scoreColor(data.average) : null;
                                
                                return (
                                  <TableCell 
                                    key={tech} 
                                    className={`text-center p-3 w-28 transition-colors border-r-2 border-b-2 ${
                                      techIndex % 2 === 0 ? 'bg-muted/10' : ''
                                    } hover:bg-muted/30`}
                                  >
                                    {hasScore ? (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex flex-col items-center">
                                            <span className={`font-bold text-lg tabular-nums ${techScoreInfo?.text || 'text-muted-foreground'}`}>
                                              {data.average.toFixed(1)}
                                            </span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="text-sm">
                                            <p className="font-semibold">{TECH_STACK_LABELS[tech] || tech}</p>
                                            <p>Average: {data.average.toFixed(1)}</p>
                                            <p>Tasks: {data.count}</p>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    ) : (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg text-muted-foreground/20 font-light">—</span>
                                      </div>
                                    )}
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-center w-24 p-3 bg-muted/20 border-l-2 border-r-2 border-b-2">
                                <div className="flex flex-col items-center">
                                  <span className={`font-bold text-lg tabular-nums ${scoreInfo.text}`}>
                                    {emp.overallAverage.toFixed(1)}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scoredEmployees.map((emp) => {
                  const scoreInfo = scoreColor(emp.overallAverage);
                  const rank = leaderboard.findIndex(e => e.employeeId === emp.employeeId) + 1;
                  
                  return (
                    <Card
                      key={emp.employeeId}
                      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-2 shadow-lg"
                      onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                                <AvatarImage src={emp.avatar} />
                                <AvatarFallback className="text-sm font-bold bg-muted">
                                  {emp.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                                emp.overallAverage >= 8 ? 'bg-emerald-500' :
                                emp.overallAverage >= 5 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}></div>
                            </div>
                            <div>
                              <p className="font-semibold text-base">{emp.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`text-xs ${scoreInfo.bg} ${scoreInfo.border} ${scoreInfo.text}`}>
                                  {scoreInfo.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  #{rank}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Overall Score</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-lg tabular-nums ${scoreInfo.text}`}>
                              {emp.overallAverage.toFixed(1)}
                            </span>
                            <div className={`h-2 w-2 rounded-full ${scoreInfo.progress}`}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tasks Completed</span>
                            <span className="font-medium">{emp.totalTasksCompleted}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tech Stacks</span>
                            <span className="font-medium">
                              {Object.values(emp.scores).filter(d => d.count > 0).length}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Top Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(emp.scores)
                              .filter(([, data]) => data.count > 0)
                              .sort(([, a], [, b]) => b.average - a.average)
                              .slice(0, 3)
                              .map(([tech, data]) => {
                                const techScoreInfo = scoreColor(data.average);
                                return (
                                  <Badge 
                                    key={tech} 
                                    variant="secondary" 
                                    className={`text-xs ${techScoreInfo.bg} ${techScoreInfo.border} ${techScoreInfo.text}`}
                                  >
                                    {TECH_STACK_LABELS[tech] || tech} {data.average.toFixed(0)}
                                  </Badge>
                                );
                              })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="space-y-3">
              {leaderboard.map((emp, idx) => {
                const scoreInfo = scoreColor(emp.overallAverage);
                
                return (
                  <Card
                    key={emp.employeeId}
                    className="cursor-pointer hover:shadow-sm transition-shadow border-2 border-muted-foreground/20 bg-muted/10"
                    onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
                  >
                    <CardContent className="px-6 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Rank Badge */}
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md bg-muted text-muted-foreground shrink-0">
                            {idx + 1}
                          </div>
                          
                          {/* Avatar and Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                              <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                                <AvatarImage src={emp.avatar} />
                                <AvatarFallback className="text-sm font-bold bg-muted">
                                  {emp.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                                emp.overallAverage >= 8 ? 'bg-emerald-500' :
                                emp.overallAverage >= 5 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}></div>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[15px] font-semibold truncate">{emp.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[13px] text-muted-foreground">
                                  {emp.totalTasksCompleted} tasks completed
                                </span>
                                <span className="text-muted-foreground/30">•</span>
                                <span className={`text-[13px] font-medium ${scoreInfo.text}`}>
                                  {scoreInfo.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Score and Rank */}
                        <div className="text-right shrink-0">
                          <div className={`text-[15px] font-bold tabular-nums ${scoreInfo.text}`}>
                            {emp.overallAverage.toFixed(1)}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${scoreInfo.badge} mt-1 inline-block`}>
                            Rank #{idx + 1}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default AdminSkillMatrix;
