import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiSun, FiMoon, FiShield, FiUser } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { users } from '@/mock/users';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee'>('admin');
  const [selectedUserId, setSelectedUserId] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const filteredUsers = users.filter((u) => u.role === selectedRole);
  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleRoleChange = (role: 'admin' | 'employee') => {
    setSelectedRole(role);
    setSelectedUserId('');
  };

  const handleLogin = () => {
    if (!selectedUserId) return;
    login(selectedUserId);
    const user = users.find((u) => u.id === selectedUserId);
    navigate(user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-muted/50">
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-5 right-5 h-9 w-9 text-muted-foreground z-10"
        onClick={toggleTheme}
      >
        {theme === 'light' ? <FiMoon className="h-[18px] w-[18px]" /> : <FiSun className="h-[18px] w-[18px]" />}
      </Button>

      {/* Left Panel */}
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-14 bg-background">
        {/* Center */}
        <div className="w-full max-w-[400px] mx-auto">
          {/* Logo */}
          <div className="bg-primary px-4 py-1.5 w-fit">
            <span className="text-[32px] tracking-wide text-primary-foreground" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>Ryft</span>
          </div>
        </div>

        <div className="w-full max-w-[400px] mx-auto">
          <h1 className="text-[28px] font-bold tracking-tight">Welcome Back</h1>
          <p className="text-[15px] text-muted-foreground mt-1.5">Select your role and account to get started</p>

          <div className="mt-8 space-y-5">
            {/* Role Toggle */}
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <button
                className={`flex-1 flex items-center justify-center gap-2 h-10 text-[14px] font-medium rounded-md transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => handleRoleChange('admin')}
              >
                <FiShield className="h-4 w-4" />
                Team Lead
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 h-10 text-[14px] font-medium rounded-md transition-all ${
                  selectedRole === 'employee'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => handleRoleChange('employee')}
              >
                <FiUser className="h-4 w-4" />
                Intern
              </button>
            </div>

            {/* User Select */}
            <div>
              <label className="text-[14px] font-medium mb-1.5 block">Account</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="h-10 text-[14px] w-full">
                  <SelectValue placeholder="Choose account..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} — {user.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected user preview */}
            {selectedUser && (
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-muted/60 border border-border/50">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium truncate">{selectedUser.name}</p>
                  <p className="text-[12px] text-muted-foreground">{selectedUser.designation}</p>
                </div>
              </div>
            )}

            {/* Continue */}
            <Button
              className="w-full h-10 text-[14px] font-medium"
              disabled={!selectedUserId}
              onClick={handleLogin}
            >
              Continue <FiArrowRight className="ml-1.5 h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wider">Demo Mode</span>
              <Separator className="flex-1" />
            </div>

            <p className="text-[13px] text-muted-foreground/50 text-center">
              {filteredUsers.length} {selectedRole === 'admin' ? 'team lead' : 'intern'} accounts available
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[12px] text-muted-foreground/40 max-w-[400px] mx-auto text-center leading-relaxed">
          Submit tasks, get AI-powered code analysis, receive feedback, and track your skill growth — all in one place.
        </p>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block w-[48%] relative overflow-hidden m-3 rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1723958929247-ef054b525153?w=1400&q=80"
          alt="Abstract 3D shape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/10 flex items-center justify-between">
            <div>
              <div className="bg-white/20 px-3 py-1 w-fit mb-1.5">
                <span className="text-[22px] tracking-wide text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>Ryft</span>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">AI-powered code analysis and</p>
              <p className="text-[13px] text-white/50 leading-relaxed">structured reviews for your team.</p>
            </div>
            <div className="flex gap-14">
              {[
                { value: '12+', label: 'Members' },
                { value: '18', label: 'Tech Stacks' },
                { value: 'AI', label: 'Code Review' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[46px] font-bold text-white tabular-nums">{stat.value}</p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
