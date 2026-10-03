import React, { useState } from 'react';
import { Code2, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, Lock, Sparkles, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CodingCandidateFlow: React.FC = () => {
  const { addToast } = useApp();
  const [step, setStep] = useState<'login' | 'code' | 'workspace'>('login');
  
  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // 6-digit code state
  const [accessCode, setAccessCode] = useState('INT901');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      addToast('Please enter your Intern Email or ID', 'error');
      return;
    }
    addToast('Authenticated successfully. Enter 6-digit access code.', 'success');
    setStep('code');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim() || accessCode.trim().length < 4) {
      addToast('Please enter a valid 6-digit access code', 'error');
      return;
    }
    addToast('Access code verified! Launching Coding Assessment.', 'success');
    setStep('workspace');
  };

  if (step === 'workspace') {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <iframe 
          src="/coding-candidate/" 
          className="w-full h-full border-0 flex-1 min-h-[calc(100vh-3.5rem)]" 
          title="AI Coding Assessment Workspace" 
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
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-200 ml-2">
            Coding Assessment Portal
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
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4">
            <Code2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Thozhil Coding Assessment</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {step === 'login' 
              ? 'Candidate Sign In for AI Coding Evaluation' 
              : 'Enter your 6-digit assessment access code'}
          </p>
        </div>

        {/* Step 1: Candidate Login */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Intern Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. sanjay@stripe.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Password / Candidate Passcode</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => { setEmailInput('sanjay@stripe.com'); setPasswordInput('password123'); }}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-medium underline block text-right"
            >
              Use Quick Demo Credentials
            </button>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Sign In & Proceed to 6-Digit Code</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        )}

        {/* Step 2: 6-Digit Access Code Entry */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                6-Digit Access Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="INT901"
                className="w-full text-center text-3xl font-mono font-bold tracking-[0.3em] py-3.5 bg-slate-50 border-2 border-blue-500/50 rounded-2xl text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 uppercase shadow-inner"
              />
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Enter code provided by your evaluator (e.g. <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">INT901</code> or <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">A3F9X1</code>)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Card Footer */}
          <span className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            Thozhil Proctor Active
          </span>
        </div>
      </div>
    </div>
  );
};
