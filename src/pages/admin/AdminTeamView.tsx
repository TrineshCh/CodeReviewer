import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeStore } from '@/store/employeeStore';
import { PageHeader } from '@/components/common/PageHeader';
import { users } from '@/mock/users';
import { tasks as allTasks } from '@/mock/tasks';
import { employeeScores } from '@/mock/scores';
import { TECH_STACK_LABELS } from '@/utils/constants';

const AdminTeamView = () => {
  const navigate = useNavigate();
  const { teams, employees, fetchTeams, fetchEmployees, addTeam } = useEmployeeStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', project: '', description: '', leadId: '' });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchTeams(); fetchEmployees(); }, []);

  const admins = users.filter((u) => u.role === 'admin');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Team name is required';
    if (!form.project.trim()) errs.project = 'Project is required';
    if (!form.leadId) errs.leadId = 'Lead is required';
    if (selectedMembers.length === 0) errs.members = 'Select at least one member';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    await addTeam({
      id: `team-${Date.now()}`,
      name: form.name.trim(),
      project: form.project.trim(),
      description: form.description.trim(),
      leadId: form.leadId,
      memberIds: selectedMembers,
    });
    setIsSubmitting(false);
    setForm({ name: '', project: '', description: '', leadId: '' });
    setSelectedMembers([]);
    setErrors({});
    setDialogOpen(false);
  };

  const toggleMember = (empId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
    setErrors({ ...errors, members: '' });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teams"
        description="Team overview for project assignments"
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setDialogOpen(true)}>
            <FiPlus className="h-4 w-4" /> Create Team
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teams.map((team) => {
          const lead = users.find((u) => u.id === team.leadId);
          const members = team.memberIds
            .map((id) => users.find((u) => u.id === id))
            .filter(Boolean);
          const teamTasks = allTasks.filter((t) => t.teamId === team.id);
          const completedTasks = teamTasks.filter((t) => t.status === 'completed').length;

          return (
            <Card key={team.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-[17px]">{team.name}</CardTitle>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{team.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 text-muted-foreground">{team.project}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[15px] font-medium">{lead?.name || '—'}</p>
                    <p className="text-[13px] text-muted-foreground">Team Lead</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold tabular-nums">{teamTasks.length}</p>
                    <p className="text-[13px] text-muted-foreground">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold tabular-nums">{completedTasks}</p>
                    <p className="text-[13px] text-muted-foreground">Done</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-2">
                    Members ({members.length})
                  </p>
                  <div className="space-y-0.5">
                    {members.map((member) => {
                      if (!member) return null;
                      const scores = employeeScores.find((s) => s.employeeId === member.id);
                      const topSkills = scores
                        ? Object.entries(scores.scores)
                            .filter(([, data]) => data.count > 0)
                            .sort(([, a], [, b]) => b.average - a.average)
                            .slice(0, 2)
                        : [];

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-accent/60 cursor-pointer transition-colors"
                          onClick={() => navigate(`/admin/employees/${member.id}`)}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs font-medium bg-muted">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-[15px] font-medium truncate">{member.name}</p>
                              <p className="text-[13px] text-muted-foreground">{member.designation}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            {topSkills.map(([tech, data]) => (
                              <Badge key={tech} variant="secondary" className="text-xs font-normal text-muted-foreground">
                                {TECH_STACK_LABELS[tech] || tech} {data.average.toFixed(0)}
                              </Badge>
                            ))}
                            {topSkills.length === 0 && (
                              <span className="text-[13px] text-muted-foreground/40">No scores</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Team Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Team Name <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Backend Warriors"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
              />
              {errors.name && <p className="text-[13px] text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Project <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Customer Portal"
                value={form.project}
                onChange={(e) => { setForm({ ...form, project: e.target.value }); setErrors({ ...errors, project: '' }); }}
              />
              {errors.project && <p className="text-[13px] text-destructive mt-1">{errors.project}</p>}
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder="Brief team description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="text-[14px] resize-none"
              />
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Team Lead <span className="text-destructive">*</span></label>
              <Select value={form.leadId} onValueChange={(val) => { setForm({ ...form, leadId: val }); setErrors({ ...errors, leadId: '' }); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a lead" />
                </SelectTrigger>
                <SelectContent>
                  {admins.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name} — {a.designation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leadId && <p className="text-[13px] text-destructive mt-1">{errors.leadId}</p>}
            </div>
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Members <span className="text-destructive">*</span></label>
              <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto p-2 rounded-lg border">
                {employees.map((emp) => {
                  const isSelected = selectedMembers.includes(emp.id);
                  return (
                    <Badge
                      key={emp.id}
                      variant={isSelected ? 'default' : 'secondary'}
                      className={`cursor-pointer text-[13px] px-3 py-1.5 transition-colors ${
                        isSelected ? '' : 'text-muted-foreground hover:bg-accent'
                      }`}
                      onClick={() => toggleMember(emp.id)}
                    >
                      {emp.name}
                    </Badge>
                  );
                })}
              </div>
              {selectedMembers.length > 0 && (
                <p className="text-[13px] text-muted-foreground mt-1">{selectedMembers.length} selected</p>
              )}
              {errors.members && <p className="text-[13px] text-destructive mt-1">{errors.members}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeamView;
