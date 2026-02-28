import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useTaskStore } from '@/store/taskStore';
import { useReviewStore } from '@/store/reviewStore';
import { PageHeader } from '@/components/common/PageHeader';
import { TECH_STACKS, TECH_STACK_LABELS } from '@/utils/constants';
import { isValidGitHubUrl } from '@/utils/validators';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { FiGithub, FiUpload, FiX, FiFile } from 'react-icons/fi';

const EmployeeSubmitTask = () => {
  const { currentUser } = useAuth();
  const { submitTask } = useTaskStore();
  const { analyzeRepo } = useReviewStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const toggleTech = (tech: string) => {
    setSelectedTechStacks((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf' || file.type === 'text/plain';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        files: 'Some files were invalid. Please upload images (JPG, PNG), PDF, or text files under 10MB.'
      }));
    }
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    if (errors.files) {
      setErrors(prev => {
        const { files, ...rest } = prev;
        return rest;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!githubLink.trim()) newErrors.githubLink = 'GitHub repo link is required';
    else if (!isValidGitHubUrl(githubLink)) newErrors.githubLink = 'Enter a valid GitHub URL';
    if (selectedTechStacks.length === 0) newErrors.techStacks = 'Select at least one tech stack';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !currentUser) return;
    setIsSubmitting(true);
    try {
      const task = await submitTask({
        employeeId: currentUser.id,
        title, description,
        githubRepoLink: githubLink,
        techStacks: selectedTechStacks,
        screenshots: attachedFiles.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          url: URL.createObjectURL(file),
          caption: file.name
        })),
        teamId: currentUser.teamId,
      });
      setIsSubmitting(false);
      setIsAnalyzing(true);
      await analyzeRepo(task.id);
      setIsAnalyzing(false);
      navigate(`/employee/tasks/${task.id}`);
    } catch {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        <div className="text-center">
          <p className="text-[17px] font-semibold">Analyzing your code...</p>
          <p className="text-[15px] text-muted-foreground mt-1">CodeRabbit is reviewing your repository</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Submit Task" description="Submit your completed task for review" />

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-[17px] font-semibold">Task Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-[15px] font-medium mb-1.5 block">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g., Build REST API with Express"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-[15px] h-10"
              />
              {errors.title && <p className="text-[13px] text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="text-[15px] font-medium mb-1.5 block">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Describe what you built, the approach, and any challenges..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-[15px]"
              />
              {errors.description && <p className="text-[13px] text-destructive mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="text-[15px] font-medium mb-1.5 block">
                <FiGithub className="inline h-[18px] w-[18px] mr-1 -mt-0.5" />
                Repository Link <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="https://github.com/username/repo"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="text-[15px] h-10"
              />
              {errors.githubLink && <p className="text-[13px] text-destructive mt-1">{errors.githubLink}</p>}
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-[15px] font-medium mb-2.5 block">
              Tech Stacks <span className="text-destructive">*</span>
              {selectedTechStacks.length > 0 && (
                <span className="text-muted-foreground font-normal ml-1.5">({selectedTechStacks.length} selected)</span>
              )}
            </label>
            <div className="flex gap-2 flex-wrap">
              {TECH_STACKS.map((tech) => {
                const isSelected = selectedTechStacks.includes(tech);
                return (
                  <Badge
                    key={tech}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors text-[13px] px-3 py-1.5',
                      !isSelected && 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => toggleTech(tech)}
                  >
                    {TECH_STACK_LABELS[tech]}
                  </Badge>
                );
              })}
            </div>
            {errors.techStacks && <p className="text-[13px] text-destructive mt-1.5">{errors.techStacks}</p>}
          </div>

          <Separator />

          <div>
            <label className="text-[15px] font-medium mb-2.5 block">
              <FiFile className="inline h-4.5 w-4.5 mr-1 -mt-0.5" />
              Attach Files <span className="text-muted-foreground font-normal ml-1.5">(Optional)</span>
              {attachedFiles.length > 0 && (
                <span className="text-muted-foreground font-normal ml-1.5">({attachedFiles.length} files)</span>
              )}
            </label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FiUpload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-[15px] font-medium text-foreground">Click to upload files</p>
                    <p className="text-[13px] text-muted-foreground">or drag and drop</p>
                    <p className="text-[12px] text-muted-foreground/60 mt-1">Images, PDF, or text files (max 10MB each)</p>
                  </div>
                </label>
              </div>
              
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-foreground">Attached Files:</p>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                      <div className="flex items-center gap-3 min-w-0">
                        <FiFile className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium truncate">{file.name}</p>
                          <p className="text-[12px] text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <FiX className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.files && (
                <p className="text-[13px] text-destructive mt-1.5">{errors.files}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2.5 justify-end">
            <Button variant="outline" onClick={() => navigate('/employee/dashboard')}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSubmitTask;
