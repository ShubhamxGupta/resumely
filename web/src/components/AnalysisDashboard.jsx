import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Target,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Zap,
  Activity
} from 'lucide-react';

export default function AnalysisDashboard({ analysis, onDownloadPdf }) {
  if (!analysis) return null;

  const score = Math.round(analysis.ats_score || analysis.ATS_score || 0);
  const interpretation = analysis.interpretation || 'ATS Evaluation Complete';
  const componentScores = analysis.component_scores || {};
  const issues = analysis.detailed_feedback || [];
  const jdComparison = analysis.jd_match_analysis || analysis.jd_comparison || null;
  const skillValidation = analysis.skill_validation_details || null;

  // Radar Chart Data (5 Dimensions)
  const radarData = [
    { category: 'Formatting', score: componentScores.formatting || 0, max: 20 },
    { category: 'Keywords', score: componentScores.keywords || 0, max: 25 },
    { category: 'Content Quality', score: componentScores.content || 0, max: 25 },
    { category: 'Skill Validation', score: componentScores.skill_validation || 0, max: 15 },
    { category: 'ATS Reader', score: componentScores.ats_compatibility || 0, max: 15 },
  ].map(d => ({
    ...d,
    normalized: Math.round((d.score / d.max) * 100)
  }));

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Score Section & Radar Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Overall Score Card */}
        <div className="linear-card p-6 flex flex-col items-center justify-center text-center">
          <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center mb-3 shadow-xl ${getScoreColor(score)}`}>
            <span className="text-5xl font-extrabold mono-val tracking-tight">{score}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono mt-0.5">/ 100</span>
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-1">Overall ATS Compatibility</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{interpretation}</p>
        </div>

        {/* Radar Chart: 5 Dimension Analysis */}
        <div className="linear-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>5-Dimensional Skill Radar</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">100% Normalized</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Candidate" dataKey="normalized" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Target Job Description Comparison Grid */}
      {jdComparison && (
        <div className="linear-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              <span>Target Job Description Match Analysis</span>
            </h3>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              {Math.round(jdComparison.match_percentage || 0)}% Total Keyword Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase font-mono tracking-wider">
                Matched Keywords ({jdComparison.matched_keywords?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(jdComparison.matched_keywords || []).map((kw, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-amber-400 uppercase font-mono tracking-wider">
                Missing Required Terms ({jdComparison.missing_keywords?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(jdComparison.missing_keywords || []).map((kw, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Detailed Recommendations */}
      <div className="linear-card p-6">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Actionable ATS Recommendations</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            {issues.length} Flagged Items
          </span>
        </div>

        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${issue.severity_level === 'High' ? 'text-rose-400' : 'text-amber-400'}`} />
                <h4 className="text-xs font-semibold text-slate-200">{issue.issue_title}</h4>
                <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ml-auto ${
                  issue.severity_level === 'High'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {issue.severity_level} Severity
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{issue.explanation}</p>
              {issue.how_to_fix && (
                <div className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5 mt-2">
                  <strong className="block font-semibold mb-0.5">How to Fix:</strong>
                  <span>{issue.how_to_fix}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Export Toolbar */}
      <div className="linear-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Export Analysis Report</h4>
          <p className="text-xs text-slate-400">Generate executive PDF audit report</p>
        </div>
        <button
          onClick={onDownloadPdf}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Download Executive PDF</span>
        </button>
      </div>
    </div>
  );
}
