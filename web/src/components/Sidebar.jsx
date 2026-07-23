import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileCheck,
  History,
  BookOpen,
  Wand2,
  Eye,
  Settings,
  Server,
  Key,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

export default function Sidebar({
  provider,
  setProvider,
  customKey,
  setCustomKey,
  activeTab,
  setActiveTab
}) {
  const [llmOpen, setLlmOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, group: 'main' },
    { id: 'scorer',    label: 'ATS Scorer',      icon: FileCheck,       group: 'main' },
    { id: 'history',   label: 'History',          icon: History,         group: 'main' },
    { id: 'rewrite',   label: 'AI Rewriter',      icon: Wand2,           group: 'tools', badge: 'PRO' },
    { id: 'recruiter', label: 'Recruiter View',   icon: Eye,             group: 'tools', badge: 'NEW' },
    { id: 'resources', label: 'ATS Guidelines',   icon: BookOpen,        group: 'tools' },
    { id: 'settings',  label: 'Settings',         icon: Settings,        group: 'config' },
  ];

  const providers = [
    { id: 'groq',    name: 'Groq — Llama 3.3 70B' },
    { id: 'openai',  name: 'OpenAI — GPT-4o Mini' },
    { id: 'gemini',  name: 'Google — Gemini 1.5' },
    { id: 'claude',  name: 'Anthropic — Claude 3.5' },
    { id: 'offline', name: 'Offline Rule Engine' },
  ];

  const groups = [
    { key: 'main',   label: 'Workspace' },
    { key: 'tools',  label: 'Tools' },
    { key: 'config', label: 'Config' },
  ];

  const getProviderName = (id) => providers.find(p => p.id === id)?.name?.split('—')[0]?.trim() || id;

  return (
    <aside
      className="w-64 flex flex-col h-screen sticky top-0 z-40"
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* ── Brand ── */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'var(--indigo-glow)',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          <Zap className="w-4 h-4" style={{ color: 'var(--indigo-400)' }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              Resumely
            </span>
            <span className="tag tag-indigo" style={{ fontSize: '9px', padding: '1px 6px' }}>v2</span>
          </div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
            ATS Intelligence Suite
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {groups.map((group) => {
          const items = navItems.filter(i => i.group === group.key);
          return (
            <div key={group.key} className="mb-4">
              <div
                className="section-label px-3 mb-1.5"
                style={{ fontSize: '10px' }}
              >
                {group.label}
              </div>
              {items.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg mb-0.5 text-left group"
                    style={{
                      position: 'relative',
                      background: isActive ? 'var(--indigo-glow)' : 'transparent',
                      color: isActive ? 'var(--indigo-400)' : 'var(--text-muted)',
                      border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                      transition: 'all 0.15s var(--ease-out)',
                      animationDelay: `${idx * 0.04}s`,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '3px',
                          height: '16px',
                          background: 'var(--indigo-400)',
                          borderRadius: '0 2px 2px 0',
                        }}
                      />
                    )}
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span
                        className="tag"
                        style={{
                          fontSize: '9px',
                          padding: '1px 6px',
                          background: item.badge === 'PRO' ? 'var(--indigo-glow)' : 'var(--emerald-glow)',
                          color: item.badge === 'PRO' ? 'var(--indigo-400)' : 'var(--emerald-400)',
                          border: item.badge === 'PRO' ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(16,185,129,0.2)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* ── LLM Gateway (collapsible) ── */}
      <div
        className="mx-3 mb-3 rounded-lg overflow-hidden"
        style={{ border: '1px solid var(--border-subtle)' }}
      >
        <button
          onClick={() => setLlmOpen(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            transition: 'background 0.15s',
            fontSize: '11px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
        >
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5" style={{ color: 'var(--indigo-400)' }} />
            <span className="font-medium" style={{ fontSize: '12px' }}>AI Engine</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {getProviderName(provider)}
            </span>
          </div>
          {llmOpen
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          }
        </button>

        {llmOpen && (
          <div
            className="px-3 pb-3 pt-2 space-y-2.5"
            style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)' }}
          >
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              className="input select"
              style={{ fontSize: '12px', padding: '7px 32px 7px 10px' }}
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {provider !== 'offline' && (
              <div style={{ position: 'relative' }}>
                <Key
                  className="w-3 h-3"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="password"
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                  placeholder="Custom API key..."
                  className="input input-mono"
                  style={{ paddingLeft: '28px', fontSize: '11px', padding: '7px 10px 7px 28px' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Status Footer ── */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--emerald-400)' }}
          />
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Engine ready
          </span>
        </div>
        <span className="mono" style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
          :8000
        </span>
      </div>
    </aside>
  );
}
