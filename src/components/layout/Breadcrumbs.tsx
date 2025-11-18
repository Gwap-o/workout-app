import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeNames: Record<string, string> = {
  '': 'Log Workout',
  'workout': 'Log Workout',
  'history': 'Workout History',
  'nutrition': 'Nutrition',
  'program': 'Program',
  'settings': 'Settings',
};

interface BreadcrumbsProps {
  onToggleSidebar?: () => void;
}

export function Breadcrumbs({ onToggleSidebar }: BreadcrumbsProps) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex items-center gap-4">
      {/* Sidebar Toggle Button */}
      {onToggleSidebar && (
        <>
          <button
            onClick={onToggleSidebar}
            className="p-3 hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128] rounded-md text-[#5F6368] dark:text-[#8B949E] hover:text-[#202124] dark:hover:text-[#E6EDF3] -ml-3"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
          <div className="h-4 w-px bg-[#E8EAED] dark:bg-[#30363D]" />
        </>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-3 text-sm ml-1">
        {pathnames.length === 0 ? (
          <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Log Workout</span>
        ) : (
          <>
            <Link
              to="/workout"
              className="text-[#5F6368] hover:text-[#202124] dark:text-[#8B949E] dark:hover:text-[#E6EDF3]"
            >
              Log Workout
            </Link>

            {pathnames.map((segment, index) => {
              const path = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

              return (
                <div key={path} className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-[#80868B] dark:text-[#6E7681]" />
                  {isLast ? (
                    <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">{name}</span>
                  ) : (
                    <Link
                      to={path}
                      className="text-[#5F6368] hover:text-[#202124] dark:text-[#8B949E] dark:hover:text-[#E6EDF3]"
                    >
                      {name}
                    </Link>
                  )}
                </div>
              );
            })}
          </>
        )}
      </nav>
    </div>
  );
}
