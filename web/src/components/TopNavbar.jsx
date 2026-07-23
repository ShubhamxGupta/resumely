import React, { useState } from 'react';
import { Search, Bell, Command, User, LogOut, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';

export default function TopNavbar({ user, activeTab, onOpenCommandPalette, onAuthChange }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'scorer': return 'ATS Resume Analyzer';
      case 'history': return 'Analysis Vault';
      case 'resources': return 'ATS Knowledge Matrix';
      case 'rewrite': return 'AI Resume Rewriter';
      case 'recruiter': return 'Recruiter Simulation Mode';
      case 'settings': return 'System Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
        {/* Left Title & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Resumely</span>
          <span className="text-slate-600">/</span>
          <h2 className="text-sm font-semibold text-slate-200">{getTabTitle()}</h2>
        </div>

        {/* Right Search, Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Quick Search & Actions...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Notifications Button */}
          <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute top-2 right-2"></span>
          </button>

          {/* User Account Status & Login Card Button */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono text-xs font-semibold">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-300 hidden md:inline">{user.email}</span>
              </div>
              <button
                onClick={() => onAuthChange(null)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="pl-3 border-l border-slate-800">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal Card Overlay */}
      {showAuthModal && (
        <AuthModal
          user={user}
          onAuthChange={(u) => {
            onAuthChange(u);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
