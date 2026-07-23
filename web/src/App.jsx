import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [provider, setProvider] = useState('groq');
  const [customKey, setCustomKey] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Command+K Shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAnalyze = async ({ resumeFile, jobDescription }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume({
        resumeFile,
        jobDescription,
        provider,
        customKey,
        token: user?.token || ''
      });
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
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
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
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        provider={provider}
        setProvider={setProvider}
        customKey={customKey}
        setCustomKey={setCustomKey}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar with Auth Login Card Button */}
        <TopNavbar
          user={user}
          activeTab={activeTab}
          onOpenCommandPalette={() => setCmdOpen(true)}
          onAuthChange={setUser}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto overflow-y-auto">
          {error && (
            <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <ExecutiveDashboard onNavigate={setActiveTab} token={user?.token || ''} />
          )}

          {activeTab === 'scorer' && (
            <div>
              <FileUploader onAnalyze={handleAnalyze} loading={loading} />
              <AnalysisDashboard analysis={analysis} onDownloadPdf={handleDownloadPdf} />
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryPage onSelectAnalysis={handleSelectHistory} token={user?.token || ''} />
          )}

          {activeTab === 'rewrite' && <RewritePage />}

          {activeTab === 'recruiter' && <RecruiterPage />}

          {activeTab === 'resources' && <ResourcesPage />}

          {activeTab === 'settings' && (
            <SettingsPage
              provider={provider}
              setProvider={setProvider}
              customKey={customKey}
              setCustomKey={setCustomKey}
            />
          )}
        </main>
      </div>

      {/* Command+K Palette Dialog */}
      {cmdOpen && (
        <div
          onClick={() => setCmdOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#121827] border border-slate-800 rounded-xl shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <input
                autoFocus
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              <kbd className="text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div className="space-y-1 text-xs text-slate-400 font-mono">
              <button
                onClick={() => { setActiveTab('dashboard'); setCmdOpen(false); }}
                className="w-full text-left p-2 rounded hover:bg-slate-800 hover:text-slate-200 flex justify-between"
              >
                <span>Executive Overview</span>
                <span>Tab 1</span>
              </button>
              <button
                onClick={() => { setActiveTab('scorer'); setCmdOpen(false); }}
                className="w-full text-left p-2 rounded hover:bg-slate-800 hover:text-slate-200 flex justify-between"
              >
                <span>ATS Resume Analyzer</span>
                <span>Tab 2</span>
              </button>
              <button
                onClick={() => { setActiveTab('rewrite'); setCmdOpen(false); }}
                className="w-full text-left p-2 rounded hover:bg-slate-800 hover:text-slate-200 flex justify-between"
              >
                <span>Open AI Resume Rewriter</span>
                <span>Tab 4</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
