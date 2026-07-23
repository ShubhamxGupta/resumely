import React, { useEffect, useState } from 'react';
import {
  FileCheck,
  TrendingUp,
  Award,
  Zap,
  Target,
  ArrowRight,
  UploadCloud,
  Clock,
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { fetchHistory } from '../services/api';

export default function ExecutiveDashboard({ onNavigate, token = '' }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchHistory(token);
        setHistory(data || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const totalAudits = history.length;
  const avgScore = totalAudits > 0
    ? (history.reduce((acc, c) => acc + (c.ats_score || 0), 0) / totalAudits).toFixed(1)
    : null;
  const avgMatch = totalAudits > 0
    ? (history.reduce((acc, c) => acc + (c.keyword_match || 0), 0) / totalAudits).toFixed(1)
    : null;
  const bestScore = totalAudits > 0
    ? Math.max(...history.map(h => h.ats_score || 0))
    : null;

  const kpis = [
    {
      label: 'Average ATS Score',
      value: avgScore ? `${avgScore}` : '—',
      sub: avgScore ? 'out of 100' : 'no data yet',
      icon: Award,
      color: 'var(--indigo-400)',
      glow: 'var(--indigo-glow)',
      border: 'rgba(99,102,241,0.2)',
    },
    {
      label: 'Avg Keyword Match',
      value: avgMatch ? `${avgMatch}%` : '—',
      sub: avgMatch ? 'job description match' : 'no data yet',
      icon: Target,
      color: 'var(--emerald-400)',
      glow: 'var(--emerald-glow)',
      border: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'Resumes Analyzed',
      value: `${totalAudits}`,
      sub: 'total evaluations',
      icon: FileCheck,
      color: 'var(--sky-400)',
      glow: 'var(--sky-glow)',
      border: 'rgba(14,165,233,0.2)',
    },
    {
      label: 'Best Score',
      value: bestScore !== null ? `${Math.round(bestScore)}` : '—',
      sub: bestScore !== null ? 'personal best' : 'no data yet',
      icon: TrendingUp,
      color: 'var(--amber-400)',
      glow: 'var(--amber-glow)',
      border: 'rgba(245,158,11,0.2)',
    },
  ];

  const getScoreColor = (s) => {
    if (s >= 80) return 'var(--emerald-400)';
    if (s >= 60) return '#60a5fa';
    if (s >= 40) return 'var(--amber-400)';
    return 'var(--rose-400)';
  };

  return (
    <div className="space-y-8 animate-fadeUp">

      {/* ── Hero Banner ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #1a1f35 0%, #111827 50%, #0f1420 100%)',
          border: '1px solid rgba(99,102,241,0.18)',
          boxShadow: '0 0 80px rgba(99,102,241,0.08)',
        }}
      >
        {/* Background mesh */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
          }}
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10">
          <div style={{ maxWidth: '520px' }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--indigo-400)' }} />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--indigo-400)', fontWeight: 600 }}>
                AI-Powered ATS Intelligence
              </span>
            </div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: '1.2',
                marginBottom: '12px',
              }}
            >
              Resume Intelligence
              <span style={{ color: 'var(--indigo-400)' }}> Suite</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.65', maxWidth: '420px' }}>
              Multi-dimensional ATS scoring, skill validation with sentence transformers, AI bullet rewriting, and formal PDF report generation — all in one workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('scorer')}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyze Resume</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
            <button
              onClick={() => onNavigate('rewrite')}
              className="btn btn-ghost"
              style={{ padding: '10px 24px', fontSize: '13px', justifyContent: 'center' }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI Rewriter</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="card card-hover p-5 animate-fadeUp"
              style={{ animationDelay: `${0.1 + idx * 0.07}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {kpi.label}
                </p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: kpi.glow, border: `1px solid ${kpi.border}` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                </div>
              </div>
              <p
                className="mono"
                style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}
              >
                {kpi.value}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '6px' }}>
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Recent Activity + Quick Start ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card" style={{ overflow: 'hidden' }}>
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4" style={{ color: 'var(--indigo-400)' }} />
              <h3 className="section-title">Recent Evaluations</h3>
            </div>
            {totalAudits > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="flex items-center gap-1.5"
                style={{ fontSize: '12px', color: 'var(--indigo-400)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => (
                <div
                  key={i}
                  className="h-14 rounded-xl animate-pulse"
                  style={{ background: 'var(--bg-overlay)' }}
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
              >
                <FileCheck className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  No evaluations yet
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Upload your first resume to generate metrics
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {history.slice(0, 5).map((item, idx) => {
                const s = Math.round(item.ats_score || 0);
                return (
                  <div
                    key={item.id}
                    className="px-6 py-3.5 flex items-center justify-between gap-4 animate-fadeUp"
                    style={{ animationDelay: `${0.2 + idx * 0.05}s`, borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center mono shrink-0"
                        style={{
                          background: `${getScoreColor(s)}18`,
                          border: `1px solid ${getScoreColor(s)}30`,
                          fontSize: '13px',
                          fontWeight: 700,
                          color: getScoreColor(s),
                        }}
                      >
                        {s}
                      </div>
                      <div className="min-w-0">
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.filename || 'Resume Document'}
                        </p>
                        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                          {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-16 h-1.5 rounded-full overflow-hidden shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s}%`, background: getScoreColor(s) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 flex flex-col gap-3">
          <h3 className="section-title mb-2">Quick Actions</h3>
          {[
            { id: 'scorer',    label: 'New ATS Analysis',     desc: 'Upload & score a resume',    icon: BarChart2,   color: 'var(--indigo-400)',  glow: 'var(--indigo-glow)',  border: 'rgba(99,102,241,0.2)' },
            { id: 'rewrite',   label: 'Rewrite Bullets',      desc: 'AI-powered bullet points',   icon: Zap,         color: 'var(--emerald-400)', glow: 'var(--emerald-glow)', border: 'rgba(16,185,129,0.2)' },
            { id: 'history',   label: 'View History',         desc: 'Past evaluations & scores',  icon: Clock,       color: 'var(--sky-400)',     glow: 'var(--sky-glow)',     border: 'rgba(14,165,233,0.2)' },
            { id: 'resources', label: 'ATS Guidelines',       desc: 'Best practices & keywords',  icon: CheckCircle2, color: 'var(--amber-400)',  glow: 'var(--amber-glow)',   border: 'rgba(245,158,11,0.2)' },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-all animate-fadeUp"
                style={{
                  animationDelay: `${0.2 + idx * 0.06}s`,
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--bg-overlay)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: action.glow, border: `1px solid ${action.border}` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: action.color }} />
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1px' }}>
                    {action.label}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {action.desc}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-40" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
