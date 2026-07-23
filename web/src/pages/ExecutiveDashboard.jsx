import React, { useEffect, useState } from 'react';
import {
  FileCheck,
  TrendingUp,
  Award,
  Zap,
  Target,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { fetchHistory } from '../services/api';

export default function ExecutiveDashboard({ onNavigate, token = '' }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchHistory(token);
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [token]);

  // Calculate dynamic metrics from real database history
  const totalAudits = history.length;
  const avgScore = totalAudits > 0
    ? (history.reduce((acc, curr) => acc + (curr.ats_score || 0), 0) / totalAudits).toFixed(1)
    : '0.0';

  const avgMatch = totalAudits > 0
    ? (history.reduce((acc, curr) => acc + (curr.keyword_match || 0), 0) / totalAudits).toFixed(1)
    : '0.0';

  const kpiStats = [
    { label: 'Overall ATS Average', value: totalAudits > 0 ? `${avgScore}` : 'N/A', icon: Award, color: 'text-indigo-400' },
    { label: 'Avg Keyword Match', value: totalAudits > 0 ? `${avgMatch}%` : 'N/A', icon: Target, color: 'text-emerald-400' },
    { label: 'Stored Resume Scans', value: `${totalAudits}`, icon: Zap, color: 'text-sky-400' },
    { label: 'System Engine', value: 'Hybrid NLP', icon: CheckCircle2, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="linear-card p-8 bg-gradient-to-r from-[#121827] via-[#1E293B] to-[#090D16] border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Optimization Suite</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Welcome to Resumely Executive Dashboard
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run multi-dimensional ATS resume evaluations, verify project skill experience with Sentence Transformer vector embeddings, and generate formal PDF reports.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scorer')}
          className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Launch ATS Scorer</span>
        </button>
      </div>

      {/* Dynamic KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="linear-card p-5 linear-card-hover flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold mono-val text-slate-100">{kpi.value}</span>
                <span className="text-[10px] font-mono text-slate-500">Live DB Metric</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Log */}
      <div className="linear-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Recent Evaluation Records</span>
        </h3>

        {loading ? (
          <p className="text-xs text-slate-500 font-mono">Loading real-time DB metrics...</p>
        ) : history.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
            No evaluations run yet. Upload your first resume in the ATS Scorer tab to generate live metrics!
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">{item.filename}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {Math.round(item.ats_score || 0)} / 100
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
