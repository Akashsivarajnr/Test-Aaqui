import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { InternDashboard } from './pages/InternDashboard';
import { HistoryPage } from './pages/HistoryPage';
import { InternsListPage } from './pages/InternsListPage';
import { InternDetailPage } from './pages/InternDetailPage';
import { MainLayout } from './components/MainLayout';
import { ToastContainer } from './components/ui/PremiumComponents';
import { CodingCandidateFlow } from './components/CodingCandidateFlow';
import { VideoCandidateFlow } from './components/VideoCandidateFlow';

// Route guard checking if user has selected a profile role
const RequireRole = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'authority' | 'intern' | 'any' }) => {
  const { role } = useApp();

  if (role === 'none') {
    return <Navigate to="/" replace />;
  }

  if (allowedRole !== 'any' && role !== allowedRole) {
    return <Navigate to={role === 'authority' ? '/authority' : '/intern'} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const RequireCandidate = ({ children }: { children: React.ReactNode }) => {
  const { role, setRole } = useApp();

  React.useEffect(() => {
    if (role === 'none') {
      setRole('intern');
    }
  }, [role, setRole]);

  return <div className="w-screen h-screen bg-slate-50 font-sans overflow-hidden">{children}</div>;
};

function AppContent() {
  const { role } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            role === 'none' ? (
              <LandingPage />
            ) : (
              <Navigate to={role === 'intern' ? '/intern' : '/authority'} replace />
            )
          } 
        />

        <Route
          path="/project-analysis"
          element={
            <RequireRole allowedRole="any">
              {role === 'intern' ? <InternDashboard /> : <AuthorityDashboard />}
            </RequireRole>
          }
        />

        <Route
          path="/authority"
          element={
            <RequireRole allowedRole="authority">
              <AuthorityDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/intern"
          element={
            <RequireRole allowedRole="intern">
              <InternDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/interns"
          element={
            <RequireRole allowedRole="any">
              <InternsListPage />
            </RequireRole>
          }
        />

        <Route
          path="/interns/:id"
          element={
            <RequireRole allowedRole="any">
              <InternDetailPage />
            </RequireRole>
          }
        />

        {/* Embedded Module Routes with 100% Persistent Sidebar */}
        <Route
          path="/coding-module"
          element={
            <RequireRole allowedRole="authority">
              <div className="w-full h-full flex flex-col bg-white">
                <iframe src="/coding/" className="w-full h-full border-0 flex-1 min-h-[calc(100vh-3.5rem)]" title="AI Coding Interviewer" />
              </div>
            </RequireRole>
          }
        />

        <Route
          path="/interview-module"
          element={
            <RequireRole allowedRole="authority">
              <div className="w-full h-full flex flex-col bg-white">
                <iframe src="/interview/" className="w-full h-full border-0 flex-1 min-h-[calc(100vh-3.5rem)]" title="AI Video Interviewer" />
              </div>
            </RequireRole>
          }
        />

        <Route
          path="/resume-module"
          element={
            <RequireRole allowedRole="authority">
              <div className="w-full h-full flex flex-col bg-white">
                <iframe src="/resume/" className="w-full h-full border-0 flex-1 min-h-[calc(100vh-3.5rem)]" title="AI Resume Screener" />
              </div>
            </RequireRole>
          }
        />

        <Route
          path="/coding-candidate-module"
          element={
            <RequireCandidate>
              <CodingCandidateFlow />
            </RequireCandidate>
          }
        />

        <Route
          path="/interview-candidate-module"
          element={
            <RequireCandidate>
              <VideoCandidateFlow />
            </RequireCandidate>
          }
        />

        <Route
          path="/history"
          element={
            <RequireRole allowedRole="any">
              <HistoryPage />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
