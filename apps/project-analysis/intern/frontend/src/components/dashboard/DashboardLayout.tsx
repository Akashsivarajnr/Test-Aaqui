import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { History, LogOut, Moon, Sun, LayoutDashboard, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImage from '../../../assets/thozhill-removebg.webp';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { role, setRole, theme, setTheme, projects, selectedProjectId, setSelectedProjectId, isServerConnected } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setRole('none');
    navigate('/');
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
      path: role === 'authority' ? '/authority' : '/intern'
    },
    {
      name: 'Log History',
      icon: <History size={16} />,
      path: '/history'
    }
  ];

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const userInitials = role === 'authority' ? 'SJ' : 'SK';
  const userName = role === 'authority' ? 'Sarah Jenkins' : 'Sanjay Kumar';
  const roleName = role === 'authority' ? 'MANAGER' : 'INTERN';

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary-light dark:text-textPrimary-dark flex flex-col md:flex-row transition-colors duration-200">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-borderLight dark:border-borderDark bg-white dark:bg-cardDark shrink-0 flex flex-col z-20">

        {/* Brand */}
        <div className="h-14 flex items-center px-5 border-b border-borderLight dark:border-borderDark">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logoImage} alt="Thozhil Logo" className="h-7 w-auto object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150
                  ${isActive
                    ? 'bg-brand-light text-secondary dark:bg-secondary/15 dark:text-blue-400 font-semibold'
                    : 'text-textSecondary-light dark:text-textSecondary-dark hover:bg-bgLight dark:hover:bg-slate-800/60 hover:text-textPrimary-light dark:hover:text-textPrimary-dark'
                  }
                `}
              >
                <span className={isActive ? 'text-secondary' : ''}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-borderLight dark:border-borderDark space-y-2">
          {/* User card */}
          <div className="px-3 py-2.5 flex items-center gap-2.5 rounded-lg bg-bgLight dark:bg-bgDark">
            {/* Avatar — brand blue initials circle */}
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {userInitials}
            </div>
            <div className="truncate min-w-0 flex-1">
              <div className="text-xs font-semibold truncate text-textPrimary-light dark:text-textPrimary-dark">
                {userName}
              </div>
              <span className={`role-badge ${role === 'authority' ? 'role-badge-authority' : 'role-badge-intern'} mt-0.5`}>
                {roleName}
              </span>
            </div>
          </div>

          <div className="flex gap-1.5">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-2 flex items-center justify-center rounded-lg border border-borderLight hover:bg-red-50 hover:border-red-200 hover:text-danger transition-colors text-xs font-medium gap-1.5 text-textSecondary-light"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Sticky Header */}
        <header className="h-14 border-b border-borderLight dark:border-borderDark bg-white dark:bg-cardDark sticky top-0 z-10 px-5 flex items-center justify-between shrink-0">
          {/* Project selector */}
          <div className="flex items-center gap-2.5">
            <label className="label-caps text-textSecondary-light dark:text-textSecondary-dark hidden sm:inline">
              Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-bgLight dark:bg-bgDark border border-borderLight dark:border-borderDark rounded-md px-2.5 py-1.5 text-xs font-medium text-textPrimary-light dark:text-textPrimary-dark focus:outline-none transition-all cursor-pointer"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.code} — {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right side removed */}
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1 max-w-[1280px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
