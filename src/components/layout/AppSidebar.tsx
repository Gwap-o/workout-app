import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DunamisLogo } from '@/components/ui/DunamisLogo';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/supabase/userProfile';
import type { UserProfile } from '@/types';
import {
  Home,
  Dumbbell,
  TrendingUp,
  Utensils,
  BookOpen,
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
  { to: '/program', icon: BookOpen, label: 'Program' },
];

interface AppSidebarProps {
  collapsed?: boolean;
}

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user?.id) {
      getUserProfile(user.id).then(setProfile).catch(console.error);
    }
  }, [user?.id]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#FCFCF9] dark:bg-[#0D1117] border-r border-[#E8EAED] dark:border-[#30363D] flex flex-col z-30 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <Link to="/" className={`px-3 py-4 h-16 border-b border-[#E8EAED] dark:border-[#30363D] flex items-center ${collapsed ? 'justify-center' : ''}`}>
        <DunamisLogo size="md" showText={!collapsed} />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link key={item.to} to={item.to}>
              <Button
                variant={active ? 'default' : 'ghost'}
                className={`w-full h-10 ${
                  collapsed ? 'justify-center px-2' : 'justify-start px-2'
                } ${
                  active
                    ? 'bg-[#20808D] text-white hover:bg-[#1A6B76] dark:bg-[#1FB8CD] dark:hover:bg-[#1FB8CD]'
                    : 'text-[#202124] hover:bg-[#F5F5F5] dark:text-[#E6EDF3] dark:hover:bg-[#1C2128]'
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-2'}`} />
                {!collapsed && <span className="truncate text-sm">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-[#E8EAED] dark:border-[#30363D]">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full px-3 py-4 flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3] truncate">
                    {displayName}
                  </p>
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side={collapsed ? 'right' : 'top'}
            className={`w-72 bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] ${
              collapsed ? 'mb-2' : 'ml-2'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E8EAED] dark:border-[#30363D]">
                <div className="w-10 h-10 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3] truncate">
                    {displayName}
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
    </aside>
  );
}
