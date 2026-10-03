import React from 'react';
import { Sidebar } from './Sidebar';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Sparkles, UserCheck } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { role, theme, setTheme } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* ── Persistent Unified Sidebar ── */}
      <Sidebar />

      {/* ── Main Application Workspace ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header Control Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
            <span className="font-semibold text-xs text-slate-800 tracking-wide uppercase">
              Thozhil Platform
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-700 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Role: <strong className="capitalize text-slate-900">{role}</strong></span>
            </div>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Toggle Appearance"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Dynamic Route Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
