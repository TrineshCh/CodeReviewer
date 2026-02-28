import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FiHome, FiList, FiUsers, FiLayers, FiGrid, FiUpload, FiClock, FiMessageSquare, FiUser,
  FiBarChart2, FiAward
} from 'react-icons/fi';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
  submenu?: NavItem[];
}

const adminNav: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/admin/dashboard', 
    icon: FiHome, 
    description: 'Overview and analytics',
    badge: 'New'
  },
  { 
    label: 'Tasks', 
    path: '/admin/tasks', 
    icon: FiList, 
    description: 'Manage all task submissions',
    badge: '12'
  },
  { 
    label: 'Employees', 
    path: '/admin/employees', 
    icon: FiUsers, 
    description: 'Team member management'
  },
  { 
    label: 'Teams', 
    path: '/admin/teams', 
    icon: FiLayers, 
    description: 'Team organization'
  },
  { 
    label: 'Tech Stack', 
    path: '/admin/tech-stack-members', 
    icon: FiGrid, 
    description: 'Technology expertise',
    badge: '8'
  },
  { 
    label: 'Skill Matrix', 
    path: '/admin/skill-matrix', 
    icon: FiBarChart2, 
    description: 'Performance analytics',
  },
];

const employeeNav: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/employee/dashboard', 
    icon: FiHome, 
    description: 'Your personal overview'
  },
  { 
    label: 'Submit Task', 
    path: '/employee/submit', 
    icon: FiUpload, 
    description: 'Upload your work'
  },
  { 
    label: 'My Tasks', 
    path: '/employee/tasks', 
    icon: FiClock, 
    description: 'Task history and status',
    badge: '5'
  },
  { 
    label: 'Feedback', 
    path: '/employee/feedback', 
    icon: FiMessageSquare, 
    description: 'Review and comments'
  },
  { 
    label: 'Profile', 
    path: '/employee/profile', 
    icon: FiUser, 
    description: 'Account settings'
  },
];

interface SidebarProps {
  role: 'admin' | 'employee';
}

export const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = role === 'admin' ? adminNav : employeeNav;

  return (
    <nav className="w-[280px] min-h-[calc(100vh-64px)] border-r bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">TaskFlow</h2>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {role === 'admin' ? 'Admin Panel' : 'Employee Portal'}
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          
          {/* Quick Stats */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sidebar-accent/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FiList className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-lg font-bold text-sidebar-foreground">
                      {role === 'admin' ? '24' : '5'}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Tasks</p>
                  </div>
                </div>
              </div>
              <div className="bg-sidebar-accent/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FiAward className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-lg font-bold text-sidebar-foreground">
                      {role === 'admin' ? '8' : '3'}
                    </p>
                    <p className="text-xs text-muted-foreground">Top Performers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== `/${role}/dashboard` && location.pathname.startsWith(item.path));
              
              return (
                <div key={item.path}>
                  {item.submenu ? (
                    // Parent with submenu
                    <div>
                      <button
                        onClick={() => navigate(item.path)}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-lg text-[14px] font-medium transition-colors group',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg'
                            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-[18px] w-[18px]" />
                            <div className="text-left">
                              <p className="font-semibold">{item.label}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </div>
                          {item.badge && (
                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {item.badge}
                            </div>
                          )}
                        </div>
                        <FiList className="h-4 w-4 text-muted-foreground group-hover:text-sidebar-accent-foreground" />
                      </button>
                      
                      {/* Submenu items */}
                      {isActive && item.submenu && (
                        <div className="mt-2 pl-6 space-y-1">
                          {item.submenu.map((subItem) => (
                            <button
                              key={subItem.path}
                              onClick={() => navigate(subItem.path)}
                              className={cn(
                                'w-full flex items-center gap-3 p-2 rounded-md text-[13px] transition-colors',
                                location.pathname === subItem.path
                                  ? 'bg-sidebar-accent/30 text-sidebar-accent-foreground'
                                  : 'text-muted-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground'
                              )}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <div className="text-left">
                                <p className="font-medium">{subItem.label}</p>
                                {subItem.description && (
                                  <p className="text-xs text-muted-foreground">{subItem.description}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Regular item */
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg text-[14px] font-medium transition-colors group',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg'
                          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                      </div>
                      {item.badge && (
                        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold ml-auto">
                          {item.badge}
                        </div>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Version 2.0.1
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-muted-foreground">System Active</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
