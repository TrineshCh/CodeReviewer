import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeStore } from '@/store/employeeStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { employeeScores } from '@/mock/scores';
import { tasks } from '@/mock/tasks';
import { teams } from '@/mock/teams';
import { TECH_STACK_LABELS } from '@/utils/constants';
import { useDebounce } from '@/hooks/useDebounce';

const scoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const AdminEmployeeList = () => {
  const { employees, fetchEmployees, addEmployee } = useEmployeeStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', designation: '', teamId: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  const filteredEmployees = employees.filter((emp) => {
    if (!debouncedSearch) return true;
    return emp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      emp.designation.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.designation.trim()) errs.designation = 'Designation is required';
    if (!form.teamId) errs.teamId = 'Team is required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    await addEmployee({
      id: `emp-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      designation: form.designation.trim(),
      role: 'employee',
      teamId: form.teamId,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    });
    setIsSubmitting(false);
    setForm({ name: '', email: '', designation: '', teamId: '' });
    setErrors({});
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees"
        description={`${employees.length} team members`}
        action={
          <div className="flex items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." />
            <Button size="sm" className="gap-1.5" onClick={() => setDialogOpen(true)}>
              <FiPlus className="h-4 w-4" /> Add Employee
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const scores = employeeScores.find((s) => s.employeeId === emp.id);
          const empTasks = tasks.filter((t) => t.employeeId === emp.id);
          const completedTasks = empTasks.filter((t) => t.status === 'completed').length;

          const topSkills = scores
            ? Object.entries(scores.scores)
                .filter(([, data]) => data.count > 0)
                .sort(([, a], [, b]) => b.average - a.average)
                .slice(0, 3)
            : [];

          return (
            <Card key={emp.id} className="flex flex-col">
              <CardContent className="px-7 pt-5 pb-4 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-14 w-14 shrink-0">
                    <AvatarImage src={emp.avatar} />
                    <AvatarFallback className="text-base font-medium bg-muted">{emp.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[18px] font-semibold truncate leading-tight">{emp.name}</p>
                    <p className="text-[14px] text-muted-foreground mt-0.5">{emp.designation}</p>
                  </div>
                </div>

                {topSkills.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-6">
                    {topSkills.map(([tech, data]) => (
                      <Badge key={tech} variant="secondary" className="text-[13px] px-3 py-1 font-normal text-muted-foreground">
                        {TECH_STACK_LABELS[tech] || tech} {data.average.toFixed(0)}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-0.5">Total tasks</p>
                    <p className="text-[20px] font-bold tabular-nums leading-tight">{empTasks.length}</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-0.5">Completed</p>
                    <p className="text-[20px] font-bold tabular-nums leading-tight">{completedTasks}</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-0.5">Avg score</p>
                    {scores && scores.overallAverage > 0 ? (
                      <p className={`text-[20px] font-bold tabular-nums leading-tight ${scoreColor(scores.overallAverage)}`}>
                        {scores.overallAverage.toFixed(1)}/10
                      </p>
                    ) : (
                      <p className="text-[20px] font-bold text-muted-foreground/40 leading-tight">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-0.5">Reviews</p>
                    <p className="text-[20px] font-bold tabular-nums leading-tight">{scores?.totalTasksCompleted || 0}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <Separator className="mb-5" />
                  <Button
                    variant="outline"
                    className="w-full text-[15px] font-medium h-11 rounded-xl"
                    onClick={() => navigate(`/admin/employees/${emp.id}`)}
                  >
                    View details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Name <span className="text-destructive">*</span></label>
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
              />
              {errors.name && <p className="text-[13px] text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Email <span className="text-destructive">*</span></label>
              <Input
                type="email"
                placeholder="email@company.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
              />
              {errors.email && <p className="text-[13px] text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Designation <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Software Intern"
                value={form.designation}
                onChange={(e) => { setForm({ ...form, designation: e.target.value }); setErrors({ ...errors, designation: '' }); }}
              />
              {errors.designation && <p className="text-[13px] text-destructive mt-1">{errors.designation}</p>}
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Team <span className="text-destructive">*</span></label>
              <Select value={form.teamId} onValueChange={(val) => { setForm({ ...form, teamId: val }); setErrors({ ...errors, teamId: '' }); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teamId && <p className="text-[13px] text-destructive mt-1">{errors.teamId}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmployeeList;
