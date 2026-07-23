import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import FileUploader from './components/FileUploader';
import AnalysisDashboard from './components/AnalysisDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import HistoryPage from './pages/HistoryPage';
import ResourcesPage from './pages/ResourcesPage';
import RewritePage from './pages/RewritePage';
import RecruiterPage from './pages/RecruiterPage';
import SettingsPage from './pages/SettingsPage';
import { analyzeResume, generatePdfReport } from './services/api';

const CMD_ITEMS = [
  { id: 'dashboard', label: 'Executive Overview',    group: 'Navigation', shortcut: 'G O' },
  { id: 'scorer',    label: 'ATS Resume Scorer',     group: 'Navigation', shortcut: 'G S' },
  { id: 'history',   label: 'Analysis History',      group: 'Navigation', shortcut: 'G H' },
  { id: 'rewrite',   label: 'AI Resume Rewriter',    group: 'Navigation', shortcut: 'G R' },
  { id: 'recruiter', label: 'Recruiter Simulation',  group: 'Navigation', shortcut: 'G C' },
  { id: 'resources', label: 'ATS Guidelines',        group: 'Navigation', shortcut: 'G G' },
  { id: 'settings',  label: 'Settings',              group: 'Navigation', shortcut: 'G ,' },
];

export default function App() {
  const [provider, setProvider]     = useState('groq');
  const [customKey, setCustomKey]   = useState('');
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [loading, setLoading]       = useState(false);
  const [analysis, setAnalysis]     = useState(null);
  const [error, setError]           = useState(null);
  const [cmdOpen, setCmdOpen]       = useState(false);
  const [cmdQuery, setCmdQuery]     = useState('');
  const [cmdIdx, setCmdIdx]         = useState(0);
  const cmdInputRef                 = useRef(null);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resumely_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleAuthChange = (newUser) => {
    setUser(newUser);
    if (newUser) localStorage.setItem('resumely_user', JSON.stringify(newUser));
    else localStorage.removeItem('resumely_user');
  };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
        setCmdQuery('');
        setCmdIdx(0);
      }
      if (e.key === 'Escape' && cmdOpen) setCmdOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cmdOpen]);

  // Focus input when palette opens
  useEffect(() => {
    if (cmdOpen) setTimeout(() => cmdInputRef.current?.focus(), 50);
  }, [cmdOpen]);

  const filteredCmds = cmdQuery
    ? CMD_ITEMS.filter(i => i.label.toLowerCase().includes(cmdQuery.toLowerCase()))
    : CMD_ITEMS;

  const handleCmdKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCmdIdx(v => Math.min(v + 1, filteredCmds.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCmdIdx(v => Math.max(v - 1, 0)); }
    if (e.key === 'Enter' && filteredCmds[cmdIdx]) {
      setActiveTab(filteredCmds[cmdIdx].id);
      setCmdOpen(false);
    }
  };

  // ── Analyze ──
  const handleAnalyze = async ({ resumeFile, jobDescription }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume({ resumeFile, jobDescription, provider, customKey, token: user?.token || '' });
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!analysis) return;
    try {
      const blob = await generatePdfReport(analysis, user?.token || '');
      const url  = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', 'ats_resume_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF report. Ensure backend is running.');
    }
  };

  const handleSelectHistory = (analysisData) => {
    setAnalysis(analysisData);
    setActiveTab('scorer');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* ── Sidebar ── */}
      <Sidebar
        provider={provider}
        setProvider={setProvider}
        customKey={customKey}
        setCustomKey={setCustomKey}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── Main Column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNavbar
          user={user}
          activeTab={activeTab}
          onOpenCommandPalette={() => { setCmdOpen(true); setCmdQuery(''); setCmdIdx(0); }}
          onAuthChange={handleAuthChange}
        />

        <main style={{ flex: 1, padding: '32px', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          {/* Error Toast */}
          {error && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl mb-6 animate-fadeUp"
              style={{ background: 'var(--rose-glow)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              <span style={{ fontSize: '13px', color: 'var(--rose-400)' }}>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{ marginLeft: 'auto', color: 'var(--rose-400)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}

          {activeTab === 'dashboard'  && <ExecutiveDashboard onNavigate={setActiveTab} token={user?.token || ''} />}
          {activeTab === 'scorer'     && (
            <div>
              <FileUploader onAnalyze={handleAnalyze} loading={loading} />
              <AnalysisDashboard analysis={analysis} onDownloadPdf={handleDownloadPdf} />
            </div>
          )}
          {activeTab === 'history'    && <HistoryPage onSelectAnalysis={handleSelectHistory} token={user?.token || ''} />}
          {activeTab === 'rewrite'    && <RewritePage provider={provider} customKey={customKey} token={user?.token || ''} />}
          {activeTab === 'recruiter'  && <RecruiterPage />}
          {activeTab === 'resources'  && <ResourcesPage />}
          {activeTab === 'settings'   && <SettingsPage provider={provider} setProvider={setProvider} customKey={customKey} setCustomKey={setCustomKey} />}
        </main>
      </div>

      {/* ── Command Palette ── */}
      {cmdOpen && (
        <div
          onClick={() => setCmdOpen(false)}
          className="animate-fadeIn"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '120px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full animate-fadeUp"
            style={{
              maxWidth: '520px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}
          >
            {/* Search input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <path d="M10 6.5C10 8.43 8.43 10 6.5 10S3 8.43 3 6.5 4.57 3 6.5 3 10 4.57 10 6.5zm-.5 4.207 2.647 2.647a.5.5 0 1 0 .707-.707L10.207 9.5A5.5 5.5 0 1 0 9.5 10.207z" fill="currentColor" />
              </svg>
              <input
                ref={cmdInputRef}
                value={cmdQuery}
                onChange={e => { setCmdQuery(e.target.value); setCmdIdx(0); }}
                onKeyDown={handleCmdKeyDown}
                placeholder="Navigate to..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              />
              <kbd
                className="mono"
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div style={{ padding: '8px', maxHeight: '380px', overflowY: 'auto' }}>
              {filteredCmds.length === 0 ? (
                <p style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                  No results for "{cmdQuery}"
                </p>
              ) : (
                <>
                  <p className="section-label" style={{ padding: '6px 10px 4px', fontSize: '10px' }}>
                    Navigation
                  </p>
                  {filteredCmds.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setCmdOpen(false); }}
                      className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2.5 transition-all"
                      style={{
                        background: i === cmdIdx ? 'var(--indigo-glow)' : 'transparent',
                        border: i === cmdIdx ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                        color: i === cmdIdx ? 'var(--indigo-400)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        marginBottom: '2px',
                      }}
                      onMouseEnter={() => setCmdIdx(i)}
                    >
                      <span style={{ fontSize: '13px', fontWeight: i === cmdIdx ? 600 : 400 }}>
                        {item.label}
                      </span>
                      <kbd
                        className="mono"
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'var(--bg-overlay)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {item.shortcut}
                      </kbd>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 mono"
              style={{
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(255,255,255,0.02)',
                fontSize: '10px',
                color: 'var(--text-faint)',
              }}
            >
              <span><kbd style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', padding: '1px 4px', borderRadius: '3px' }}>↑↓</kbd> navigate</span>
              <span><kbd style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', padding: '1px 4px', borderRadius: '3px' }}>↵</kbd> select</span>
              <span><kbd style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', padding: '1px 4px', borderRadius: '3px' }}>ESC</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
