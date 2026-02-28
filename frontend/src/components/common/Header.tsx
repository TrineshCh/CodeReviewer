import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { TaskFlowLogo } from './TaskFlowLogo';

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (currentUser) {
      const profilePath = currentUser.role === 'admin' ? '/admin/profile' : '/employee/profile';
      navigate(profilePath);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <TaskFlowLogo scale={0.8} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon className="h-[18px] w-[18px]" /> : <FiSun className="h-[18px] w-[18px]" />}
          </Button>

          {currentUser && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l">
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-3 hover:bg-accent/60 rounded-lg p-2 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-sm font-medium bg-muted">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block leading-tight text-left">
                  <p className="text-[15px] font-medium">{currentUser.name}</p>
                  <p className="text-[13px] text-muted-foreground">{currentUser.designation}</p>
                </div>
              </button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                <FiLogOut className="h-[18px] w-[18px]" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
