import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  TrendingUp,
  Utensils,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Target,
  Library,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { to: '/workout', icon: Dumbbell, label: 'Log Workout' },
  { to: '/history', icon: TrendingUp, label: 'History' },
  { to: '/indicators', icon: Target, label: 'Indicators' },
  { to: '/exercises', icon: Library, label: 'Exercises' },
  { to: '/guide', icon: BookOpen, label: 'Guide' },
  { to: '/nutrition', icon: Utensils, label: 'Nutrition' },
];

export function MobileTopMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/workout') return location.pathname === '/' || location.pathname === '/workout';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (to: string) => {
    navigate(to);
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#161B22] transition-colors"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#202124] dark:text-[#E6EDF3]" />
        ) : (
          <Menu className="w-6 h-6 text-[#202124] dark:text-[#E6EDF3]" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-[#FCFCF9] dark:bg-[#0D1117] border-l border-[#E8EAED] dark:border-[#30363D] z-[110] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E8EAED] dark:border-[#30363D]">
            <h2 className="text-lg font-bold text-[#202124] dark:text-[#E6EDF3]">
              Menu
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#161B22]"
            >
              <X className="w-5 h-5 text-[#202124] dark:text-[#E6EDF3]" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-[#E8EAED] dark:border-[#30363D]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3] truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <button
                  key={item.to}
                  onClick={() => handleNavClick(item.to)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                      : 'text-[#202124] dark:text-[#E6EDF3] hover:bg-[#F5F5F5] dark:hover:bg-[#161B22]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle & Settings */}
          <div className="p-4 space-y-2 border-t border-[#E8EAED] dark:border-[#30363D]">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-base font-medium text-[#202124] dark:text-[#E6EDF3]">
                Theme
              </span>
              <ThemeToggle />
            </div>

            {/* Settings */}
            <button
              onClick={() => handleNavClick('/settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#202124] dark:text-[#E6EDF3] hover:bg-[#F5F5F5] dark:hover:bg-[#161B22] transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#1C2128] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
