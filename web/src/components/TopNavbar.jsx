import React, { useState } from 'react';
import { Search, Command, Bell, LogIn, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';

const PAGE_META = {
  dashboard: { label: 'Overview',          desc: 'Executive metrics & recent activity' },
  scorer:    { label: 'ATS Scorer',         desc: 'Upload and analyze your resume' },
  history:   { label: 'History',            desc: 'Past evaluations and stored scans' },
  rewrite:   { label: 'AI Rewriter',        desc: 'Rewrite bullets and generate cover letters' },
  recruiter: { label: 'Recruiter View',     desc: 'First-impression simulation mode' },
  resources: { label: 'ATS Guidelines',     desc: 'Best practices and keyword library' },
  settings:  { label: 'Settings',           desc: 'AI engine and account configuration' },
};

export default function TopNavbar({ user, activeTab, onOpenCommandPalette, onAuthChange }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const meta = PAGE_META[activeTab] || PAGE_META.dashboard;

  return (
    <>
      <header
        className="flex items-center justify-between px-6 h-14 sticky top-0 z-30"
        style={{
          background: 'rgba(7, 9, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Left — Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="mono hidden sm:inline"
            style={{ fontSize: '11px', color: 'var(--text-faint)' }}
          >
            resumely
          </span>
          <span style={{ color: 'var(--border-default)', fontSize: '12px' }}>/</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {meta.label}
          </span>
          <span
            className="hidden md:inline"
            style={{ fontSize: '12px', color: 'var(--text-muted)' }}
          >
            — {meta.desc}
          </span>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Search / Command palette trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline" style={{ fontSize: '12px' }}>Search...</span>
            <kbd
              className="hidden sm:flex items-center gap-0.5 mono rounded"
              style={{
                fontSize: '10px',
                padding: '1px 5px',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <Bell className="w-4 h-4" />
            <span
              className="absolute rounded-full"
              style={{
                width: '6px',
                height: '6px',
                top: '8px',
                right: '8px',
                background: 'var(--indigo-400)',
              }}
            />
          </button>

          {/* Auth */}
          <div style={{ paddingLeft: '8px', borderLeft: '1px solid var(--border-subtle)' }}>
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mono text-xs font-semibold shrink-0"
                  style={{
                    background: 'var(--indigo-glow)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    color: 'var(--indigo-400)',
                  }}
                  title={user.email}
                >
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <span
                  className="hidden md:inline text-xs"
                  style={{ color: 'var(--text-secondary)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {user.email}
                </span>
                <button
                  onClick={() => onAuthChange(null)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  title="Sign out"
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--rose-glow)';
                    e.currentTarget.style.color = 'var(--rose-400)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal
          user={user}
          onAuthChange={u => {
            onAuthChange(u);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
