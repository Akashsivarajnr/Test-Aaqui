import React, { useState } from 'react';
import { Video, User, Mail, KeyRound, ArrowRight, ShieldCheck, Sparkles, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoCandidateFlow: React.FC = () => {
  const { addToast } = useApp();
  const [step, setStep] = useState<'login' | 'workspace'>('login');
  
  // Login form state
  const [candidateName, setCandidateName] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !emailInput.trim()) {
      addToast('Please fill in your Candidate Name and Email / Room Key', 'error');
      return;
    }
    addToast('Candidate verified! Joining AI Video Interview Room.', 'success');
    setStep('workspace');
  };

  if (step === 'workspace') {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <iframe 
          src="/interview/candidate" 
          className="w-full h-full border-0 flex-1 min-h-[calc(100vh-3.5rem)]" 
          title="AI Video Assessment Workspace" 
        />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Candidate Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2 font-bold text-lg text-[#0B1C30]">
          <Sparkles className="w-5 h-5 text-[#1D78F8]" />
          <span>Thozhil</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200 ml-2">
            AI Video Interview Portal
          </span>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Exit to Home
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 relative overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 relative overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
            <Video className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Thozhil Video Interview</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Candidate Sign In for AI Video Assessment Room
          </p>
        </div>

        {/* Candidate Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full Candidate Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Iyer"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Intern Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ananya.iyer@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => { setCandidateName('Ananya Iyer'); setEmailInput('ananya.iyer@example.com'); }}
            className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium underline block text-right"
          >
            Use Quick Demo Candidate
          </button>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 group"
          >
            <Camera className="w-4 h-4" />
            <span>Enter Video Interview Room</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Card Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            Camera & Voice Ready
          </span>
        </div>
      </div>
    </div>
  </div>
);
};
