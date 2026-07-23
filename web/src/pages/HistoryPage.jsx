import React, { useEffect, useState } from 'react';
import { Clock, Trash2, ArrowRight, RefreshCw, FileText, Search } from 'lucide-react';
import { fetchHistory, deleteHistory } from '../services/api';

const getScoreColor = (s) => {
  if (s >= 80) return { color: 'var(--emerald-400)', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' };
  if (s >= 60) return { color: '#60a5fa',            bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' };
  if (s >= 40) return { color: 'var(--amber-400)',   bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' };
  return         { color: 'var(--rose-400)',    bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.2)'  };
};

export default function HistoryPage({ onSelectAnalysis, token = '' }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory(token);
      setHistory(data || []);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, [token]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteHistory(id, token);
      setHistory(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = history.filter(item =>
    !search || (item.filename || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analysis History</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {history.length > 0
              ? `${history.length} saved evaluation${history.length !== 1 ? 's' : ''} — click any row to reload results`
              : 'Past resume scans and stored ATS evaluations'}
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="btn btn-ghost"
          style={{ padding: '8px 14px', fontSize: '12px' }}
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      {history.length > 0 && (
        <div style={{ position: 'relative', maxWidth: '340px' }}>
          <Search
            className="w-3.5 h-3.5"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by filename..."
            className="input"
            style={{ paddingLeft: '34px', fontSize: '13px' }}
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div
              key={i}
              className="card animate-pulse"
              style={{ height: '72px' }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center text-center py-16 gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
          >
            <FileText className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {search ? 'No results found' : 'No history yet'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '280px' }}>
              {search
                ? `No evaluations match "${search}"`
                : 'Run your first ATS analysis to start building a history'}
            </p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Table Header */}
          <div
            className="grid px-6 py-3 hidden md:grid"
            style={{
              gridTemplateColumns: '1fr 120px 140px 80px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {['Resume File', 'ATS Score', 'Date', ''].map((col) => (
              <span key={col} className="section-label" style={{ fontSize: '10px' }}>{col}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y">
            {filtered.map((item, idx) => {
              const score = Math.round(item.ats_score || 0);
              const sc = getScoreColor(score);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAnalysis(item.analysis_result)}
                  className="grid px-6 py-4 cursor-pointer items-center gap-4 animate-fadeUp"
                  style={{
                    gridTemplateColumns: '1fr 120px 140px 80px',
                    borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background 0.15s',
                    animationDelay: `${idx * 0.04}s`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* File name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
                    >
                      <FileText className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.filename || 'Resume Document'}
                    </p>
                  </div>

                  {/* Score badge */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg mono font-bold"
                      style={{ fontSize: '13px', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}
                    >
                      {score} <span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.7 }}>/100</span>
                    </span>
                  </div>

                  {/* Date */}
                  <p className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={e => handleDelete(e, item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--text-muted)', background: 'transparent' }}
                      title="Delete"
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose-glow)'; e.currentTarget.style.color = 'var(--rose-400)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
