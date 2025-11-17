import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DunamisLogo } from '@/components/ui/DunamisLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useNutrition } from '@/lib/hooks/useNutrition';
import {
  Home,
  Dumbbell,
  TrendingUp,
  Utensils,
  BarChart3,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/workout', icon: Dumbbell, label: 'Log Workout' },
  { to: '/history', icon: TrendingUp, label: 'History' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
];

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export interface SidebarHandle {
  toggleCollapse: () => void;
}

export const Sidebar = forwardRef<SidebarHandle, SidebarProps>(
  ({ onCollapsedChange }, ref) => {
    const [collapsed, setCollapsed] = useState(false);
    const [displayName, setDisplayName] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { profile, loading } = useNutrition();

    // Update display name when profile loads or changes
    useEffect(() => {
      if (profile?.full_name) {
        setDisplayName(profile.full_name);
      } else if (!loading && user?.email) {
        // Only set fallback after loading is complete
        setDisplayName(user.email.split('@')[0]);
      }
    }, [profile, loading, user]);

    useImperativeHandle(ref, () => ({
      toggleCollapse: () => {
        setCollapsed(!collapsed);
        onCollapsedChange?.(!collapsed);
      },
    }));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const active = isActive(item.to);

    const button = (
      <Button
        variant={active ? 'default' : 'ghost'}
        size="default"
        className={`w-full h-10 ${
          collapsed ? 'justify-center px-2' : 'justify-start px-2'
        } ${
          active
            ? 'bg-[#20808D] text-white hover:bg-[#1A6B76] dark:bg-[#1FB8CD] dark:hover:bg-[#2DD4E8]'
            : 'text-[#202124] hover:bg-[#F5F5F5] dark:text-[#E6EDF3] dark:hover:bg-[#1C2128]'
        }`}
      >
        <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-2'}`} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Button>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={item.to}>{button}</Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="dark:bg-gray-800 dark:text-gray-100">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <Link to={item.to}>{button}</Link>;
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className={`px-3 py-4 border-b border-[#E8EAED] dark:border-[#30363D] h-[73px] flex items-center ${collapsed ? 'justify-center' : ''}`}>
        <DunamisLogo size="sm" showText={!collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavButton key={item.to} item={item} />
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[#E8EAED] dark:border-[#30363D]">
        <Popover>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full p-2 h-auto hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128]">
                    <div className="w-10 h-10 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="dark:bg-[#1C2128] dark:text-[#E6EDF3] border-[#E8EAED] dark:border-[#30363D]">
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128]">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3] truncate">
                      {displayName || <span className="text-[#80868B]">Loading...</span>}
                    </p>
                    <p className="text-xs text-[#5F6368] dark:text-[#8B949E] truncate">{user?.email}</p>
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
          )}
          <PopoverContent side={collapsed ? "right" : "top"} className="w-56 bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D]">
            <div className="space-y-2">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E8EAED] dark:border-[#30363D]">
                <div className="w-10 h-10 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3] truncate">
                    {displayName || <span className="text-[#80868B]">Loading...</span>}
                  </p>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E] truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="w-full justify-start text-[#202124] dark:text-[#E6EDF3] hover:bg-[#F5F5F5] dark:hover:bg-[#161B22]"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-[#1C2128] dark:hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );

    return (
      <TooltipProvider delayDuration={300}>
        <div
          className={`fixed left-0 top-0 h-screen bg-white dark:bg-[#161B22] border-r border-[#E8EAED] dark:border-[#30363D] flex flex-col z-30 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <SidebarContent />
        </div>
      </TooltipProvider>
    );
  }
);
