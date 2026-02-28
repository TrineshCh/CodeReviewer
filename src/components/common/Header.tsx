import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="bg-primary px-3 py-1">
          <span className="text-[26px] tracking-wide text-primary-foreground" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>Ryft</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon className="h-[18px] w-[18px]" /> : <FiSun className="h-[18px] w-[18px]" />}
          </Button>

          {currentUser && (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-sm font-medium bg-muted">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block leading-tight">
                <p className="text-[15px] font-medium">{currentUser.name}</p>
                <p className="text-[13px] text-muted-foreground">{currentUser.designation}</p>
              </div>
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
