import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileTopMenu } from './MobileTopMenu';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { DunamisLogo } from '@/components/ui/DunamisLogo';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-[#FCFCF9] dark:bg-[#0D1117]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar collapsed={sidebarCollapsed} />
      </div>

      <div
        className={`flex-1 flex flex-col ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } ml-0 transition-all duration-300`}
      >
        <header className="bg-[#FCFCF9] dark:bg-[#0D1117] border-b border-[#E8EAED] dark:border-[#30363D] px-4 sm:px-6 lg:px-8 h-16 sticky top-0 z-10 flex items-center justify-between">
          {/* Mobile: Show logo, Desktop: Show breadcrumbs */}
          <div className="lg:hidden">
            <Link to="/workout">
              <DunamisLogo size="sm" showText />
            </Link>
          </div>
          <div className="hidden lg:block">
            <Breadcrumbs onToggleSidebar={handleToggleSidebar} />
          </div>

          {/* Desktop: Theme toggle, Mobile: Menu */}
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <div className="lg:hidden">
            <MobileTopMenu />
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-6">
          {children}
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
