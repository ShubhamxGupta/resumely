import React from 'react';
import {
  LayoutDashboard,
  FileCheck,
  History,
  BookOpen,
  Wand2,
  Eye,
  Settings,
  Cpu,
  Server,
  Key
} from 'lucide-react';

export default function Sidebar({
  provider,
  setProvider,
  customKey,
  setCustomKey,
  activeTab,
  setActiveTab
}) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'scorer', label: 'ATS Resume Scorer', icon: FileCheck },
    { id: 'history', label: 'Analysis Vault', icon: History },
    { id: 'rewrite', label: 'AI Resume Rewriter', icon: Wand2, badge: 'PRO' },
    { id: 'recruiter', label: 'Recruiter Simulation', icon: Eye, badge: 'NEW' },
    { id: 'resources', label: 'ATS Guidelines', icon: BookOpen },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const providers = [
    { id: 'groq', name: 'Groq (Llama 3.3 70B)' },
    { id: 'openai', name: 'OpenAI (GPT-4o Mini)' },
    { id: 'gemini', name: 'Google Gemini 1.5' },
    { id: 'claude', name: 'Anthropic Claude 3.5' },
    { id: 'offline', name: 'Offline Rule Parser' }
  ];

  return (
    <aside className="w-72 bg-[#121827] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-40">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>Resumely</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">v2.0</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-mono">Enterprise ATS Suite</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-3 py-2">Workspace Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 border border-indigo-500/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Engine Provider Configuration Box */}
      <div className="p-3 mx-3 my-2 linear-card space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span>LLM Gateway</span>
        </div>

        <div>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-[#090D16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {provider !== 'offline' && (
          <div className="relative">
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="Custom API key..."
              className="w-full bg-[#090D16] border border-slate-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 font-mono"
            />
            <Key className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        )}
      </div>

      {/* Sidebar Footer Status */}
      <div className="p-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Engine Ready
        </span>
        <span>Localhost:8000</span>
      </div>
    </aside>
  );
}
