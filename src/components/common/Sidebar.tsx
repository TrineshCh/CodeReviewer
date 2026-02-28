import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  FiHome, FiList, FiUsers, FiGrid, FiLayers, FiCode,
  FiUpload, FiClock, FiMessageSquare,
} from 'react-icons/fi';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
  { label: 'Tasks', path: '/admin/tasks', icon: FiList },
  { label: 'Employees', path: '/admin/employees', icon: FiUsers },
  { label: 'Teams', path: '/admin/teams', icon: FiLayers },
  { label: 'Tech Stack', path: '/admin/tech-stack', icon: FiCode },
  { label: 'Skill Matrix', path: '/admin/skill-matrix', icon: FiGrid },
];

const employeeNav: NavItem[] = [
  { label: 'Dashboard', path: '/employee/dashboard', icon: FiHome },
  { label: 'Submit Task', path: '/employee/submit', icon: FiUpload },
  { label: 'My Tasks', path: '/employee/tasks', icon: FiClock },
  { label: 'Feedback', path: '/employee/feedback', icon: FiMessageSquare },
];

interface SidebarProps {
  role: 'admin' | 'employee';
}

export const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = role === 'admin' ? adminNav : employeeNav;

  return (
    <nav className="w-[250px] min-h-[calc(100vh-64px)] border-r bg-sidebar py-5 px-3 shrink-0">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== `/${role}/dashboard` && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors w-full text-left',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
