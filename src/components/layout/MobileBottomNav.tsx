import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/history', icon: TrendingUp, label: 'History' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/', icon: Home, label: 'Dashboard', isCenter: true },
  { to: null, icon: User, label: 'Profile', isProfile: true },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string | null) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#161B22] border-t border-[#E8EAED] dark:border-[#30363D] z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          if (item.isProfile) {
            return (
              <Popover key="profile">
                <PopoverTrigger asChild>
                  <button className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-[#5F6368] dark:text-[#8B949E]">
                    <div className="w-8 h-8 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs">{item.label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-56 bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] mb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#E8EAED] dark:border-[#30363D]">
                      <div className="w-10 h-10 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3] truncate">
                          {user?.email?.split('@')[0]}
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
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to!}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                item.isCenter
                  ? 'relative -mt-6'
                  : ''
              }`}
            >
              {item.isCenter ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                  active
                    ? 'bg-[#20808D] dark:bg-[#1FB8CD]'
                    : 'bg-[#20808D]/80 dark:bg-[#1FB8CD]/80'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <Icon className={`w-6 h-6 ${
                    active
                      ? 'text-[#20808D] dark:text-[#1FB8CD]'
                      : 'text-[#5F6368] dark:text-[#8B949E]'
                  }`} />
                  <span className={`text-xs ${
                    active
                      ? 'text-[#20808D] dark:text-[#1FB8CD] font-medium'
                      : 'text-[#5F6368] dark:text-[#8B949E]'
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
